import { type AppType } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { listen } from '@tauri-apps/api/event'
import { downloadDataAsJSON } from '@/utils/exportJSON'
import { trpc } from '@/utils/trpc'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const Modal = dynamic(() => import('@/components/modal'))
import useModal from '@/hooks/useModal'

import '@/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false)
  const { modalOpen, close, open } = useModal({
    route: '/contact',
    refreshAfterClose: false
  })

  const exportMutation = trpc.tauriMenuEvents.export.useMutation({
    onSuccess: (data) => {
      downloadDataAsJSON(data)
      exportMutation.reset()
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

  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      deleteAllItemsMutation.reset()
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
      if (event.payload === 'export') {
        exportMutation.mutate({
          event: 'tauri://menu',
          payload: 'export'
        })
      }

      if (event.payload === 'import') {
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

      if (event.payload === 'about') {
        if (modalOpen) {
          close()
        } else {
          open()
        }
      }
    })

  return (
    <ThemeProvider
      key='theme'
      attribute='class'
      defaultTheme='light'>
      <AnimatePresence
        initial={false}
        mode='wait'>
        {modalOpen && (
          <Modal
            handleClose={close}
            text='Template.io'
          />
        )}
        <Component {...pageProps} />
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
