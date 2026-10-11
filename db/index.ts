import "server-only"

import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "./schema"

export function getDb() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL is required to connect to Neon")
  }

  return drizzle(url, { schema })
}
