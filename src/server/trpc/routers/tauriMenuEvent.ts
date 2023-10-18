import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'
import { type EventName } from '@tauri-apps/api/event'

export const TauriMenuEvents = createTRPCRouter({
  save: publicProcedure
    .input(
      z.object({
        event: z.enum<EventName, [EventName, ...EventName[]]>(['tauri://menu']),
        payload: z.enum(['open', 'save', 'save_as'])
      })
    )
    .mutation(async ({ ctx }) => {
      const fileMetaData = await ctx.prisma.fileMetaData.findFirst({
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
    }),
  saveAs: publicProcedure
    .input(
      z.object({
        event: z.enum<EventName, [EventName, ...EventName[]]>(['tauri://menu']),
        payload: z.enum(['open', 'save', 'save_as'])
      })
    )
    .mutation(async ({ ctx }) => {
      const fileMetaData = await ctx.prisma.fileMetaData.findFirst({
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
    })
})
