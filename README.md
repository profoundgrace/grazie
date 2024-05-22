# Welcome to the Grazie! Project

Grazie! is a themeable, standalone, and general purpose publishing platform built with Remix, Prisma, Mantine, and an SQLite database.

- [Remix Docs](https://remix.run/docs)
- [Prisma Docs](https://www.prisma.io/docs)

## Database

Grazie! supports SQLite and has experimental PostgreSQL support (more database supported is planned). To select the database:

1. Set .env `DATABASE_URL` variable:
   - SQLite: `DATABASE_URL="file:./data.db"`
   - PostgreSQL: `DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"`

Note: Replace `username`, `password`, `host`, `database` (and potentially schema=public) above with appropriate values

2. Copy Prisma schema folder:
   - SQLite: `/prisma-sqlite` as `/prisma`
   - PostgreSQL: `/prisma-pg` as `/prisma`

The primary limitation of PostgreSQL is it is currently limited to `string` columns when `json` columns would be more efficient. In the future I plan to add database adapters to mitigate this limitation and enable the possibility of NoSQL databases.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

### Generate a Database Migration

Replace "setup" below with a name for the migration:

```sh
npx prisma migrate dev --name setup
```

### Generate an Empty Migration

```sh
npx prisma migrate dev --create-only
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
