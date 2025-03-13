import { index, prefix, route } from '@react-router/dev/routes';

export const siteRoutes = [
  ...prefix('bible', [
    index('../site/routes/bible.tsx'),
    route('nt', '../site/routes/bible_.nt.tsx'),
    route('ot', '../site/routes/bible_.ot.tsx'),
    route('search', '../site/routes/bible_.search.tsx'),
    route(':book/:chapterId', '../site/routes/bible_.$book_.$chapterId.tsx'),
    route(':book', '../site/routes/bible_.$book.tsx')
  ])
];
