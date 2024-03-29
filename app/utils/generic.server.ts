/**
 * Grazie
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
import { randomUUID } from 'crypto';
import { getUnixTime, format as dateFormat } from 'date-fns';
import { getLogger } from '~/utils/logger.server';
import md5 from 'md5';

const log = getLogger('Generic Server Utilities');
/**
 * AWS Storage URL
 */

export const awsServer = `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_DEFAULT_REGION}.amazonaws.com/`;
/**
 * Get IP Address from Request
 * @param {} req
 * @returns
 */
export function getIpAddress(req) {
  try {
    return (
      (req.headers?.['x-forwarded-for'] || '').split(',').pop().trim() ||
      req?.socket?.remoteAddress
    );
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Generate Identifier from Request
 * @param {*} req
 * @returns
 */
export function getRequestIdentifier(req) {
  try {
    return md5(`${getIpAddress(req)} + ${req?.headers?.['user-agent']}`);
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
/**
 * Current Time Stamp
 * @returns Unix Timestamp in Seconds
 */
export const timeStamp = () => {
  try {
    return getUnixTime(Date.now());
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Current Time String
 * @returns Date String
 */
export const timeString = () => {
  try {
    const date = new Date(Date.now());

    return date.toISOString();
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Formatted Date String
 * @param {*} object { timestamp, format }
 * @returns string
 */
export function dateString({
  timestamp,
  format = undefined
}: {
  timestamp: number;
  format?: string;
}) {
  if (typeof timestamp === 'number') {
    timestamp = timestamp * 1000;
  }

  if (format) {
    return dateFormat(new Date(timestamp), format);
  } else {
    return new Date(timestamp);
  }
}

/**
 * Future Time Stamp
 */
export const futureTime = ({ hours }: { hours: number }) => {
  try {
    const date = new Date(Date.now() + hours * 60 * 60 * 1000);

    return date.toISOString();
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
};

/**
 * Random Number Generator
 * @param {number} length
 * @param {boolean} str
 * @returns number || string
 */
export const randomNumber = (length: number, str = false) => {
  try {
    let min = '1';

    let max = '9';

    let i = 1;

    while (i < length) {
      min += '0';
      max += '0';
      i++;
    }
    const rand = Math.floor(Number(min) + Math.random() * Number(max));

    if (str) {
      return `${rand}`;
    } else {
      return rand;
    }
  } catch (err: any) {
    log.error(err.message);
  }
};

/**
 * Generate UUID
 * @returns string
 */
export const uuid = () => {
  return randomUUID();
};
/**
 * Strip HTML Tags
 * @param {string} value
 * @returns string
 */
export const stripTags = (value: string) => {
  return value.replace(/(<([^>]+)>)/gi, '');
};
