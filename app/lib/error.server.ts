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
