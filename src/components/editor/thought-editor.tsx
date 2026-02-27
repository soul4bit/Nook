"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialContent = `
  <h2>Новая страница</h2>
  <p>Что важно зафиксировать сейчас, пока мысль еще живая?</p>
`;

export function ThoughtEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Начни писать страницу, идею или связку мыслей...",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "nook-editor min-h-72 rounded-[28px] border border-emerald-100 bg-white/90 px-5 py-4 text-[15px] leading-7 text-emerald-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] focus-visible:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            "rounded-xl border-emerald-200 bg-white/80 text-emerald-950 hover:bg-emerald-50",
            editor.isActive("bold") &&
              "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500"
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
          Bold
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            "rounded-xl border-emerald-200 bg-white/80 text-emerald-950 hover:bg-emerald-50",
            editor.isActive("heading", { level: 2 }) &&
              "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500"
          )}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 />
          H2
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            "rounded-xl border-emerald-200 bg-white/80 text-emerald-950 hover:bg-emerald-50",
            editor.isActive("bulletList") &&
              "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500"
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
          List
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            "rounded-xl border-emerald-200 bg-white/80 text-emerald-950 hover:bg-emerald-50",
            editor.isActive("orderedList") &&
              "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500"
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
          Numbered
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
