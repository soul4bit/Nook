"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Heading2, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialContent = `
  <h2>Новая мысль</h2>
  <p>Что сейчас кажется важным и почему?</p>
`;

export function ThoughtEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Начни писать мысль...",
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "nook-editor min-h-64 rounded-2xl border border-stone-900/10 bg-white px-4 py-3 text-[15px] leading-7 text-stone-800 focus-visible:outline-none",
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
            "border-stone-900/10 bg-white/80",
            editor.isActive("bold") && "bg-stone-900 text-white hover:bg-stone-800"
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
            "border-stone-900/10 bg-white/80",
            editor.isActive("heading", { level: 2 }) &&
              "bg-stone-900 text-white hover:bg-stone-800"
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
            "border-stone-900/10 bg-white/80",
            editor.isActive("bulletList") &&
              "bg-stone-900 text-white hover:bg-stone-800"
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
            "border-stone-900/10 bg-white/80",
            editor.isActive("orderedList") &&
              "bg-stone-900 text-white hover:bg-stone-800"
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
