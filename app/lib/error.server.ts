/**
 * Grazie
 * @package Status Library
 * @copyright Copyright (c) 2024 David Dyess II
 * @license MIT see LICENSE
 */
export function status(type: number) {
  switch (type) {
    case 404:
      throw new Response(null, {
        status: 404,
        statusText: 'Not Found'
      });
    default:
      throw new Response(null, {
        status: 500,
        statusText: 'Unknown Error'
      });
  }
}
