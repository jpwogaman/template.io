import { type AppType } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { listen } from '@tauri-apps/api/event'
import { exportJSON } from '@/utils/exportJSON'
import { importJSON } from '@/utils/importJSON'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
const Modal = dynamic(() => import('@/components/modal'))
import useModal from '@/hooks/useModal'

import '@/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false)
  const { modalOpen, close, open, setModalText, modalText } = useModal()

  const exportMutation = ''
  const createAllItemsFromJSONMutation = ''
    
    
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  mounted &&
    listen('tauri://menu', (event: { payload: string }) => {
      if (event.payload === 'export') {
        exportJSON(exportMutation, 'Window Title')
      }

      if (event.payload === 'import') {
        importJSON('Window Title').then((data) => {})
      }

      if (event.payload === 'about') {
        if (modalOpen) {
          close()
        } else {
          open()
          setModalText('about')
        }
      }

      if (event.payload === 'settings') {
        if (modalOpen) {
          close()
        } else {
          open()
          setModalText('settings')
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
            modalText={modalText}
          />
        )}
        <Component {...pageProps} />
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default MyApp
