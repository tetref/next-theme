"use client";

import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { PageHeader } from "@dashboardpack/core/components/shared/page-header";
import { cn } from "@dashboardpack/core/lib/utils";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Link as LinkIcon,
  Code2,
  Minus,
  Quote,
  Undo2,
  Redo2,
  Highlighter,
  FileText,
  Copy,
  Download,
  Clock,
  Keyboard,
  Type,
  Hash,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Sample content to seed the editor
// ---------------------------------------------------------------------------
const sampleContent = `
<h2>Welcome to the Rich Text Editor</h2>
<p>This editor is powered by <strong>Tiptap</strong>, a headless, framework-agnostic rich text editor built on ProseMirror. It supports a wide range of formatting options that you can explore using the toolbar above.</p>

<h3>Key Features</h3>
<ul>
  <li>Full <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and <s>strikethrough</s> support</li>
  <li>Three heading levels for document structure</li>
  <li>Text alignment: left, center, right, and justify</li>
  <li>Bullet lists, ordered lists, and interactive task lists</li>
  <li>Inline <code>code</code> and fenced code blocks</li>
  <li><mark>Highlighted text</mark> for emphasis</li>
</ul>

<h3>Task List Example</h3>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true">Set up the Tiptap editor</li>
  <li data-type="taskItem" data-checked="true">Add toolbar with formatting controls</li>
  <li data-type="taskItem" data-checked="false">Write documentation for the team</li>
  <li data-type="taskItem" data-checked="false">Review and ship the feature</li>
</ul>

<blockquote><p>The best way to predict the future is to invent it. &mdash; Alan Kay</p></blockquote>

<pre><code>function greet(name: string): string {
  return \`Hello, \${name}! Welcome to Zenith.\`;
}</code></pre>

<p>Try editing this content, applying different formatting options, and exporting the result using the sidebar controls.</p>
`;

// ---------------------------------------------------------------------------
// Toolbar button component
// ---------------------------------------------------------------------------
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Toolbar divider
// ---------------------------------------------------------------------------
function ToolbarDivider() {
  return (
    <div className="mx-1 h-6 w-px shrink-0 bg-border" aria-hidden="true" />
  );
}

// ---------------------------------------------------------------------------
// Toolbar component
// ---------------------------------------------------------------------------
function EditorToolbar({
  editor,
}: {
  editor: ReturnType<typeof useEditor>;
}) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-3 py-2">
      {/* Text style */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive("taskList")}
        title="Task List"
      >
        <ListTodo className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Insert */}
      <ToolbarButton
        onClick={setLink}
        isActive={editor.isActive("link")}
        title="Insert Link"
      >
        <LinkIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <Code2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Highlight */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive("highlight")}
        title="Highlight"
      >
        <Highlighter className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 className="size-4" />
      </ToolbarButton>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function readingTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function EditorPage() {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 cursor-pointer",
        },
      }),
      Highlight.configure({
        multicolor: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: sampleContent,
    editorProps: {
      attributes: {
        class:
          "zenith-editor min-h-[400px] px-6 py-4 outline-none focus:outline-none",
      },
    },
    onCreate: ({ editor: e }) => {
      const text = e.getText();
      setWordCount(countWords(text));
      setCharCount(text.length);
    },
    onUpdate: ({ editor: e }) => {
      const text = e.getText();
      setWordCount(countWords(text));
      setCharCount(text.length);
    },
  });

  // ------ Export handlers ------
  const copyHtml = useCallback(() => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getHTML()).then(() => {
      toast.success("HTML copied to clipboard");
    });
  }, [editor]);

  const copyText = useCallback(() => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getText()).then(() => {
      toast.success("Plain text copied to clipboard");
    });
  }, [editor]);

  const downloadHtml = useCallback(() => {
    if (!editor) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Export</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #1a1a1a; }
    pre { background: #f4f4f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
    code { font-family: ui-monospace, monospace; font-size: 0.9em; }
    blockquote { border-left: 3px solid #d4d4d8; margin-left: 0; padding-left: 1rem; color: #52525b; }
    mark { background-color: #fef08a; padding: 0.125rem 0.25rem; border-radius: 0.125rem; }
    ul[data-type="taskList"] { list-style: none; padding-left: 0; }
    ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5rem; }
    ul[data-type="taskList"] li::before { content: none; }
  </style>
</head>
<body>
${editor.getHTML()}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded");
  }, [editor]);

  return (
    <>
      <div className="mb-6">
        <PageHeader
          title="Rich Text Editor"
          description="WYSIWYG editor powered by Tiptap."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Editor" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* ---- Editor Card (left) ---- */}
        <div className="xl:col-span-8">
          <Card>
            <EditorToolbar editor={editor} />
            <CardContent className="p-0">
              <EditorContent editor={editor} />
            </CardContent>
          </Card>
        </div>

        {/* ---- Sidebar (right) ---- */}
        <div className="space-y-6 xl:col-span-4">
          {/* Document Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-muted-foreground" />
                Document Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Type className="size-3.5" />
                  </div>
                  <p className="text-2xl font-bold tracking-tight">
                    {wordCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Words</p>
                </div>
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Hash className="size-3.5" />
                  </div>
                  <p className="text-2xl font-bold tracking-tight">
                    {charCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Characters</p>
                </div>
                <div className="space-y-1 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                  </div>
                  <p className="text-2xl font-bold tracking-tight">
                    {readingTime(wordCount).replace(" read", "")}
                  </p>
                  <p className="text-xs text-muted-foreground">Read time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="size-4 text-muted-foreground" />
                Export
              </CardTitle>
              <CardDescription>
                Copy or download the editor content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={copyHtml}
                >
                  <Copy className="size-4" />
                  Copy HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={copyText}
                >
                  <Copy className="size-4" />
                  Copy Text
                </Button>
                <Separator className="my-1" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={downloadHtml}
                >
                  <Download className="size-4" />
                  Download HTML
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Keyboard className="size-4 text-muted-foreground" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5 text-sm">
                {[
                  { keys: "Ctrl + B", action: "Bold" },
                  { keys: "Ctrl + I", action: "Italic" },
                  { keys: "Ctrl + U", action: "Underline" },
                  { keys: "Ctrl + Shift + X", action: "Strikethrough" },
                  { keys: "Ctrl + Shift + H", action: "Highlight" },
                  { keys: "Ctrl + Z", action: "Undo" },
                  { keys: "Ctrl + Shift + Z", action: "Redo" },
                ].map((shortcut) => (
                  <div
                    key={shortcut.keys}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground">
                      {shortcut.action}
                    </span>
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* -------------------------------------------------------------- */}
      {/*  Scoped editor styles                                           */}
      {/* -------------------------------------------------------------- */}
      <style>{`
        /* ---- General editor typography ---- */
        .zenith-editor {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--foreground);
        }

        .zenith-editor > *:first-child {
          margin-top: 0;
        }

        /* ---- Headings ---- */
        .zenith-editor h1 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.025em;
        }
        .zenith-editor h2 {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        .zenith-editor h3 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        /* ---- Paragraphs ---- */
        .zenith-editor p {
          margin-bottom: 0.75rem;
        }
        .zenith-editor p:last-child {
          margin-bottom: 0;
        }

        /* ---- Lists ---- */
        .zenith-editor ul,
        .zenith-editor ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .zenith-editor ul {
          list-style-type: disc;
        }
        .zenith-editor ol {
          list-style-type: decimal;
        }
        .zenith-editor li {
          margin-bottom: 0.25rem;
        }
        .zenith-editor li p {
          margin-bottom: 0.25rem;
        }

        /* ---- Task list ---- */
        .zenith-editor ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        .zenith-editor ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .zenith-editor ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-top: 0.25rem;
          user-select: none;
        }
        .zenith-editor ul[data-type="taskList"] li > label input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: var(--primary);
          cursor: pointer;
          border-radius: 0.25rem;
        }
        .zenith-editor ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        .zenith-editor ul[data-type="taskList"] li[data-checked="true"] > div {
          text-decoration: line-through;
          opacity: 0.6;
        }

        /* ---- Blockquote ---- */
        .zenith-editor blockquote {
          border-left: 3px solid var(--border);
          padding-left: 1rem;
          margin-left: 0;
          margin-bottom: 0.75rem;
          color: var(--muted-foreground);
          font-style: italic;
        }

        /* ---- Code (inline) ---- */
        .zenith-editor code {
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.875em;
          background-color: var(--muted);
          padding: 0.15rem 0.35rem;
          border-radius: 0.25rem;
        }

        /* ---- Code block ---- */
        .zenith-editor pre {
          background-color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
        }
        .zenith-editor pre code {
          background: none;
          padding: 0;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        /* ---- Horizontal rule ---- */
        .zenith-editor hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }

        /* ---- Highlight ---- */
        .zenith-editor mark {
          background-color: oklch(0.93 0.14 100);
          padding: 0.1rem 0.2rem;
          border-radius: 0.15rem;
        }
        :is(.dark) .zenith-editor mark {
          background-color: oklch(0.55 0.14 100);
          color: oklch(0.98 0 0);
        }

        /* ---- Link ---- */
        .zenith-editor a {
          color: var(--primary);
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }
        .zenith-editor a:hover {
          opacity: 0.8;
        }

        /* ---- Placeholder ---- */
        .zenith-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted-foreground);
          pointer-events: none;
          height: 0;
        }

        /* ---- Selection ---- */
        .zenith-editor ::selection {
          background-color: var(--primary);
          color: var(--primary-foreground);
        }

        /* ---- Images ---- */
        .zenith-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }

        /* ---- Strong / Emphasis ---- */
        .zenith-editor strong {
          font-weight: 700;
        }
        .zenith-editor em {
          font-style: italic;
        }
        .zenith-editor s {
          text-decoration: line-through;
        }
        .zenith-editor u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
      `}</style>
    </>
  );
}
