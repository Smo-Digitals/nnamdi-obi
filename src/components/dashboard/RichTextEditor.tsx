'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import YoutubeExtension from '@tiptap/extension-youtube';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { useEffect, useRef } from 'react';
import {
  TextBolder, TextItalic, TextStrikethrough, Code, PenNib,
  ListBullets, ListNumbers, Quotes, Minus, Image, Link,
  ArrowCounterClockwise, ArrowClockwise, YoutubeLogo, Palette,
} from 'phosphor-react';

interface Props {
  value:    string;
  onChange: (html: string) => void;
}

function ToolBtn({
  onClick, active = false, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors ${
        active
          ? 'bg-[#DC5B17]/20 text-[#DC5B17]'
          : 'text-[#666] hover:text-white hover:bg-white/[0.08]'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-white/[0.08] mx-0.5 self-center" />;
}

export function RichTextEditor({ value, onChange }: Props) {
  const colorRef  = useRef<HTMLInputElement>(null);
  const imageRef  = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      ImageExtension.configure({ inline: false, allowBase64: true }),
      LinkExtension.configure({ openOnClick: false }),
      YoutubeExtension.configure({ width: 640, height: 360 }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[260px] px-4 py-3 focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  if (!editor) return null;

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'editor');
    const res = await fetch('/api/upload-image', { method: 'POST', body: form });
    if (!res.ok) return;
    const { url } = await res.json();
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function addImage() { imageRef.current?.click(); }

  function addLink() {
    const url = window.prompt('URL');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
    else editor?.chain().focus().unsetLink().run();
  }

  function addYoutube() {
    const url = window.prompt('YouTube URL');
    if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  return (
    <div className="rounded-xl border" style={{ borderColor: 'var(--adm-border)' }}>
      <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
      {/* Toolbar — sticky so it stays visible while scrolling content */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b sticky top-0 z-10"
        style={{ backgroundColor: 'var(--adm-card)', borderColor: 'var(--adm-border)' }}
      >
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><ArrowCounterClockwise size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><ArrowClockwise size={14} /></ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><TextBolder size={14} weight="bold" /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><TextItalic size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><TextStrikethrough size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><Code size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight"><PenNib size={14} /></ToolBtn>

        {/* Text colour */}
        <div className="relative">
          <ToolBtn onClick={() => colorRef.current?.click()} title="Text color"><Palette size={14} /></ToolBtn>
          <input
            ref={colorRef}
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </div>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <span className="text-[10px] font-bold">H1</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <span className="text-[10px] font-bold">H2</span>
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <span className="text-[10px] font-bold">H3</span>
        </ToolBtn>

        <Divider />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><ListBullets size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListNumbers size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quotes size={14} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14} /></ToolBtn>

        <Divider />

        <ToolBtn onClick={addImage} title="Insert image"><Image size={14} /></ToolBtn>
        <ToolBtn onClick={addYoutube} title="Insert YouTube video"><YoutubeLogo size={14} /></ToolBtn>
        <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Insert link"><Link size={14} /></ToolBtn>
      </div>

      {/* Editor area */}
      <div style={{ backgroundColor: 'var(--adm-bg)' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
