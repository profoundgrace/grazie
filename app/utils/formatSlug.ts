import { timeString } from '~/utils/generic.server';
import { getLogger } from '~/utils/logger.server';
import { sanitize } from '~/utils/stringSanitizer';

const log = getLogger('Format Slug Utility');

/**
 * Slug Generator
 *
 * Generate URL safe string
 * @param {*} options
 * @returns string
 */
export const formatSlug = ({
  format = 'title',
  date = timeString(),
  divider = 'addDash',
  id,
  lowerCase = true,
  space = 'addUnderscore',
  title = sanitize[space]('no title'),
  slug
}: {
  format?: string;
  date?: string;
  divider?: string;
  id?: number | undefined;
  lowerCase?: boolean;
  space?: string;
  title?: string;
  slug?: string;
}) => {
  try {
    let url, year, monthDate, dateDate, mmDate, ddDate;

    if (format === 'date-id' || format === 'date-title') {
      const dateObject = new Date(date);

      year = dateObject.getFullYear();
      monthDate = dateObject.getMonth() + 1;
      dateDate = dateObject.getDate();
      mmDate = monthDate >= 10 ? monthDate : `0${monthDate}`;
      ddDate = dateDate >= 10 ? dateDate : `0${dateDate}`;
    }

    switch (format) {
      case 'date-id':
        url = sanitize[divider](`${year} ${mmDate}$ ${ddDate} `) + `${id}`;
        break;
      case 'date-title':
        url =
          sanitize[divider](`${year} ${mmDate} ${ddDate} `) +
          sanitize[space](title);
        break;
      case 'id':
        url = `${id}`;
        break;
      case 'id-title':
        url = sanitize[divider](`${id} `) + sanitize[space](title);
        break;
      case 'title':
        url = sanitize[space](title);
        break;
      case 'title-id':
        url = sanitize[space](title) + sanitize[divider](` ${id}`);
        break;
      case 'custom':
        url = sanitize[space](slug);
        break;
      default:
        url = sanitize[space](title) + sanitize[divider](` ${id}`);
        break;
    }
    return lowerCase ? url.toLowerCase() : url;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};
