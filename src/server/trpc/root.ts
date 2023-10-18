import { createTRPCRouter } from './trpc'
import { ItemsRouter } from '@/server/trpc/routers/items'
import { TauriMenuEvents } from '@/server/trpc/routers/tauriMenuEvent'

export const appRouter = createTRPCRouter({
  items: ItemsRouter,
  tauriMenuEvents: TauriMenuEvents
})

// export type definition of API
export type AppRouter = typeof appRouter
