import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'

import {
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'

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
        artListTap: ItemsArtListTap[]
        fadList: ItemsFadList[]
      }

      const { items }: { items: FileItemsExtended[] } = fileData

      const deleteAllItemsAndMetaData = async () => {
        await ctx.prisma.fileItems.deleteMany({})
        await ctx.prisma.itemsFullRanges.deleteMany({})
        await ctx.prisma.itemsArtListTap.deleteMany({})
        await ctx.prisma.itemsArtListTog.deleteMany({})
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
            baseDelay:
              typeof item.baseDelay === 'string'
                ? parseInt(item.baseDelay)
                : item.baseDelay,
            avgDelay:
              typeof item.avgDelay === 'string'
                ? parseInt(item.avgDelay)
                : item.avgDelay,
            color: item.color,
            fullRange: {
              create: item.fullRange.map((range) => {
                //cannot map the fileItemsItemId, this is done by prisma connect
                const newRange = {
                  id: range.id,
                  name: range.name,
                  low: range.low,
                  high: range.high,
                  whiteKeysOnly: range.whiteKeysOnly
                }

                return newRange
              })
            },
            artListTap: {
              create: item.artListTap.map((art) => {
                //cannot map the fileItemsItemId, this is done by prisma connect
                const newArt = {
                  id: art.id,
                  name: art.name,
                  toggle: art.toggle,
                  codeType: art.codeType,
                  code: art.code,
                  on: art.on,
                  off: art.off,
                  default: art.default,
                  delay: art.delay,
                  changeType: art.changeType,
                  ranges: art.ranges
                }

                return {
                  ...newArt,
                  delay:
                    typeof newArt.delay === 'string'
                      ? parseInt(newArt.delay)
                      : newArt.delay,
                  default:
                    typeof newArt.default === 'string' ? false : newArt.default,
                  ranges: JSON.stringify(newArt.ranges)
                }
              })
            },
            artListTog: {
              create: item.artListTog.map((art) => {
                //cannot map the fileItemsItemId, this is done by prisma connect
                const newArt = {
                  id: art.id,
                  name: art.name,
                  toggle: art.toggle,
                  codeType: art.codeType,
                  code: art.code,
                  on: art.on,
                  off: art.off,
                  default: art.default,
                  delay: art.delay,
                  changeType: art.changeType,
                  ranges: art.ranges
                }

                return {
                  ...newArt,
                  delay:
                    typeof newArt.delay === 'string'
                      ? parseInt(newArt.delay)
                      : newArt.delay,
                  ranges: JSON.stringify(newArt.ranges)
                }
              })
            },
            fadList: {
              create: item.fadList.map((fad) => {
                //cannot map the fileItemsItemId, this is done by prisma connect
                const newFad = {
                  id: fad.id,
                  name: fad.name,
                  codeType: fad.codeType,
                  code: fad.code,
                  default: fad.default,
                  changeType: fad.changeType
                }

                return {
                  ...newFad,
                  default:
                    typeof newFad.default === 'boolean'
                      ? null
                      : typeof newFad.default === 'string'
                      ? parseInt(newFad.default)
                      : newFad.default
                }
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
            artListTap: true,
            artListTog: true
          }
        }
      }
    })
  }),
  deleteAllItems: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.fileItems.deleteMany({})
    await ctx.prisma.itemsFullRanges.deleteMany({})
    await ctx.prisma.itemsArtListTap.deleteMany({})
    await ctx.prisma.itemsArtListTog.deleteMany({})
    await ctx.prisma.itemsFadList.deleteMany({})
    return true
  }),
  ////////////////////////////
  createSingleItem: publicProcedure.mutation(async ({ ctx }) => {
    const itemsCount = await ctx.prisma.fileItems.count()
    const allItems = await ctx.prisma.fileItems.findMany({
      select: {
        id: true
      }
    })
    const highestNumber = allItems
      .map((item) => {
        return item.id.split('_')[1]
      })
      .sort((a, b) => {
        if (!a || !b) return 0
        return parseInt(b) - parseInt(a)
      })
    const newId = 'T_' + (parseInt(highestNumber[0] as string) + 1)

    const newItemId = await ctx.prisma.fileItems
      .create({
        data: {
          id: itemsCount === 0 ? 'T_0' : newId
        }
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
        artListTap: {
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
          channel: channel ? parseInt(channel) : currentItem?.channel,
          baseDelay: baseDelay ? parseInt(baseDelay) : currentItem?.baseDelay,
          avgDelay: avgDelay ? parseInt(avgDelay) : currentItem?.avgDelay,
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
          artListTap: true,
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

      const mustHaveOneItem = await ctx.prisma.fileItems.count()

      if (mustHaveOneItem <= 1) {
        throw new Error('Must have at least one item')
      }

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
      await ctx.prisma.itemsArtListTap.deleteMany({
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
  getAllFullRanges: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.itemsFullRanges.findMany({})
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
      return true
    }),
  ////////////////////////////
  renumberArtList: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log('renumberArtList')
      const { itemId } = input

      const allArtListTap = await ctx.prisma.itemsArtListTap.findMany({
        where: {
          fileItemsItemId: itemId
        }
      })

      const allArtListTog = await ctx.prisma.itemsArtListTog.findMany({
        where: {
          fileItemsItemId: itemId
        }
      })

      const allArtList = [...allArtListTap, ...allArtListTog]

      return allArtList.map((art, index) => {
        return ctx.prisma.itemsArtListTap.update({
          where: {
            id: art.id
          },
          data: {
            id: art.id.split('_')[0] + '_AL_' + index,
            name: 'hi'
          }
        })
      })
    }),
  ////////////////////////////
  createSingleArtListTap: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const lastArtTogNumber = await ctx.prisma.itemsArtListTog.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const lastArtSwitchNumber = await ctx.prisma.itemsArtListTap.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const nextArtNumber = lastArtTogNumber + lastArtSwitchNumber

      const newArt = await ctx.prisma.itemsArtListTap.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_AL_' + nextArtNumber,
          ranges: JSON.stringify([itemId + '_FR_0'])
        }
      })
      return newArt
    }),
  updateSingleArtListTap: publicProcedure
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
        default: inputDefaultCode,
        delay,
        changeType,
        ranges
      } = input

      const currentArtListTap = await ctx.prisma.itemsArtListTap.findUnique({
        where: {
          id: artId
        }
      })

      if (inputDefaultCode === undefined) {
        return await ctx.prisma.itemsArtListTap.update({
          where: {
            id: artId
          },
          data: {
            name: name ?? currentArtListTap?.name,
            toggle: toggle ?? currentArtListTap?.toggle,
            codeType: codeType ?? currentArtListTap?.codeType,
            code: code ? parseInt(code) : currentArtListTap?.code,
            on: on ? parseInt(on) : currentArtListTap?.on,
            off: off ? parseInt(off) : currentArtListTap?.off,
            delay: delay ? parseInt(delay) : currentArtListTap?.delay,
            changeType: changeType ?? currentArtListTap?.changeType,
            ranges: ranges ?? currentArtListTap?.ranges
          }
        })
      }

      const anyArtIsDefault = await ctx.prisma.itemsArtListTap
        .findMany({
          where: {
            fileItemsItemId: currentArtListTap?.fileItemsItemId,
            id: {
              not: currentArtListTap?.id
            }
          }
        })
        .then((artList) => {
          return artList.some((art) => {
            return art.default === true
          })
        })

      if (
        currentArtListTap?.default &&
        inputDefaultCode === false &&
        !anyArtIsDefault
      ) {
        throw new Error('At least one articulation must be default')
      }

      await ctx.prisma.itemsArtListTap.update({
        where: {
          id: artId
        },
        data: {
          default: true
        }
      })
      await ctx.prisma.itemsArtListTap.updateMany({
        where: {
          fileItemsItemId: currentArtListTap?.fileItemsItemId,
          id: {
            not: currentArtListTap?.id
          }
        },
        data: {
          default: false
        }
      })
    }),
  deleteSingleArtListTap: publicProcedure
    .input(
      z.object({
        artId: z.string(),
        fileItemsItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId, fileItemsItemId } = input

      const mustHaveOneArtListTap = await ctx.prisma.itemsArtListTap.count({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })

      if (mustHaveOneArtListTap <= 1) {
        throw new Error('Must have at least one switch articulation')
      }
      await ctx.prisma.itemsArtListTap.delete({
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

      const lastArtTogNumber = await ctx.prisma.itemsArtListTog.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const lastArtSwitchNumber = await ctx.prisma.itemsArtListTap.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const nextArtNumber = lastArtTogNumber + lastArtSwitchNumber

      const newArt = await ctx.prisma.itemsArtListTog.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_AL_' + nextArtNumber,
          ranges: JSON.stringify([itemId + '_FR_0'])
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
        artId: z.string(),
        fileItemsItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId, fileItemsItemId } = input

      const mustHaveOneArtListTap = await ctx.prisma.itemsArtListTog.count({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })

      if (mustHaveOneArtListTap <= 1) {
        throw new Error('Must have at least one toggle articulation')
      }
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
        fadId: z.string(),
        fileItemsItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fadId, fileItemsItemId } = input

      const mustHaveOneFader = await ctx.prisma.itemsFadList.count({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })

      if (mustHaveOneFader <= 1) {
        throw new Error('Must have at least one fader')
      }
      await ctx.prisma.itemsFadList.delete({
        where: {
          id: fadId
        }
      })
      return true
    })
})
