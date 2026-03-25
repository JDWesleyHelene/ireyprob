"use client";
import { useEffect } from "react";
import { useSettings } from "@/lib/useLiveData";

// Injects CSS custom properties for font sizes from admin settings
export default function FontController() {
  const settings = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.font_h1)    root.style.setProperty("--size-h1",    settings.font_h1);
    if (settings.font_h2)    root.style.setProperty("--size-h2",    settings.font_h2);
    if (settings.font_h3)    root.style.setProperty("--size-h3",    settings.font_h3);
    if (settings.font_body)  root.style.setProperty("--size-body",  settings.font_body);
    if (settings.font_small) root.style.setProperty("--size-small", settings.font_small);
  }, [settings]);

  return null;
}
