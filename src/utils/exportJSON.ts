import { save } from '@tauri-apps/plugin-dialog'
import { writeTextFile } from '@tauri-apps/plugin-fs'

export const exportJSON = async (data: any) => {
  const json = JSON.stringify(data)

  const filePath = await save({
    title: 'Save Track Data',
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ]
  })

  if (!filePath) return
  await writeTextFile(filePath, json)
}
