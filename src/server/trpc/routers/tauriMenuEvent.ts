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
