import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'

export const importJSON = async () => {
  const result = await open({
    title: 'Open Track Data',
    filters: [
      {
        name: 'JSON',
        extensions: ['json']
      }
    ]
  })

  if (!result) return

  const json = await readTextFile(result as string)
  return json
}
