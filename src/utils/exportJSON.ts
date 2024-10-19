import { writeFile } from '@tauri-apps/plugin-fs'
import { save } from '@tauri-apps/plugin-dialog'

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
