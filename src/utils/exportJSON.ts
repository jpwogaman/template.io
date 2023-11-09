import { writeFile } from '@tauri-apps/api/fs'
import { save } from '@tauri-apps/api/dialog'

export const exportJSON = async (data: any) => {
  const json = JSON.stringify(data)

  const result = await save({
    title: 'Save Track Data',
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
