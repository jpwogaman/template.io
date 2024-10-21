import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'

export const TauriMenuEvents = createTRPCRouter({
  export: publicProcedure.mutation(async ({ ctx }) => {
    const items = await ctx.prisma.fileItems.findMany({
      include: {
        fullRange: true,
        artListTog: true,
        artListTap: true,
        artLayers: true,
        fadList: true
      }
    })
    return {
      fileMetaData: {},
      items
    }
  })
})
