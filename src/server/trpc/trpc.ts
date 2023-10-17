import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  }
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure