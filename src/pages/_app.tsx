import { type AppType } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { listen } from '@tauri-apps/api/event'
import { exportJSON } from '@/utils/exportJSON'
import { importJSON } from '@/utils/importJSON'
import { trpc } from '@/utils/trpc'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const Modal = dynamic(() => import('@/components/modal'))
import useModal from '@/hooks/useModal'

import '@/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false)
  const { modalOpen, close, open, setModalText, modalText } = useModal()

  const exportMutation = trpc.tauriMenuEvents.export.useMutation({
    onSuccess: (data) => {
      exportJSON(data)
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
      onError: (error) => {
        alert(error.message)
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

  listen('export', () => {
    exportMutation.mutate()
  })
  listen('import', () => {
    importJSON().then((data) => {
      createAllItemsFromJSONMutation.mutate(data ?? '')
    })
  })
  listen('delete_all', () => {
    deleteAllItemsMutation.mutate()
  })
  listen('about', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalText('about')
    }
  })
  listen('settings', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalText('settings')
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
            modalText={modalText}
          />
        )}
        <Component {...pageProps} />
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default trpc.withTRPC(MyApp)
