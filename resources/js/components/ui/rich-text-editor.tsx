import { Extension } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code2,
    ExternalLink,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link2,
    Link2Off,
    List,
    ListOrdered,
    Redo2,
    RemoveFormatting,
    Rows3,
    SplitSquareVertical,
    Strikethrough,
    Text,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type RichTextEditorProps = {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
};

// ─── Enter stays as paragraph break (not hard break) inside lists ─────────────
const SmartEnter = Extension.create({
    name: 'smartEnter',

    addKeyboardShortcuts() {
        return {
            // Inside a list → let Tiptap's default list behaviour handle Enter
            // Outside a list → create a new paragraph (default), not a hard break
        };
    },
});

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarButton({
    onClick,
    active,
    disabled,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: ReactNode;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                'h-8 w-8 rounded-lg p-0 text-[#526078] hover:bg-[#EAF0FF] hover:text-[#1D449C]',
                active && 'bg-[#EAF0FF] text-[#1D449C]',
            )}
        >
            {children}
        </Button>
    );
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
    return <div className="mx-1 h-6 w-px bg-[#DCE3F2]" />;
}

// ─── Link Dialog (inline) ─────────────────────────────────────────────────────
function LinkDialog({
    initialUrl,
    onConfirm,
    onCancel,
}: {
    initialUrl: string;
    onConfirm: (url: string) => void;
    onCancel: () => void;
}) {
    const [url, setUrl] = useState(initialUrl);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { e.preventDefault(); onConfirm(url); }
        if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    };

    return (
        <div className="absolute top-full left-0 z-50 mt-1 flex w-80 items-center gap-2 rounded-xl border border-[#DCE3F2] bg-white px-3 py-2.5 shadow-lg">
            <Link2 className="h-4 w-4 shrink-0 text-[#6B7894]" />
            <input
                autoFocus
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKey}
                placeholder="https://..."
                className="min-w-0 flex-1 text-sm outline-none text-[#102B5C] placeholder:text-[#93A1BC]"
            />
            <button
                type="button"
                onClick={() => onConfirm(url)}
                className="shrink-0 rounded-lg bg-[#1D449C] px-3 py-1 text-xs font-bold text-white hover:bg-[#17377E]"
            >
                OK
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#6B7894] hover:bg-[#F0F4FF]"
            >
                ✕
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Tuliskan deskripsi...',
    className,
    minHeight = '240px',
}: RichTextEditorProps) {
    const [showLinkDialog, setShowLinkDialog] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            SmartEnter,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    class: 'text-[#1D449C] underline cursor-pointer',
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '<p></p>',
        onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    });

    // Sync external value changes (e.g. when opening edit dialog)
    useEffect(() => {
        if (!editor) return;
        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
        }
    }, [editor, value]);

    // ── Link helpers ──────────────────────────────────────────────────────────
    const openLinkDialog = useCallback(() => {
        setShowLinkDialog(true);
    }, []);

    const confirmLink = useCallback((url: string) => {
        setShowLinkDialog(false);
        if (!editor) return;

        if (!url) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // Ensure protocol
        const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }, [editor]);

    const removeLink = useCallback(() => {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    }, [editor]);

    const openLinkInTab = useCallback(() => {
        if (!editor) return;
        const href = editor.getAttributes('link').href as string | undefined;
        if (href) window.open(href, '_blank', 'noopener,noreferrer');
    }, [editor]);

    if (!editor) return null;

    const isLinkActive = editor.isActive('link');
    const currentHref = editor.getAttributes('link').href as string | undefined;

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl border border-[#DCE3F2] bg-white',
                className,
            )}
        >
            {/* ── Toolbar ──────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-1 border-b border-[#E7ECF6] bg-[#F7F9FD] px-2 py-2">
                {/* Text styles */}
                <ToolbarButton
                    title="Paragraf"
                    active={editor.isActive('paragraph')}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                >
                    <Text className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 1"
                    active={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 2"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    active={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="size-4" />
                </ToolbarButton>

                <Divider />

                {/* Inline marks */}
                <ToolbarButton
                    title="Bold (Ctrl+B)"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic (Ctrl+I)"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Underline (Ctrl+U)"
                    active={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Strikethrough"
                    active={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Inline code"
                    active={editor.isActive('code')}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code2 className="size-4" />
                </ToolbarButton>

                <Divider />

                {/* Link group */}
                <div className="relative">
                    <ToolbarButton
                        title={isLinkActive ? 'Edit Link' : 'Insert Link (Ctrl+K)'}
                        active={isLinkActive}
                        onClick={openLinkDialog}
                    >
                        <Link2 className="size-4" />
                    </ToolbarButton>

                    {showLinkDialog && (
                        <LinkDialog
                            initialUrl={currentHref ?? ''}
                            onConfirm={confirmLink}
                            onCancel={() => setShowLinkDialog(false)}
                        />
                    )}
                </div>

                {isLinkActive && (
                    <>
                        <ToolbarButton
                            title="Open link in new tab"
                            onClick={openLinkInTab}
                        >
                            <ExternalLink className="size-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            title="Remove link"
                            onClick={removeLink}
                        >
                            <Link2Off className="size-4" />
                        </ToolbarButton>
                    </>
                )}

                <Divider />

                {/* Lists & blocks */}
                <ToolbarButton
                    title="Bullet List"
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered List"
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Blockquote"
                    active={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Rows3 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Hard line break (Shift+Enter)"
                    onClick={() => editor.chain().focus().setHardBreak().run()}
                >
                    <SplitSquareVertical className="size-4" />
                </ToolbarButton>

                <Divider />

                {/* Utility */}
                <ToolbarButton
                    title="Clear formatting"
                    onClick={() =>
                        editor.chain().focus().clearNodes().unsetAllMarks().run()
                    }
                >
                    <RemoveFormatting className="size-4" />
                </ToolbarButton>

                <Divider />

                <ToolbarButton
                    title="Undo (Ctrl+Z)"
                    disabled={!editor.can().chain().focus().undo().run()}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo2 className="size-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo (Ctrl+Shift+Z)"
                    disabled={!editor.can().chain().focus().redo().run()}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo2 className="size-4" />
                </ToolbarButton>
            </div>

            {/* ── Editor content area ───────────────────────────────────────── */}
            <EditorContent
                editor={editor}
                style={{ minHeight }}
                className={cn(
                    'px-4 py-3 text-sm leading-relaxed text-[#102B5C]',
                    // ProseMirror container
                    '[&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror]:outline-none',
                    // Spacing between block nodes
                    '[&_.ProseMirror>*+*]:mt-2.5',
                    // Placeholder
                    '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
                    '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
                    '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
                    '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[#93A1BC]',
                    '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
                    // Headings
                    '[&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-black [&_.ProseMirror_h1]:leading-tight [&_.ProseMirror_h1]:text-[#102B5C]',
                    '[&_.ProseMirror_h2]:text-xl  [&_.ProseMirror_h2]:font-black [&_.ProseMirror_h2]:leading-tight [&_.ProseMirror_h2]:text-[#102B5C]',
                    '[&_.ProseMirror_h3]:text-lg  [&_.ProseMirror_h3]:font-bold  [&_.ProseMirror_h3]:leading-snug  [&_.ProseMirror_h3]:text-[#102B5C]',
                    // Lists — critical: must set list-style and padding
                    '[&_.ProseMirror_ul]:list-disc   [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:space-y-0.5',
                    '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:space-y-0.5',
                    '[&_.ProseMirror_li]:leading-relaxed',
                    '[&_.ProseMirror_li>p]:my-0',
                    // Nested lists
                    '[&_.ProseMirror_ul_ul]:list-[circle]  [&_.ProseMirror_ul_ul]:pl-4',
                    '[&_.ProseMirror_ol_ol]:list-[lower-alpha] [&_.ProseMirror_ol_ol]:pl-4',
                    // Blockquote
                    '[&_.ProseMirror_blockquote]:border-l-[3px] [&_.ProseMirror_blockquote]:border-[#1D449C]/30 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-[#526078] [&_.ProseMirror_blockquote]:italic',
                    // Inline code
                    '[&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:bg-[#F0F4FF] [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-[0.85em] [&_.ProseMirror_code]:text-[#1D449C]',
                    // Horizontal rule
                    '[&_.ProseMirror_hr]:my-4 [&_.ProseMirror_hr]:border-[#DCE3F2]',
                    // Link
                    '[&_.ProseMirror_a]:text-[#1D449C] [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:cursor-pointer',
                )}
            />
        </div>
    );
}
