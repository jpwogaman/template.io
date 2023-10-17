import { z } from 'zod'
import { router, publicProcedure } from '@/server/trpc/trpc'
import { type EventName } from '@tauri-apps/api/event'

export const FileMetadata = router({
  getMetaData: publicProcedure
    .input(
      z.object({
        event: z.enum<EventName, [EventName, ...EventName[]]>(['tauri://menu']),
        payload: z.enum(['open', 'save', 'save_as'])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { event, payload } = input
    })
})
