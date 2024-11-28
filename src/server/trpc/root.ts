import { createTRPCRouter, createCallerFactory } from '@/server/trpc/trpc'
import { ItemsRouter } from '@/server/trpc/routers/items'
import { TauriMenuEvents } from '@/server/trpc/routers/tauriMenuEvent'

export const appRouter = createTRPCRouter({
  items: ItemsRouter,
  tauriMenuEvents: TauriMenuEvents
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
