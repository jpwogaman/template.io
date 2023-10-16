import { z } from 'zod'

import { router, publicProcedure } from '@/server/trpc/trpc'
import {
  FileData,
  FileItems,
  FileMetaData
} from '@/utils/template-io-track-data-schema'

export const ItemsRouter = router({
  createAllItemsFromJSON: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const fileData = JSON.parse(input) as FileData
      const { fileMetaData, items } = fileData

      const deleteAllItemsAndMetaData = async () => {
        await ctx.prisma.fileMetaData.deleteMany({})
        await ctx.prisma.fileItems.deleteMany({})
        await ctx.prisma.itemsFullRanges.deleteMany({})
        await ctx.prisma.itemsArtListTog.deleteMany({})
        await ctx.prisma.itemsArtListSwitch.deleteMany({})
        await ctx.prisma.itemsFadList.deleteMany({})
      }

      deleteAllItemsAndMetaData()

      //const newFileMetaData = await ctx.prisma.fileMetaData.create({
      //  data: {
      //    ...fileMetaData
      //  }
      //})

      //const newFileMetaData = await ctx.prisma.fileMetaData.create({
      //  data: {
      //    fileName: fileMetaData.fileName,
      //    createdAt: fileMetaData.createdAt,
      //    updatedAt: fileMetaData.updatedAt,
      //    //defaultColors: fileMetaData.defaultColors,
      //    layouts: {
      //      create: fileMetaData.layouts.map((layout) => {
      //        return {
      //          label: layout.label,
      //          title: layout.title,
      //          layout: layout.layout,
      //          keys: {
      //            create: layout.keys.map((key) => {
      //              return {
      //                label: key.label,
      //                key: key.key,
      //                show: key.show,
      //                className: key.className,
      //                input: key.input,
      //                selectArray: key.selectArray
      //              }
      //            })
      //          }
      //        }
      //      })
      //    },
      //    vepTemplate: fileMetaData.vepTemplate,
      //    dawTemplate: fileMetaData.dawTemplate
      //  }
      //})

      for (const item of items) {
        const newItem = await ctx.prisma.fileItems.create({
          data: {
            itemId: item.itemId,
            locked: item.locked as boolean,
            name: item.name,
            channel: parseInt(item.channel as string),
            baseDelay: parseInt(item.baseDelay as string),
            avgDelay: parseInt(item.avgDelay as string),
            color: item.color,
            fullRange: {
              create: item.fullRange.map((range) => {
                return {
                  rangeId: range.rangeId
                }
              })
            },
            artListTog: {
              create: item.artListTog.map((art) => {
                return {
                  artId: art.artId
                }
              })
            },
            artListSwitch: {
              create: item.artListSwitch.map((art) => {
                return {
                  artId: art.artId
                }
              })
            },
            fadList: {
              create: item.fadList.map((fad) => {
                return {
                  fadId: fad.fadId
                }
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
        return item.itemId
      })
    return await ctx.prisma.fileItems.update({
      where: {
        itemId: newItemId
      },
      data: {
        fullRange: {
          create: {
            rangeId: newItemId + '_range_0'
          }
        },
        artListTog: {
          create: {
            artId: newItemId + '_art_0'
          }
        },
        artListSwitch: {
          create: {
            artId: newItemId + '_art_1'
          }
        },
        fadList: {
          create: {
            fadId: newItemId + '_fad_0'
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
          itemId: itemId
        }
      })

      return await ctx.prisma.fileItems.update({
        where: {
          itemId: itemId
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
          itemId: itemId
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
              itemId: itemId
            }
          },
          rangeId: itemId + '_range_' + lastRangeNumber
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
          rangeId: rangeId
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
            rangeId: range.rangeId
          },
          data: {
            rangeId: range.rangeId.split('_')[0] + '_range_' + index
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
              itemId: itemId
            }
          },
          artId: itemId + '_art_' + lastArtNumber
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
          artId: artId
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
              itemId: itemId
            }
          },
          artId: itemId + '_art_' + lastArtNumber
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
          artId: artId
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
              itemId: itemId
            }
          },
          fadId: itemId + '_fad_' + lastFadNumber
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
          fadId: fadId
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
        fullRange: true,
        artListTog: true,
        artListSwitch: true,
        fadList: true
      }
    })
  })
})
