import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'

import {
  type ItemsArtListSwitch,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'

export const ItemsRouter = createTRPCRouter({
  createAllItemsFromJSON: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const fileData = JSON.parse(input)
      const { fileMetaData, items } = fileData

      const deleteAllItemsAndMetaData = async () => {
        await ctx.prisma.fileItems.deleteMany({})
        await ctx.prisma.itemsFullRanges.deleteMany({})
        await ctx.prisma.itemsArtListTog.deleteMany({})
        await ctx.prisma.itemsArtListSwitch.deleteMany({})
        await ctx.prisma.itemsFadList.deleteMany({})
      }

      deleteAllItemsAndMetaData()

      for (const item of items) {
        await ctx.prisma.fileItems.create({
          data: {
            id: item.id,
            locked: item.locked as boolean,
            name: item.name,
            channel: parseInt(item.channel as string),
            baseDelay: parseInt(item.baseDelay as string),
            avgDelay: parseInt(item.avgDelay as string),
            color: item.color,
            fullRange: {
              create: item.fullRange.map((range: ItemsFullRanges) => {
                return range
              })
            },
            artListTog: {
              create: item.artListTog.map((art: ItemsArtListTog) => {
                return art
              })
            },
            artListSwitch: {
              create: item.artListSwitch.map((art: ItemsArtListSwitch) => {
                return art
              })
            },
            fadList: {
              create: item.fadList.map((fad: ItemsFadList) => {
                return fad
              })
            }
          }
        })
      }
    }),

  createSingleItem: publicProcedure.mutation(async ({ ctx }) => {
    const newItemId = await ctx.prisma.fileItems
      .create({
        data: {}
      })
      .then((item) => {
        return item.id
      })
    return await ctx.prisma.fileItems.update({
      where: {
        id: newItemId
      },
      data: {
        fullRange: {
          create: {
            id: newItemId + '_FR_0'
          }
        },
        artListTog: {
          create: {
            id: newItemId + '_AL_0'
          }
        },
        artListSwitch: {
          create: {
            id: newItemId + '_AL_1'
          }
        },
        fadList: {
          create: {
            id: newItemId + '_FL_0'
          }
        }
      }
    })
  }),
  updateSingleItem: publicProcedure
    .input(
      z.object({
        itemId: z.string().optional(),
        locked: z.boolean().optional(),
        name: z.string().optional(),
        channel: z.string().optional(),
        baseDelay: z.string().optional(),
        avgDelay: z.string().optional(),
        color: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId, locked, name, channel, baseDelay, avgDelay, color } =
        input

      const currentItem = await ctx.prisma.fileItems.findUnique({
        where: {
          id: itemId
        }
      })

      return await ctx.prisma.fileItems.update({
        where: {
          id: itemId
        },
        data: {
          locked: locked ?? currentItem?.locked,
          name: name ?? currentItem?.name,
          channel: parseInt(channel as string) ?? currentItem?.channel,
          baseDelay: parseInt(baseDelay as string) ?? currentItem?.baseDelay,
          avgDelay: parseInt(avgDelay as string) ?? currentItem?.avgDelay,
          color: color ?? currentItem?.color
        }
      })
    }),
  getSingleItem: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const { itemId } = input
      return await ctx.prisma.fileItems.findUnique({
        where: {
          id: itemId
        },
        include: {
          fullRange: true,
          artListTog: {
            include: {
              ranges: {
                select: {
                  id: true
                }
              }
            }
          },
          artListSwitch: {
            include: {
              ranges: true
            }
          },
          fadList: true
        }
      })
    }),
  deleteSingleItem: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input
      await ctx.prisma.fileItems.delete({
        where: {
          id: itemId
        }
      })
      await ctx.prisma.itemsFullRanges.deleteMany({
        where: {
          fileItemsItemId: itemId
        }
      })
      await ctx.prisma.itemsArtListTog.deleteMany({
        where: {
          fileItemsItemId: itemId
        }
      })
      await ctx.prisma.itemsArtListSwitch.deleteMany({
        where: {
          fileItemsItemId: itemId
        }
      })
      await ctx.prisma.itemsFadList.deleteMany({
        where: {
          fileItemsItemId: itemId
        }
      })
      return true
    }),

  addSingleFullRange: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const lastRangeNumber = await ctx.prisma.itemsFullRanges.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const newRange = await ctx.prisma.itemsFullRanges.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_range_' + lastRangeNumber
        }
      })
      return newRange
    }),

  deleteSingleFullRange: publicProcedure
    .input(
      z.object({
        rangeId: z.string(),
        fileItemsItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rangeId, fileItemsItemId } = input

      const mustHaveOneRange = await ctx.prisma.itemsFullRanges.count({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })

      if (mustHaveOneRange <= 1) {
        throw new Error('Must have at least one range')
      }

      await ctx.prisma.itemsFullRanges.delete({
        where: {
          id: rangeId
        }
      })
      const allFullRanges = await ctx.prisma.itemsFullRanges.findMany({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })
      return allFullRanges.map((range, index) => {
        return ctx.prisma.itemsFullRanges.update({
          where: {
            id: range.id
          },
          data: {
            id: range.id.split('_')[0] + '_range_' + index
          }
        })
      })
    }),

  addSingleArtListTog: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const lastArtNumber = await ctx.prisma.itemsArtListTog.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const newArt = await ctx.prisma.itemsArtListTog.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_art_' + lastArtNumber
        }
      })
      return newArt
    }),

  deleteSingleArtListTog: publicProcedure
    .input(
      z.object({
        artId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId } = input
      await ctx.prisma.itemsArtListTog.delete({
        where: {
          id: artId
        }
      })
      return true
    }),

  addSingleArtListSwitch: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const lastArtNumber = await ctx.prisma.itemsArtListSwitch.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const newArt = await ctx.prisma.itemsArtListSwitch.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_art_' + lastArtNumber
        }
      })
      return newArt
    }),

  deleteSingleArtListSwitch: publicProcedure
    .input(
      z.object({
        artId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId } = input
      await ctx.prisma.itemsArtListSwitch.delete({
        where: {
          id: artId
        }
      })
      return true
    }),

  addSingleFadList: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const lastFadNumber = await ctx.prisma.itemsFadList.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const newFad = await ctx.prisma.itemsFadList.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_fad_' + lastFadNumber
        }
      })
      return newFad
    }),

  deleteSingleFadList: publicProcedure
    .input(
      z.object({
        fadId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fadId } = input
      await ctx.prisma.itemsFadList.delete({
        where: {
          id: fadId
        }
      })
      return true
    }),

  deleteAllItems: publicProcedure.mutation(async ({ ctx }) => {
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
        _count: {
          select: {
            artListTog: true,
            artListSwitch: true
          }
        }
      }
    })
  })
})
