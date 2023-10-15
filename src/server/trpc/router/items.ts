import { z } from 'zod'

import { router, publicProcedure } from '@/server/trpc/trpc'

export const ItemsRouter = router({
  createItem: publicProcedure.mutation(async ({ ctx }) => {
    const newItem = await ctx.prisma.fileItems.create({
      data: {}
    })

    const updatedItem = await ctx.prisma.fileItems.update({
      where: {
        itemId: newItem.itemId
      },
      data: {
        fullRange: {
          create: {
            rangeId: newItem.itemId + '_range-0'
          }
        },
        artListTog: {
          create: {
            artId: newItem.itemId + '_art-0'
          }
        },
        artListSwitch: {
          create: {
            artId: newItem.itemId + '_art-1'
          }
        },
        fadList: {
          create: {
            fadId: newItem.itemId + '_fad-0'
          }
        }
      }
    })
    return updatedItem
  }),
  clearAllItems: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.fileItems.deleteMany({})
    await ctx.prisma.itemsFullRanges.deleteMany({})
    await ctx.prisma.itemsArtListTog.deleteMany({})
    await ctx.prisma.itemsArtListSwitch.deleteMany({})
    await ctx.prisma.itemsFadList.deleteMany({})
    return true
  }),
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fileItems.findMany({
      include: {
        fullRange: true,
        artListTog: true,
        artListSwitch: true,
        fadList: true
      }
    })
  })
})
