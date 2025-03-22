import { site } from '@/grazie';
import { Opml } from '@gaphub/feed';
import type { LoaderFunctionArgs } from 'react-router';
import { createAbility } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!request?.ability) {
    await createAbility(request);
  }

  const opml = new Opml();
  opml.setHead('title', site.name);
  opml.setHead('description', site.description);
  opml.setHead('url', site.url);
  opml.addOutline({
    text: site.name,
    outlines: [
      {
        text: `Latest Posts - RSS | ${site.name}`,
        type: 'rss',
        xmlUrl: `${site.url}/feed.rss`
      },
      {
        text: `Latest Posts - Atom | ${site.name}`,
        type: 'atom',
        xmlUrl: `${site.url}/feed.atom`
      },
      {
        text: `Latest Posts - JSON | ${site.name}`,
        type: 'json',
        xmlUrl: `${site.url}/feed.json`
      },
      {
        text: `openSUSE Tumbleweed Snapshots - RSS | ${site.name}`,
        type: 'rss',
        xmlUrl: `${site.url}/tumbleweed/feed.rss`
      },
      {
        text: `openSUSE Tumbleweed Snapshots - Atom | ${site.name}`,
        type: 'atom',
        xmlUrl: `${site.url}/tumbleweed/feed.atom`
      },
      {
        text: `openSUSE Tumbleweed Snapshots - JSON | ${site.name}`,
        type: 'json',
        xmlUrl: `${site.url}/tumbleweed/feed.json`
      }
    ]
  });

  return new Response(opml.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/x-opml' }
  });
}
