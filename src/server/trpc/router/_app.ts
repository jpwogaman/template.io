import { router } from '@/server/trpc/trpc'
import { ItemsRouter } from '@/server/trpc/router/items'
import { TauriMenuEvents } from '@/server/trpc/router/tauriMenuEvent'

export const appRouter = router({
  items: ItemsRouter,
  tauriMenuEvents: TauriMenuEvents
})

// export type definition of API
export type AppRouter = typeof appRouter
