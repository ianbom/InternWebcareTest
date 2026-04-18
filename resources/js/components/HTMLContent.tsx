import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HTMLContentProps extends HTMLAttributes<HTMLDivElement> {
    html?: string | null;
    emptyFallback?: ReactNode;
}

/**
 * Renders Tiptap / ProseMirror rich-text HTML safely.
 *
 * Uses direct child-selector Tailwind classes ([&_tag]) instead of the
 * @tailwindcss/typography prose-* modifiers so that bullet points, numbering,
 * indentation, headings, and all other formatting always render correctly
 * regardless of whether the typography plugin is installed / configured.
 */
export default function HTMLContent({
    html,
    emptyFallback = null,
    className = '',
    ...props
}: HTMLContentProps) {
    if (!html?.trim()) {
        return <>{emptyFallback}</>;
    }

    return (
        <div
            {...props}
            className={cn(
                /* ── Paragraphs ────────────────────────────────────────── */
                '[&_p]:my-2.5 [&_p]:leading-[1.85] [&_p]:text-[#65708C]',

                /* ── Headings ──────────────────────────────────────────── */
                '[&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-black [&_h1]:tracking-tight [&_h1]:text-[#0F1E46]',
                '[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-[#0F1E46]',
                '[&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-bold  [&_h3]:text-[#0F1E46]',
                '[&_h4]:mt-4 [&_h4]:mb-1 [&_h4]:text-sm  [&_h4]:font-bold  [&_h4]:text-[#0F1E46]',

                /* ── Inline ────────────────────────────────────────────── */
                '[&_strong]:font-bold [&_strong]:text-[#0F1E46]',
                '[&_em]:italic [&_em]:text-[#65708C]',
                '[&_s]:line-through [&_s]:text-[#9aa3b5]',
                '[&_u]:underline',

                /* ── Links ─────────────────────────────────────────────── */
                '[&_a]:font-semibold [&_a]:text-[#0E3F97] [&_a]:no-underline [&_a:hover]:underline',

                /* ── Unordered list ────────────────────────────────────── */
                '[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5',
                /* nested */
                '[&_ul_ul]:my-1 [&_ul_ul]:list-[circle] [&_ul_ul]:pl-4',
                '[&_ul_ul_ul]:list-[square]',

                /* ── Ordered list ──────────────────────────────────────── */
                '[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5',
                /* nested */
                '[&_ol_ol]:my-1 [&_ol_ol]:list-[lower-alpha] [&_ol_ol]:pl-4',

                /* ── List items ────────────────────────────────────────── */
                '[&_li]:text-[#65708C] [&_li]:leading-relaxed',
                '[&_li>p]:my-0',  /* remove extra paragraph margin inside <li> */

                /* ── Blockquote ────────────────────────────────────────── */
                '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#0E3F97]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#65708C]',

                /* ── Code ──────────────────────────────────────────────── */
                '[&_code]:rounded [&_code]:bg-[#F0F4FF] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.82em] [&_code]:text-[#0E3F97]',
                '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-[#F0F4FF] [&_pre]:p-4',
                '[&_pre_code]:bg-transparent [&_pre_code]:p-0',

                /* ── Horizontal rule ───────────────────────────────────── */
                '[&_hr]:my-5 [&_hr]:border-[#E3E8F2]',

                /* ── Table ─────────────────────────────────────────────── */
                '[&_table]:my-4 [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse',
                '[&_th]:border [&_th]:border-[#E3E8F2] [&_th]:bg-[#F5F7FB] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th]:text-[#0F1E46]',
                '[&_td]:border [&_td]:border-[#E3E8F2] [&_td]:px-3 [&_td]:py-2 [&_td]:text-[#65708C]',

                /* ── Images ────────────────────────────────────────────── */
                '[&_img]:my-4 [&_img]:rounded-xl [&_img]:max-w-full',

                className,
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
