# Welcome to the Grazie! Project

Grazie! is a themeable, standalone, and general purpose publishing platform built with Remix, Prisma, Mantine, and an SQLite database.

- [Remix Docs](https://remix.run/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## Database

Grazie! supports PostgreSQL and SQLite (more supported planned). To select the database:

1. Set .env `DATABASE_URL` variable:
   - PostgreSQL: `DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"`
   - SQLite: `DATABASE_URL="file:./database.db"`

Note: Replace `username`, `password`, `host`, `database` (and potentially schema=public) above with appropriate values

2. Copy Prisma schema folder:
   - PostgreSQL: `/prisma-pg` as `/prisma`
   - SQLite: `/prisma-sqlite` as `/prisma`

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Generate Database Migration

Replace "setup" below with a name for the migration:

```sh
npx prisma migrate dev --name setup
```

### Migrate Database

```sh
npx prisma migrate dev
```

## Deployment

### Deploy Database

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
