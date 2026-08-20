import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Client = NeonQueryFunction<false, false>;

let client: Client | null = null;

/**
 * Connects on first query rather than at import time, so `next build` works
 * on a machine that has no DATABASE_URL — every page here is dynamic anyway.
 */
function getClient(): Client {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Copy .env.local.example to .env.local and " +
          "paste the Neon connection string, or add it to the Vercel project."
      );
    }
    client = neon(url);
  }
  return client;
}

export const sql = new Proxy(function () {} as unknown as Client, {
  apply(_target, _thisArg, args) {
    return (getClient() as unknown as (...a: unknown[]) => unknown)(...args);
  },
  get(_target, property) {
    const instance = getClient() as unknown as Record<string | symbol, unknown>;
    const value = instance[property];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
