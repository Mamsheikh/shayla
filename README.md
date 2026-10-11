# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Database

Drizzle uses Neon Postgres. Set `DATABASE_URL` to the pooled connection string and
`DATABASE_URL_UNPOOLED` to the direct connection string in `.env.local`. The
runtime database client is available through `getDb()` from `@/db` in server
code. The `bots` table stores a Clerk `userId`, bot identity, job,
instructions, optional sandbox ID, and creation time. Drizzle generates the
`id` and `avatar` Nano IDs when inserting a bot. Scope bot queries to the
authenticated user's ID.

Edit tables in `db/schema.ts`, then push the schema to Neon:

```bash
npm run db:push
```

Schema push uses the direct connection. `npm run db:studio` opens Drizzle Studio.
