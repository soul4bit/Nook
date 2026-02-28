"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, List, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialContent = `
  <h2>Новая заметка</h2>
  <p>Зафиксируй мысль, пока она еще живая.</p>
`;

export function ThoughtEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Начни писать заметку, идею или короткий черновик...",
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
          Жирный
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
          Заголовок
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
          Список
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
          Нумерация
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

