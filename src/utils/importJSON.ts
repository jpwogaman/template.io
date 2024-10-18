import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'

export const importJSON = async (title: string) => {
  const result = await open({
    title: title,
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
