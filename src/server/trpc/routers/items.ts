import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'

import {
  type FileItems,
  type ItemsArtListSwitch,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'
import { r } from '@tauri-apps/api/fs-9d7de754'

export const ItemsRouter = createTRPCRouter({
  createAllItemsFromJSON: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const fileData = JSON.parse(input)

      type FileItemsExtended = {
        id: string
        locked: boolean
        name: string
        channel: number | null
        baseDelay: number | null
        avgDelay: number | null
        color: string
        fullRange: ItemsFullRanges[]
        artListTog: ItemsArtListTog[]
        artListSwitch: ItemsArtListSwitch[]
        fadList: ItemsFadList[]
      }

      const {
        fileMetaData,
        items
      }: { fileMetaData: any; items: FileItemsExtended[] } = fileData

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
            locked: item.locked,
            name: item.name,
            channel: item.channel,
            baseDelay: item.baseDelay,
            avgDelay: item.avgDelay,
            color: item.color,
            fullRange: {
              create: item.fullRange.map((range) => {
                return range
              })
            },
            artListTog: {
              create: item.artListTog.map((art) => {
                return { ...art, ranges: JSON.stringify(art.ranges) }
              })
            },
            artListSwitch: {
              create: item.artListSwitch.map((art) => {
                return { ...art, ranges: JSON.stringify(art.ranges) }
              })
            },
            fadList: {
              create: item.fadList.map((fad) => {
                return fad
              })
            }
          }
        })
      }
    }),
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fileItems.findMany({
      include: {
        _count: {
          select: {
            artListSwitch: true,
            artListTog: true
          }
        }
      }
    })
  }),
  deleteAllItems: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.fileItems.deleteMany({})
    await ctx.prisma.itemsFullRanges.deleteMany({})
    await ctx.prisma.itemsArtListSwitch.deleteMany({})
    await ctx.prisma.itemsArtListTog.deleteMany({})
    await ctx.prisma.itemsFadList.deleteMany({})
    return true
  }),
  ////////////////////////////
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
        artListSwitch: {
          create: {
            id: newItemId + '_AL_0',
            ranges: JSON.stringify([newItemId + '_FR_0'])
          }
        },
        artListTog: {
          create: {
            id: newItemId + '_AL_1',
            ranges: JSON.stringify([newItemId + '_FR_0'])
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
        channel: z.number().optional(),
        baseDelay: z.number().optional(),
        avgDelay: z.number().optional(),
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
          channel: channel ?? currentItem?.channel,
          baseDelay: baseDelay ?? currentItem?.baseDelay,
          avgDelay: avgDelay ?? currentItem?.avgDelay,
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
          artListSwitch: true,
          artListTog: true,
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
  ////////////////////////////
  createSingleFullRange: publicProcedure
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
          id: itemId + '_FR_' + lastRangeNumber
        }
      })
      return newRange
    }),
  updateSingleFullRange: publicProcedure
    .input(
      z.object({
        rangeId: z.string(),
        name: z.string().optional(),
        low: z.string().optional(),
        high: z.string().optional(),
        whiteKeysOnly: z.boolean().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { rangeId, name, low, high, whiteKeysOnly } = input

      const currentFullRanges = await ctx.prisma.itemsFullRanges.findUnique({
        where: {
          id: rangeId
        }
      })

      return await ctx.prisma.itemsFullRanges.update({
        where: {
          id: rangeId
        },
        data: {
          name: name ?? currentFullRanges?.name,
          low: low ?? currentFullRanges?.low,
          high: high ?? currentFullRanges?.high,
          whiteKeysOnly: whiteKeysOnly ?? currentFullRanges?.whiteKeysOnly
        }
      })
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
            id: range.id.split('_')[0] + '_FR_' + index
          }
        })
      })
    }),
  ////////////////////////////
  createSingleArtListSwitch: publicProcedure
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
          id: itemId + '_AL_' + lastArtNumber
        }
      })
      return newArt
    }),
  updateSingleArtListSwitch: publicProcedure
    .input(
      z.object({
        artId: z.string(),
        name: z.string().optional(),
        toggle: z.boolean().optional(),
        codeType: z.string().optional(),
        code: z.string().optional(),
        on: z.string().optional(),
        off: z.string().optional(),
        default: z.boolean().optional(),
        delay: z.string().optional(),
        changeType: z.string().optional(),
        ranges: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        artId,
        name,
        toggle,
        codeType,
        code,
        on,
        off,
        default: defaultCode,
        delay,
        changeType,
        ranges
      } = input

      const currentArtListSwitch =
        await ctx.prisma.itemsArtListSwitch.findUnique({
          where: {
            id: artId
          }
        })

      return await ctx.prisma.itemsArtListSwitch.update({
        where: {
          id: artId
        },
        data: {
          name: name ?? currentArtListSwitch?.name,
          toggle: toggle ?? currentArtListSwitch?.toggle,
          codeType: codeType ?? currentArtListSwitch?.codeType,
          code: code ? parseInt(code) : currentArtListSwitch?.code,
          on: on ? parseInt(on) : currentArtListSwitch?.on,
          off: off ? parseInt(off) : currentArtListSwitch?.off,
          default: defaultCode ?? currentArtListSwitch?.default,
          delay: delay ? parseInt(delay) : currentArtListSwitch?.delay,
          changeType: changeType ?? currentArtListSwitch?.changeType,
          ranges: ranges ?? currentArtListSwitch?.ranges
        }
      })
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
  ////////////////////////////
  createSingleArtListTog: publicProcedure
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
          id: itemId + '_AL_' + lastArtNumber
        }
      })
      return newArt
    }),
  updateSingleArtListTog: publicProcedure
    .input(
      z.object({
        artId: z.string(),
        name: z.string().optional(),
        toggle: z.boolean().optional(),
        codeType: z.string().optional(),
        code: z.string().optional(),
        on: z.string().optional(),
        off: z.string().optional(),
        default: z.string().optional(),
        delay: z.string().optional(),
        changeType: z.string().optional(),
        ranges: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        artId,
        name,
        toggle,
        codeType,
        code,
        on,
        off,
        default: defaultCode,
        delay,
        changeType,
        ranges
      } = input

      const currentArtListTog = await ctx.prisma.itemsArtListTog.findUnique({
        where: {
          id: artId
        }
      })

      return await ctx.prisma.itemsArtListTog.update({
        where: {
          id: artId
        },
        data: {
          name: name ?? currentArtListTog?.name,
          toggle: toggle ?? currentArtListTog?.toggle,
          codeType: codeType ?? currentArtListTog?.codeType,
          code: code ? parseInt(code) : currentArtListTog?.code,
          on: on ? parseInt(on) : currentArtListTog?.on,
          off: off ? parseInt(off) : currentArtListTog?.off,
          default: defaultCode ?? currentArtListTog?.default,
          delay: delay ? parseInt(delay) : currentArtListTog?.delay,
          changeType: changeType ?? currentArtListTog?.changeType,
          ranges: ranges ?? currentArtListTog?.ranges
        }
      })
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
  ////////////////////////////
  createSingleFadList: publicProcedure
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
          id: itemId + '_FL_' + lastFadNumber
        }
      })
      return newFad
    }),
  updateSingleFadList: publicProcedure
    .input(
      z.object({
        fadId: z.string(),
        name: z.string().optional(),
        codeType: z.string().optional(),
        code: z.string().optional(),
        default: z.string().optional(),
        changeType: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        fadId,
        name,
        codeType,
        code,
        default: defaultCode,
        changeType
      } = input

      const currentFadList = await ctx.prisma.itemsFadList.findUnique({
        where: {
          id: fadId
        }
      })

      return await ctx.prisma.itemsFadList.update({
        where: {
          id: fadId
        },
        data: {
          name: name ?? currentFadList?.name,
          codeType: codeType ?? currentFadList?.codeType,
          code: code ? parseInt(code) : currentFadList?.code,
          default: defaultCode
            ? parseInt(defaultCode)
            : currentFadList?.default,
          changeType: changeType ?? currentFadList?.changeType
        }
      })
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
    })
})
