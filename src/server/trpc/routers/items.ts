import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'

import {
  type FileItems,
  type ItemsFullRanges,
  type ItemsArtListTog,
  type ItemsArtListTap,
  type ItemArtLayers,
  type ItemsFadList
} from '@prisma/client'

type Prettify<T> = { [K in keyof T]: T[K] } & object

export type FileItemsExtended = Prettify<
  FileItems & {
    fullRange: ItemsFullRanges[]
    artListTog: ItemsArtListTog[]
    artListTap: ItemsArtListTap[]
    artLayers: ItemArtLayers[]
    fadList: ItemsFadList[]
  }
>

export const ItemsRouter = createTRPCRouter({
  ////////////////////////////
  // READ Routers
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fileItems.findMany({
      include: {
        _count: {
          select: {
            fullRange: true,
            artListTog: true,
            artListTap: true,
            artLayers: true,
            fadList: true
          }
        }
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
          artListTog: true,
          artListTap: true,
          artLayers: true,
          fadList: true
        }
      })
    }),
  getAllFullRanges: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.itemsFullRanges.findMany({})
  }),
  getAllArtLayers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.itemArtLayers.findMany({})
  }),
  ////////////////////////////
  // CREATE Routers
  // create new item above/below/end
  // create new full range above/below/end
  // create new art tog above/below/end
  // create new art tap above/below/end
  // create new art layer above/below/end
  // create new fad list above/below/end
  createAllItemsFromJSON: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const fileData = JSON.parse(input)
      console.log(fileData)
      const { items }: { items: FileItemsExtended[] } = fileData

      await ctx.prisma.fileItems.deleteMany({})
      await ctx.prisma.itemsFullRanges.deleteMany({})
      await ctx.prisma.itemsArtListTog.deleteMany({})
      await ctx.prisma.itemsArtListTap.deleteMany({})
      await ctx.prisma.itemArtLayers.deleteMany({})
      await ctx.prisma.itemsFadList.deleteMany({})

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
            vepOut: item.vepOut,
            vepInstance: item.vepInstance,
            smpNumber: item.smpNumber,
            smpOut: item.smpOut,
            color: item.color,
            fullRange: {
              create: !item.fullRange
                ? {
                    id: item.id + '_FR_0'
                  }
                : item.fullRange.map((range) => {
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
            artListTog: {
              create: !item.artListTog
                ? {
                    id: item.id + '_AT_0',
                    ranges: JSON.stringify([item.id + '_FR_0']),
                    artLayers: JSON.stringify([''])
                  }
                : item.artListTog.map((art) => {
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
                      ranges: art.ranges,
                      artLayers: art.artLayers
                    }

                    return {
                      ...newArt,
                      delay:
                        typeof newArt.delay === 'string'
                          ? parseInt(newArt.delay)
                          : newArt.delay
                    }
                  })
            },
            artListTap: {
              create: !item.artListTap
                ? {
                    id: item.id + '_AT_1',
                    ranges: JSON.stringify([item.id + '_FR_0']),
                    artLayers: JSON.stringify([''])
                  }
                : item.artListTap.map((art) => {
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
                      ranges: art.ranges,
                      artLayers: art.artLayers
                    }

                    return {
                      ...newArt,
                      delay:
                        typeof newArt.delay === 'string'
                          ? parseInt(newArt.delay)
                          : newArt.delay,
                      default:
                        typeof newArt.default === 'string'
                          ? false
                          : newArt.default
                    }
                  })
            },

            artLayers: {
              create: !item.artLayers
                ? {
                    id: item.id + '_AL_0'
                  }
                : item.artLayers.map((layer) => {
                    const newLayer = {
                      id: layer.id,
                      name: layer.name,
                      codeType: layer.codeType,
                      code: layer.code,
                      on: layer.on,
                      off: layer.off,
                      default: layer.default,
                      changeType: layer.changeType
                    }
                    return {
                      ...newLayer
                    }
                  })
            },

            fadList: {
              create: !item.fadList
                ? {
                    id: item.id + '_FL_0'
                  }
                : item.fadList.map((fad) => {
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
  createSingleItem: publicProcedure
    .input(
      z.object({
        count: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { count } = input

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
      for (let i = 0; i < count; i++) {
        const newId = 'T_' + (parseInt(highestNumber[0] as string) + 1 + i)

        const newItemId = await ctx.prisma.fileItems
          .create({
            data: {
              id: itemsCount === 0 ? 'T_0' : newId
            }
          })
          .then((item) => {
            return item.id
          })
        await ctx.prisma.fileItems.update({
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
                id: newItemId + '_AT_0',
                ranges: JSON.stringify([newItemId + '_FR_0']),
                artLayers: JSON.stringify([''])
              }
            },
            artListTap: {
              create: {
                id: newItemId + '_AT_1',
                ranges: JSON.stringify([newItemId + '_FR_0']),
                artLayers: JSON.stringify([''])
              }
            },
            artLayers: {
              create: {
                id: newItemId + '_AL_0'
              }
            },
            fadList: {
              create: {
                id: newItemId + '_FL_0'
              }
            }
          }
        })
      }
      return true
    }),
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
          id: itemId + '_AT_' + nextArtNumber,
          ranges: JSON.stringify([itemId + '_FR_0']),
          artLayers: JSON.stringify([''])
        }
      })
      return newArt
    }),
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
          id: itemId + '_AT_' + nextArtNumber,
          ranges: JSON.stringify([itemId + '_FR_0']),
          artLayers: JSON.stringify([''])
        }
      })
      return newArt
    }),
  createSingleArtLayer: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const lastRangeNumber = await ctx.prisma.itemArtLayers.count({
        where: {
          fileItemsItemId: itemId
        }
      })

      const newRange = await ctx.prisma.itemArtLayers.create({
        data: {
          FileItems: {
            connect: {
              id: itemId
            }
          },
          id: itemId + '_AL_' + lastRangeNumber
        }
      })
      return newRange
    }),
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
  ////////////////////////////
  // UPDATE Routers
  updateSingleItem: publicProcedure
    .input(
      z.object({
        itemId: z.string().optional(),
        locked: z.boolean().optional(),
        name: z.string().optional(),
        notes: z.string().optional(),
        channel: z.string().optional(),
        baseDelay: z.string().optional(),
        avgDelay: z.string().optional(),
        vepOut: z.string().optional(),
        vepInstance: z.string().optional(),
        smpNumber: z.string().optional(),
        smpOut: z.string().optional(),
        color: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        itemId,
        locked,
        name,
        notes,
        channel,
        baseDelay,
        avgDelay,
        vepOut,
        vepInstance,
        smpNumber,
        smpOut,
        color
      } = input

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
          notes: notes ?? currentItem?.notes,
          channel: channel ? parseInt(channel) : currentItem?.channel,
          baseDelay: baseDelay ? parseInt(baseDelay) : currentItem?.baseDelay,
          avgDelay: avgDelay ? parseInt(avgDelay) : currentItem?.avgDelay,
          vepOut: vepOut ?? currentItem?.vepOut,
          vepInstance: vepInstance ?? currentItem?.vepInstance,
          smpNumber: smpNumber ?? currentItem?.smpNumber,
          smpOut: smpOut ?? currentItem?.smpOut,
          color: color ?? currentItem?.color
        }
      })
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
        ranges: z.string().optional(),
        artLayers: z.string().optional()
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
        ranges,
        artLayers
      } = input

      const currentArtListTog = await ctx.prisma.itemsArtListTog.findUnique({
        where: {
          id: artId
        }
      })

      if (ranges === undefined && artLayers === undefined) {
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
            default: inputDefaultCode ?? currentArtListTog?.default,
            delay: delay ? parseInt(delay) : currentArtListTog?.delay,
            changeType: changeType ?? currentArtListTog?.changeType
          }
        })
      }

      // ART LAYERS UPDATE
      if (artLayers != undefined && inputDefaultCode === undefined) {
        return await ctx.prisma.itemsArtListTog.update({
          where: {
            id: artId
          },
          data: {
            artLayers: artLayers ?? currentArtListTog?.artLayers
          }
        })
      }
      // RANGES UPDATE
      if (ranges != undefined && inputDefaultCode === undefined) {
        if (ranges === '[]') {
          throw new Error(
            'Each articulation must be connected to at least one range'
          )
        }
        return await ctx.prisma.itemsArtListTap.update({
          where: {
            id: artId
          },
          data: {
            ranges: ranges ?? currentArtListTog?.ranges
          }
        })
      }
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
        ranges: z.string().optional(),
        artLayers: z.string().optional()
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
        ranges,
        artLayers
      } = input

      ////////////////////////////
      // BASIC UPDATE
      const currentArtListTap = await ctx.prisma.itemsArtListTap.findUnique({
        where: {
          id: artId
        }
      })

      if (
        inputDefaultCode === undefined &&
        ranges === undefined &&
        artLayers === undefined
      ) {
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
            changeType: changeType ?? currentArtListTap?.changeType
          }
        })
      }
      ////////////////////////////
      // RANGES UPDATE
      if (ranges != undefined && inputDefaultCode === undefined) {
        if (ranges === '[]') {
          throw new Error(
            'Each articulation must be connected to at least one range'
          )
        }
        return await ctx.prisma.itemsArtListTap.update({
          where: {
            id: artId
          },
          data: {
            ranges: ranges ?? currentArtListTap?.ranges
          }
        })
      }
      ////////////////////////////
      // ART LAYERS UPDATE
      if (artLayers != undefined && inputDefaultCode === undefined) {
        return await ctx.prisma.itemsArtListTap.update({
          where: {
            id: artId
          },
          data: {
            artLayers: artLayers ?? currentArtListTap?.artLayers
          }
        })
      }
      ////////////////////////////
      // DEFAULT CODE UPDATE
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
      ////////////////////////////
    }),
  updateSingleArtLayer: publicProcedure
    .input(
      z.object({
        layerId: z.string(),
        name: z.string().optional(),
        codeType: z.string().optional(),
        code: z.string().optional(),
        on: z.string().optional(),
        off: z.string().optional(),
        default: z.string().optional(),
        changeType: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        layerId,
        name,
        codeType,
        code,
        on,
        off,
        default: defaultCode,
        changeType
      } = input

      const currentArtLayers = await ctx.prisma.itemArtLayers.findUnique({
        where: {
          id: layerId
        }
      })

      return await ctx.prisma.itemArtLayers.update({
        where: {
          id: layerId
        },
        data: {
          name: name ?? currentArtLayers?.name,
          codeType: codeType ?? currentArtLayers?.codeType,
          code: code ? parseInt(code) : currentArtLayers?.code,
          on: on ? parseInt(on) : currentArtLayers?.on,
          off: off ? parseInt(off) : currentArtLayers?.off,
          default: defaultCode ?? currentArtLayers?.default,
          changeType: changeType ?? currentArtLayers?.changeType
        }
      })
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
  ////////////////////////////
  // DELETE Routers
  deleteAllItems: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.fileItems.deleteMany({})
    await ctx.prisma.itemsFullRanges.deleteMany({})
    await ctx.prisma.itemsArtListTog.deleteMany({})
    await ctx.prisma.itemsArtListTap.deleteMany({})
    await ctx.prisma.itemArtLayers.deleteMany({})
    await ctx.prisma.itemsFadList.deleteMany({})
    return true
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
      await ctx.prisma.itemArtLayers.deleteMany({
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
  deleteSingleArtListTog: publicProcedure
    .input(
      z.object({
        artId: z.string(),
        fileItemsItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { artId, fileItemsItemId } = input

      const mustHaveOneArtListTog = await ctx.prisma.itemsArtListTog.count({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })

      if (mustHaveOneArtListTog <= 1) {
        throw new Error('Must have at least one toggle articulation')
      }
      await ctx.prisma.itemsArtListTog.delete({
        where: {
          id: artId
        }
      })
      return true
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
        throw new Error('Must have at least one tap articulation')
      }
      await ctx.prisma.itemsArtListTap.delete({
        where: {
          id: artId
        }
      })
      return true
    }),
  deleteSingleArtLayer: publicProcedure
    .input(
      z.object({
        layerId: z.string(),
        fileItemsItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { layerId, fileItemsItemId } = input

      const mustHaveOneLayer = await ctx.prisma.itemArtLayers.count({
        where: {
          fileItemsItemId: fileItemsItemId
        }
      })

      if (mustHaveOneLayer <= 1) {
        throw new Error('Must have at least one additional layer')
      }

      await ctx.prisma.itemArtLayers.delete({
        where: {
          id: layerId
        }
      })
      return true
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
    }),
  ////////////////////////////
  // CLEAR Routers
  // clear full range
  // clear art tog
  // clear art tap
  // clear art layer
  // clear fad list
  clearSingleItem: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      await ctx.prisma.fileItems.update({
        where: {
          id: itemId
        },
        data: {
          locked: false,
          name: '',
          notes: '',
          channel: 1,
          baseDelay: 0,
          avgDelay: 0,
          vepOut: 'N/A',
          vepInstance: 'N/A',
          smpNumber: 'N/A',
          smpOut: 'N/A',
          color: '#71717A'
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
      await ctx.prisma.itemArtLayers.deleteMany({
        where: {
          fileItemsItemId: itemId
        }
      })
      await ctx.prisma.itemsFadList.deleteMany({
        where: {
          fileItemsItemId: itemId
        }
      })

      return await ctx.prisma.fileItems.update({
        where: {
          id: itemId
        },
        data: {
          fullRange: {
            create: {
              id: itemId + '_FR_0'
            }
          },
          artListTog: {
            create: {
              id: itemId + '_AT_0',
              ranges: JSON.stringify([itemId + '_FR_0']),
              artLayers: JSON.stringify([''])
            }
          },
          artListTap: {
            create: {
              id: itemId + '_AT_1',
              ranges: JSON.stringify([itemId + '_FR_0']),
              artLayers: JSON.stringify([''])
            }
          },
          artLayers: {
            create: {
              id: itemId + '_AL_0'
            }
          },
          fadList: {
            create: {
              id: itemId + '_FL_0'
            }
          }
        }
      })
    }),
  ////////////////////////////
  // RENUMBER/REORDER Routers
  // move track up/down/drag
  // move full range up/down/drag
  // move art tog up/down/drag
  // move art tap up/down/drag
  // move art layer up/down/drag
  // move fad list up/down/drag
  // renumber full ranges
  // renumber art layers
  // renumber faders
  renumberAllItems: publicProcedure.mutation(async ({ ctx }) => {
    const allItems = await ctx.prisma.fileItems.findMany()
    const allFullRanges = await ctx.prisma.itemsFullRanges.findMany()
    const allArtListTog = await ctx.prisma.itemsArtListTog.findMany()
    const allArtListTap = await ctx.prisma.itemsArtListTap.findMany()
    const allFadList = await ctx.prisma.itemsFadList.findMany()
    const allArtLayers = await ctx.prisma.itemArtLayers.findMany()

    await ctx.prisma.fileItems.deleteMany({})
    await ctx.prisma.itemsFullRanges.deleteMany({})
    await ctx.prisma.itemsArtListTog.deleteMany({})
    await ctx.prisma.itemsArtListTap.deleteMany({})
    await ctx.prisma.itemArtLayers.deleteMany({})
    await ctx.prisma.itemsFadList.deleteMany({})

    const newItems = allItems.map((item, itemIndex) => {
      const thisArtListTogCount = allArtListTog.filter((art) => {
        return art.fileItemsItemId === item.id
      }).length
      return {
        ...item,
        id: 'T_' + itemIndex,
        fullRange: allFullRanges
          .filter((range) => {
            return range.fileItemsItemId === item.id
          })
          .map((range, index) => {
            return {
              ...range,
              id: 'T_' + itemIndex + '_FR_' + index
            }
          }),
        artListTog: allArtListTog
          .filter((art) => {
            return art.fileItemsItemId === item.id
          })
          .map((art, index) => {
            return {
              ...art,
              id: 'T_' + itemIndex + '_AT_' + index,
              ranges: art.ranges,
              artLayers: art.artLayers
            }
          }),
        artListTap: allArtListTap
          .filter((art) => {
            return art.fileItemsItemId === item.id
          })
          .map((art, index) => {
            return {
              ...art,
              id: 'T_' + itemIndex + '_AT_' + (index + thisArtListTogCount),
              ranges: art.ranges,
              artLayers: art.artLayers
            }
          }),
        artLayers: allArtLayers
          .filter((layer) => {
            return layer.fileItemsItemId === item.id
          })
          .map((layer, index) => {
            return {
              ...layer,
              id: 'T_' + itemIndex + '_AL_' + index
            }
          }),

        fadList: allFadList
          .filter((fad) => {
            return fad.fileItemsItemId === item.id
          })
          .map((fad, index) => {
            return {
              ...fad,
              id: 'T_' + itemIndex + '_FL_' + index
            }
          })
      } as FileItemsExtended
    })

    for (const item of newItems) {
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
          vepOut: item.vepOut,
          vepInstance: item.vepInstance,
          smpOut: item.smpOut,
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
                ranges: art.ranges,
                artLayers: art.artLayers
              }

              return {
                ...newArt,
                delay:
                  typeof newArt.delay === 'string'
                    ? parseInt(newArt.delay)
                    : newArt.delay
              }
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
                ranges: art.ranges,
                artLayers: art.artLayers
              }

              return {
                ...newArt,
                delay:
                  typeof newArt.delay === 'string'
                    ? parseInt(newArt.delay)
                    : newArt.delay,
                default:
                  typeof newArt.default === 'string' ? false : newArt.default
              }
            })
          },

          artLayers: {
            create: item.artLayers.map((layer) => {
              const newLayer = {
                id: layer.id,
                name: layer.name,
                codeType: layer.codeType,
                code: layer.code,
                on: layer.on,
                off: layer.off,
                default: layer.default,
                changeType: layer.changeType
              }
              return {
                ...newLayer
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
  renumberArtList: publicProcedure
    .input(
      z.object({
        itemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId } = input

      const allArtListTog = await ctx.prisma.itemsArtListTog.findMany({
        where: {
          fileItemsItemId: itemId
        }
      })
      const allArtListTap = await ctx.prisma.itemsArtListTap.findMany({
        where: {
          fileItemsItemId: itemId
        }
      })

      const newArtTogList = allArtListTog.map((art, index) => {
        return {
          ...art,
          id: itemId + '_AT_' + index
        }
      })

      const newArtTapList = allArtListTap.map((art, index) => {
        return {
          ...art,
          id: itemId + '_AT_' + (index + allArtListTog.length)
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

      for (const element of newArtTogList) {
        await ctx.prisma.itemsArtListTog.create({
          data: {
            ...element
          }
        })
      }

      for (const element of newArtTapList) {
        await ctx.prisma.itemsArtListTap.create({
          data: {
            ...element
          }
        })
      }
    }),
  ////////////////////////////
  // PASTE/DUPLICATE Routers
  // duplicate item above/below
  // duplicate full range above/below/end
  // duplicate art tog above/below/end
  // duplicate art tap above/below/end
  // duplicate art layer above/below/end
  // duplicate fad list above/below/end
  pasteSingleItem: publicProcedure
    .input(
      z.object({
        destinationItemId: z.string(),
        copiedItemId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { destinationItemId, copiedItemId } = input

      const copiedItem = await ctx.prisma.fileItems.findUnique({
        where: {
          id: copiedItemId
        }
      })

      const copiedFullRanges = await ctx.prisma.itemsFullRanges.findMany({
        where: {
          fileItemsItemId: copiedItemId
        }
      })

      const copiedArtListTog = await ctx.prisma.itemsArtListTog.findMany({
        where: {
          fileItemsItemId: copiedItemId
        }
      })

      const copiedArtListTap = await ctx.prisma.itemsArtListTap.findMany({
        where: {
          fileItemsItemId: copiedItemId
        }
      })

      const copiedArtLayers = await ctx.prisma.itemArtLayers.findMany({
        where: {
          fileItemsItemId: copiedItemId
        }
      })

      const copiedFadList = await ctx.prisma.itemsFadList.findMany({
        where: {
          fileItemsItemId: copiedItemId
        }
      })

      await ctx.prisma.itemsFullRanges.deleteMany({
        where: {
          fileItemsItemId: destinationItemId
        }
      })
      await ctx.prisma.itemsArtListTog.deleteMany({
        where: {
          fileItemsItemId: destinationItemId
        }
      })
      await ctx.prisma.itemsArtListTap.deleteMany({
        where: {
          fileItemsItemId: destinationItemId
        }
      })
      await ctx.prisma.itemArtLayers.deleteMany({
        where: {
          fileItemsItemId: destinationItemId
        }
      })
      await ctx.prisma.itemsFadList.deleteMany({
        where: {
          fileItemsItemId: destinationItemId
        }
      })

      for (const range of copiedFullRanges) {
        await ctx.prisma.itemsFullRanges.create({
          data: {
            ...range,
            id: range.id.replace(copiedItemId, destinationItemId),
            fileItemsItemId: destinationItemId
          }
        })
      }

      for (const art of copiedArtListTog) {
        await ctx.prisma.itemsArtListTog.create({
          data: {
            ...art,
            id: art.id.replace(copiedItemId, destinationItemId),
            ranges: art.ranges?.replace(
              new RegExp(copiedItemId, 'g'),
              destinationItemId
            ),
            artLayers: art.artLayers?.replace(
              new RegExp(copiedItemId, 'g'),
              destinationItemId
            ),
            fileItemsItemId: destinationItemId
          }
        })
      }

      for (const art of copiedArtListTap) {
        await ctx.prisma.itemsArtListTap.create({
          data: {
            ...art,
            id: art.id.replace(copiedItemId, destinationItemId),
            ranges: art.ranges?.replace(
              new RegExp(copiedItemId, 'g'),
              destinationItemId
            ),
            artLayers: art.artLayers?.replace(
              new RegExp(copiedItemId, 'g'),
              destinationItemId
            ),
            fileItemsItemId: destinationItemId
          }
        })
      }

      for (const layer of copiedArtLayers) {
        await ctx.prisma.itemArtLayers.create({
          data: {
            ...layer,
            id: layer.id.replace(copiedItemId, destinationItemId),
            fileItemsItemId: destinationItemId
          }
        })
      }

      for (const fad of copiedFadList) {
        await ctx.prisma.itemsFadList.create({
          data: {
            ...fad,
            id: fad.id.replace(copiedItemId, destinationItemId),
            fileItemsItemId: destinationItemId
          }
        })
      }

      await ctx.prisma.fileItems.update({
        where: {
          id: destinationItemId
        },
        data: {
          //locked: copiedItem?.locked,
          //name: copiedItem?.name,
          //notes: copiedItem?.notes,
          //channel: copiedItem?.channel,
          //baseDelay: copiedItem?.baseDelay,
          //avgDelay: copiedItem?.avgDelay,
          //vepOut: copiedItem?.vepOut,
          //vepInstance: copiedItem?.vepInstance,
          //smpNumber: copiedItem?.smpNumber,
          //smpOut: copiedItem?.smpOut,
          color: copiedItem?.color,
          fullRange: {
            connect: copiedFullRanges.map((range) => {
              return {
                id: destinationItemId + '_FR_' + range.id.split('_')[3]
              }
            })
          },
          artListTog: {
            connect: copiedArtListTog.map((art) => {
              return {
                id: destinationItemId + '_AT_' + art.id.split('_')[3]
              }
            })
          },
          artListTap: {
            connect: copiedArtListTap.map((art) => {
              return {
                id: destinationItemId + '_AT_' + art.id.split('_')[3]
              }
            })
          },
          artLayers: {
            connect: copiedArtLayers.map((layer) => {
              return {
                id: destinationItemId + '_AL_' + layer.id.split('_')[3]
              }
            })
          },
          fadList: {
            connect: copiedFadList.map((fad) => {
              return {
                id: destinationItemId + '_FL_' + fad.id.split('_')[3]
              }
            })
          }
        }
      })
    })

  ////////////////////////////
  // UNDO/REDO Routers
  // undo
  // redo
})
