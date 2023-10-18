import { createNextApiHandler } from '@trpc/server/adapters/next'

import { env } from '@/env.mjs'
import { createTRPCContext } from '@/server/trpc/trpc'
import { appRouter } from '@/server/trpc/root'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path}: ${error.message}`)
        }
      : undefined
})
