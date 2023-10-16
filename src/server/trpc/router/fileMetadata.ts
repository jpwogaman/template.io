import { z } from 'zod'
import { router, publicProcedure } from '@/server/trpc/trpc'

export const FileMetadata = router({
  getMetaData: publicProcedure
    .input(
      z.object({
        event: z.string(),
        payload: z.enum(['open', 'save', 'save_as'])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { event, payload } = input

      //if (payload === 'open') {
      //}
      if (payload === 'save') {
        const fileMetaData = await ctx.prisma.fileMetaData.findMany({
          include: {
            layouts: true
          }
        })

        const allItems = await ctx.prisma.fileItems.findMany({
          include: {
            fullRange: true,
            artListTog: true,
            artListSwitch: true,
            fadList: true
          }
        })
        return {
          fileMetaData,
          allItems
        }
      }
      //if (payload === 'save_as') {
      //}
    })
})
