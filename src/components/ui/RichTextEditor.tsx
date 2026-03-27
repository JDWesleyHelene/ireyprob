"use client";
import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface RichTextEditorProps {
  label:    string;
  value:    string;
  onChange: (html: string) => void;
  rows?:    number;
}

const COLORS = [
  { label:"White",  val:"#F0EDE8" },
  { label:"Gold",   val:"#D4AF37" },
  { label:"Gray",   val:"rgba(240,237,232,0.5)" },
  { label:"Light",  val:"rgba(240,237,232,0.7)" },
];

const Btn = ({ active, onClick, title, children }: { active?:boolean; onClick:()=>void; title:string; children:React.ReactNode }) => (
  <button type="button" onClick={onClick} title={title}
    className={`px-2 py-1.5 rounded-sm text-[11px] transition-all ${active ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground hover:bg-foreground/10"}`}>
    {children}
  </button>
);

export default function RichTextEditor({ label, value, onChange, rows = 4 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none px-3 py-2.5 text-[13px] text-foreground/90 leading-relaxed min-h-[80px]",
        style: `min-height: ${rows * 24}px`,
      },
    },
  });

  const setColor = useCallback((color: string) => {
    editor?.chain().focus().setColor(color).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/40">{label}</label>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-foreground/5 border border-foreground/10 border-b-0 rounded-t-sm">
        {/* Text style */}
        <Btn active={editor.isActive("bold")}      onClick={()=>editor.chain().focus().toggleBold().run()}      title="Bold"><strong>B</strong></Btn>
        <Btn active={editor.isActive("italic")}    onClick={()=>editor.chain().focus().toggleItalic().run()}    title="Italic"><em>I</em></Btn>
        <Btn active={editor.isActive("underline")} onClick={()=>editor.chain().focus().toggleUnderline().run()} title="Underline"><span className="underline">U</span></Btn>
        <Btn active={editor.isActive("strike")}    onClick={()=>editor.chain().focus().toggleStrike().run()}    title="Strikethrough"><s>S</s></Btn>

        <div className="w-px h-4 bg-foreground/10 mx-1"/>

        {/* Headings */}
        <Btn active={editor.isActive("heading",{level:2})} onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()} title="Heading 2">H2</Btn>
        <Btn active={editor.isActive("heading",{level:3})} onClick={()=>editor.chain().focus().toggleHeading({level:3}).run()} title="Heading 3">H3</Btn>
        <Btn active={editor.isActive("paragraph")}         onClick={()=>editor.chain().focus().setParagraph().run()}           title="Paragraph">¶</Btn>

        <div className="w-px h-4 bg-foreground/10 mx-1"/>

        {/* Lists */}
        <Btn active={editor.isActive("bulletList")}  onClick={()=>editor.chain().focus().toggleBulletList().run()}  title="Bullet list">• List</Btn>
        <Btn active={editor.isActive("orderedList")} onClick={()=>editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1. List</Btn>

        <div className="w-px h-4 bg-foreground/10 mx-1"/>

        {/* Alignment */}
        <Btn active={editor.isActive({textAlign:"left"})}   onClick={()=>editor.chain().focus().setTextAlign("left").run()}   title="Align left">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </Btn>
        <Btn active={editor.isActive({textAlign:"center"})} onClick={()=>editor.chain().focus().setTextAlign("center").run()} title="Align center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </Btn>

        <div className="w-px h-4 bg-foreground/10 mx-1"/>

        {/* Colors */}
        <span className="text-[9px] text-foreground/30 uppercase tracking-widest px-1">Color</span>
        {COLORS.map(c => (
          <button key={c.val} type="button" title={c.label} onClick={() => setColor(c.val)}
            className="w-5 h-5 rounded-sm border border-foreground/20 hover:border-foreground/50 transition-all flex-shrink-0"
            style={{ backgroundColor: c.val }}/>
        ))}

        <div className="w-px h-4 bg-foreground/10 mx-1"/>

        {/* Clear */}
        <Btn active={false} onClick={()=>editor.chain().focus().unsetAllMarks().run()} title="Clear formatting">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/><line x1="18" y1="3" x2="21" y2="6"/></svg>
        </Btn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor}
        className="bg-foreground/5 border border-foreground/10 rounded-b-sm focus-within:border-foreground/30 transition-colors"/>

      {/* Tiptap prose styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; }
        .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 0.4rem 0; }
        .ProseMirror p  { margin: 0.3rem 0; }
        .ProseMirror ul { list-style: disc; padding-left: 1.2rem; margin: 0.3rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.2rem; margin: 0.3rem 0; }
        .ProseMirror s  { text-decoration: line-through; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: rgba(240,237,232,0.2); height: 0; pointer-events: none; }
      `}}/>
    </div>
  );
}
