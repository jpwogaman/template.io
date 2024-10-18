import { writeFile } from '@tauri-apps/api/fs'
import { save } from '@tauri-apps/api/dialog'

export const exportJSON = async (data: any, title: string) => {
  const json = JSON.stringify(data)

  const result = await save({
    title: title,
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ]
  })

  if (!result) return
  await writeFile(result, json)
}
