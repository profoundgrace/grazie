import Bible, { loader } from '!~/routes/bible';
import type { MetaFunction } from 'react-router';
import { SEO } from '~/utils/meta';
import { site, metaSettings } from '@/grazie';

export const meta: MetaFunction = ({ matches }) => {
  return SEO({
    meta: {
      seo: {
        title: metaSettings?.home?.title ?? '',
        description: site?.description
      }
    },
    contentPage: false,
    matches
  });
};

export { loader } from '!~/routes/bible';

export default Bible;
