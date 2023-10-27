import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/trpc/trpc'
import { type EventName } from '@tauri-apps/api/event'

export const TauriMenuEvents = createTRPCRouter({
  export: publicProcedure
    .input(
      z.object({
        event: z.enum<EventName, [EventName, ...EventName[]]>(['tauri://menu']),
        payload: z.enum(['import', 'export'])
      })
    )
    .mutation(async ({ ctx }) => {
      const allItems = await ctx.prisma.fileItems.findMany({
        include: {
          fullRange: true,
          artListTog: true,
          artListSwitch: true,
          fadList: true
        }
      })
      return {
        allItems
      }
    })
})
