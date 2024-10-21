import { open } from '@tauri-apps/plugin-dialog'
import { readTextFile } from '@tauri-apps/plugin-fs'

export const importJSON = async () => {

  const filePath = await open({
    title: 'Open Track Data',
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ]
  })

  if (!filePath) return
  const json = await readTextFile(filePath)
  return json
}
