import { router } from '@/server/trpc/trpc'
import { authRouter } from '@/server/trpc/router/auth'
import { exampleRouter } from '@/server/trpc/router/example'

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
