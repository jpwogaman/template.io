import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'

export const TestRouter = createTRPCRouter({
  export: publicProcedure.query(async () => {
    return {
      message: 'Hello world!'
    }
  })
})