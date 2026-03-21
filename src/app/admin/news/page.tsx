"use client";

import React, { useEffect, useState } from "react";

import ImageUpload from "@/components/admin/ImageUpload";
import { apiUrl } from "@/lib/apiConfig";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_image_alt: string;
  author: string;
  status: string;
  published_at: string;
  created_at: string;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<NewsArticle> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch(apiUrl("/api/admin/get-news.php"));
      if (res.ok) {
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      }
    } catch { /* silently fail */ }
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const openNew = () => setEditing({ title: "", slug: "", excerpt: "", content: "", cover_image: "", cover_image_alt: "", author: "IREY PROD", status: "draft" });
  const openEdit = (article: NewsArticle) => setEditing({ ...article });

  const handleSave = async () => {
    if (!editing?.title) return;
    setSaving(true);
    const isNew = !editing.id;
    const payload = {
      id: editing.id,
      title: editing.title,
      slug: editing.slug || slugify(editing.title),
      excerpt: editing.excerpt || "",
      content: editing.content || "",
      cover_image: editing.cover_image || "",
      cover_image_alt: editing.cover_image_alt || "",
      author: editing.author || "IREY PROD",
      status: editing.status || "draft",
      published_at: editing.status === "published" ? (editing.published_at || new Date().toISOString()) : editing.published_at,
    };

    let saveError = false;
    try {
      const res = await fetch(apiUrl(""/api/admin/save-news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) saveError = true;
    } catch { saveError = true; }
    setSaving(false);
    if (saveError) { showToast("Failed to save. Check server.", "error"); return; }
    showToast(isNew ? "Article created" : "Article updated");
    setEditing(null);
    fetchArticles();
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "published" ? "draft" : "published";
    try {
      await fetch(apiUrl(""/api/admin/save-news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, published_at: newStatus === "published" ? new Date().toISOString() : null, _action: "toggle_status" }),
      });
    } catch { /* silently fail */ }
    setArticles((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a));
    showToast(newStatus === "published" ? "Article published" : "Article unpublished");
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      await fetch(apiUrl(""/api/admin/save-news.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, _action: "delete" }),
      });
    } catch { /* silently fail */ }
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast("Article deleted");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm text-[12px] font-medium border ${
          toast.type === "success" ? "bg-foreground/10 border-foreground/20 text-foreground" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Editor modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/70 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label={editing.id ? "Edit article form" : "New article form"}>
          <div className="bg-[#0a0a0a] border border-foreground/10 rounded-sm w-full max-w-2xl mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/8">
              <h2 className="font-display text-xl font-light italic text-foreground">
                {editing.id ? "Edit Article" : "New Article"}
              </h2>
              <div className="flex items-center gap-3">
                {editing.id && editing.slug && (
                  <a
                    href={`/news/${editing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Preview article in new tab"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-foreground/15 text-foreground/40 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground/70 transition-all"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                    Preview
                  </a>
                )}
                <button onClick={() => setEditing(null)} aria-label="Close editor" className="min-h-[48px] min-w-[48px] flex items-center justify-center text-foreground/30 hover:text-foreground transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="news-title" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Title *</label>
                <input
                  id="news-title"
                  type="text"
                  value={editing.title || ""}
                  onChange={(e) => setEditing((prev) => ({
                    ...prev,
                    title: e.target.value,
                    slug: prev?.id ? prev.slug : slugify(e.target.value),
                  }))}
                  aria-label="Article title"
                  aria-required="true"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 min-h-[48px]"
                  placeholder="Article title"
                />
              </div>
              <div>
                <label htmlFor="news-slug" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Slug</label>
                <input
                  id="news-slug"
                  type="text"
                  value={editing.slug || ""}
                  onChange={(e) => setEditing((prev) => ({ ...prev, slug: e.target.value }))}
                  aria-label="Article URL slug"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground font-mono focus:outline-none focus:border-foreground/30 min-h-[48px]"
                  placeholder="article-slug"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Cover Image</label>
                <ImageUpload
                  value={editing.cover_image || ""}
                  onChange={(url) => setEditing((prev) => ({ ...prev, cover_image: url }))}
                  folder="news"
                />
              </div>
              <div>
                <label htmlFor="news-cover-alt" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Cover Image Alt Text</label>
                <input
                  id="news-cover-alt"
                  type="text"
                  value={editing.cover_image_alt || ""}
                  onChange={(e) => setEditing((prev) => ({ ...prev, cover_image_alt: e.target.value }))}
                  aria-label="Cover image alt text"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 min-h-[48px]"
                  placeholder="Describe the image"
                />
              </div>
              <div>
                <label htmlFor="news-excerpt" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Excerpt</label>
                <textarea
                  id="news-excerpt"
                  value={editing.excerpt || ""}
                  onChange={(e) => setEditing((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  aria-label="Article excerpt"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 resize-none"
                  placeholder="Short summary..."
                />
              </div>
              <div>
                <label htmlFor="news-content" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Content (HTML)</label>
                <textarea
                  id="news-content"
                  value={editing.content || ""}
                  onChange={(e) => setEditing((prev) => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  aria-label="Article content in HTML"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground font-mono focus:outline-none focus:border-foreground/30 resize-y"
                  placeholder="<p>Article content...</p>"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="news-author" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Author</label>
                  <input
                    id="news-author"
                    type="text"
                    value={editing.author || ""}
                    onChange={(e) => setEditing((prev) => ({ ...prev, author: e.target.value }))}
                    aria-label="Article author"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 min-h-[48px]"
                  />
                </div>
                <div>
                  <label htmlFor="news-status" className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 block mb-1.5">Status</label>
                  <select
                    id="news-status"
                    value={editing.status || "draft"}
                    onChange={(e) => setEditing((prev) => ({ ...prev, status: e.target.value }))}
                    aria-label="Article publication status"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-sm px-3 py-3 text-[13px] text-foreground focus:outline-none focus:border-foreground/30 min-h-[48px]"
                  >
                    <option value="draft" className="bg-[#0a0a0a]">Draft</option>
                    <option value="published" className="bg-[#0a0a0a]">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={() => setEditing(null)} aria-label="Cancel editing" className="flex-1 min-h-[48px] py-2.5 border border-foreground/10 text-foreground/40 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/20 transition-all">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} aria-label="Save article" className="flex-1 min-h-[48px] py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all disabled:opacity-50">
                  {saving ? "Saving..." : "Save Article"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground/30 block mb-1">— Content</span>
          <h1 className="font-display text-3xl font-light italic text-foreground">News & Blog</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/news"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-foreground/15 text-foreground/50 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:border-foreground/30 hover:text-foreground transition-all duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            Preview
          </a>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-semibold tracking-[0.15em] uppercase rounded-sm hover:bg-accent transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
            New Article
          </button>
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-foreground/[0.02] border border-foreground/8 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]" role="table" aria-label="News articles list">
            <thead>
              <tr className="border-b border-foreground/8">
                <th scope="col" className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Title</th>
                <th scope="col" className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden sm:table-cell">Status</th>
                <th scope="col" className="text-left px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30 hidden md:table-cell">Date</th>
                <th scope="col" className="text-right px-5 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/30">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-foreground/5">
                    <td className="px-5 py-4"><div className="h-4 bg-foreground/5 rounded animate-pulse w-48" /></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-4 bg-foreground/5 rounded animate-pulse w-16" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 bg-foreground/5 rounded animate-pulse w-24" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-foreground/5 rounded animate-pulse w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[13px] text-foreground/30">
                    No articles yet. <button onClick={openNew} className="text-foreground/50 hover:text-foreground underline">Create your first article</button>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-medium text-foreground/80">{article.title}</p>
                      <p className="text-[11px] text-foreground/30 font-mono">{article.slug}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-semibold tracking-[0.15em] uppercase border ${
                        article.status === "published" ?"text-green-400 bg-green-400/10 border-green-400/20" :"text-foreground/40 bg-foreground/5 border-foreground/10"
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-[12px] text-foreground/40">
                        {new Date(article.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/news/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Preview article: ${article.title}`}
                          className="min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0 flex items-center justify-center px-2.5 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/10 rounded-sm text-foreground/30 hover:text-foreground/60 hover:border-foreground/20 transition-all duration-200"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </a>
                        <button
                          onClick={() => toggleStatus(article.id, article.status)}
                          aria-label={article.status === "published" ? `Unpublish article: ${article.title}` : `Publish article: ${article.title}`}
                          className={`min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0 flex items-center justify-center px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border rounded-sm transition-all duration-200 ${
                            article.status === "published" ?"border-yellow-500/20 text-yellow-400/60 hover:text-yellow-400 hover:border-yellow-500/40" :"border-green-500/20 text-green-400/60 hover:text-green-400 hover:border-green-500/40"
                          }`}
                        >
                          {article.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => openEdit(article)}
                          aria-label={`Edit article: ${article.title}`}
                          className="min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0 flex items-center justify-center px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-foreground/15 rounded-sm text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id)}
                          aria-label={`Delete article: ${article.title}`}
                          className="min-h-[48px] min-w-[48px] sm:min-h-0 sm:min-w-0 flex items-center justify-center px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase border border-red-500/20 rounded-sm text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
