import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import { IconBrandYoutube as IconYoutube } from '@tabler/icons-react';

export default function YouTubeEmbed() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => {
        const url = prompt('Enter YouTube URL');
        if (url && editor) {
          editor?.commands.setYoutubeVideo({
            src: url,
            width: 280,
            height: 158
          });
        }
      }}
      aria-label="YouTube Embed"
      title="YouTube Embed"
    >
      <IconYoutube stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}
