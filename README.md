# Welcome to the Grazie! Project

Grazie! is a themeable, standalone, and general purpose publishing platform built with Remix, Prisma, Mantine, and an SQLite database.

- [Remix Docs](https://remix.run/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Generate Database Migration

```sh
npx prisma migrate dev --name init
```

## Deployment

### Deploy Database Migration

```sh
npx prisma migrate deploy
```

### Build

First, build your app for production:

```sh
npm run build
```

### Serve

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
