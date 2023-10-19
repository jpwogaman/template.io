import { type AppType } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { listen } from '@tauri-apps/api/event'
import { downloadDataAsJSON } from '@/utils/exportJSON'
import { trpc } from '@/utils/trpc'
import { useState, useEffect } from 'react'
import '@/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false)

  const saveMutation = trpc.tauriMenuEvents.save.useMutation({
    onSuccess: (data) => {
      downloadDataAsJSON(data)
      saveMutation.reset()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const saveAsMutation = trpc.tauriMenuEvents.saveAs.useMutation({
    onSuccess: (data) => {
      downloadDataAsJSON(data)
      saveAsMutation.reset()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const createAllItemsFromJSONMutation =
    trpc.items.createAllItemsFromJSON.useMutation({
      onSuccess: () => {
        createAllItemsFromJSONMutation.reset()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  mounted &&
    listen('tauri://menu', (event) => {
      //if (event.payload === 'save') {
      //  saveMutation.mutate({
      //    event: 'tauri://menu',
      //    payload: 'save'
      //  })
      //}
      if (event.payload === 'save_as') {
        saveAsMutation.mutate({
          event: 'tauri://menu',
          payload: 'save_as'
        })
      }

      if (event.payload === 'open') {
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = '.json'

        fileInput.onchange = (e) => {
          const targetFile = (e.target as HTMLInputElement).files![0]
          const fileReader = new FileReader()
          fileReader.readAsText(targetFile as unknown as Blob, 'UTF-8')
          fileReader.onload = (loadedEvent) => {
            createAllItemsFromJSONMutation.mutate(
              loadedEvent.target!.result as unknown as string
            )
          }
        }
        fileInput.click()
      }
    })

  return (
    <ThemeProvider
      key='theme'
      attribute='class'
      defaultTheme='dark'>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
