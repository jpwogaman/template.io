import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'
import { type EventName } from '@tauri-apps/api/event'
import { defaultColor, Layouts, LayoutKeys } from '@prisma/client'


export const FileMetadata = createTRPCRouter({
  getMetaData: publicProcedure
    .input(
      z.object({
        event: z.enum<EventName, [EventName, ...EventName[]]>(['tauri://menu']),
        payload: z.enum(['open', 'save', 'save_as'])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { event, payload } = input
    }),
  updateMetaData: publicProcedure
    .input(
      z.object({
        fileName: z.string().optional(),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
        defaultColors: z.custom<defaultColor[]>(),
        layouts: z.custom<Layouts[]>(), 
        vepTemplate: z.string().optional(),
        dawTemplate: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        fileName,
        createdAt,
        updatedAt,
        defaultColors,
        layouts,
        vepTemplate,
        dawTemplate
      } = input

      
      return await ctx.prisma.fileMetaData.update({
        data: {
          fileName,
          createdAt,
          updatedAt,
          defaultColors,
          layouts,
          vepTemplate,
          dawTemplate
        }
      })
    })
})
