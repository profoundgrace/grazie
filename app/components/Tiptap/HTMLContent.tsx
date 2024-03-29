/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
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
  content,
  classes
}: {
  content: { type?: string; content?: JSONContent[] | undefined };
  classes?: any;
}) {
  return (
    <TypographyStylesProvider
      pl={0}
      mb={0}
      className={classes?.body ? classes.body : undefined}
    >
      <div
        className={classes?.content ? classes.content : undefined}
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
