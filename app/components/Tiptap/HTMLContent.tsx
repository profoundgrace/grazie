import { TypographyStylesProvider } from '@mantine/core';
import type { JSONContent } from '@tiptap/core';
import { Highlight } from '@tiptap/extension-highlight';
import { StarterKit } from '@tiptap/starter-kit';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { generateHTML } from '@tiptap/html';

export default function HTMLContent({
  content
}: {
  content: { type?: string; content?: JSONContent[] | undefined };
}) {
  return (
    <TypographyStylesProvider pl={0} mb={0}>
      <div
        dangerouslySetInnerHTML={{
          __html: generateHTML(content, [
            StarterKit,
            Highlight,
            Subscript,
            Superscript,
            TextAlign,
            Underline
          ])
        }}
      />
    </TypographyStylesProvider>
  );
}
