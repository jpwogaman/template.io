import { router, publicProcedure, protectedProcedure } from '@/server/trpc/trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!'
  })
})
