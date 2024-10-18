import { type AppType } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { listen } from '@tauri-apps/api/event'
import { Command } from '@tauri-apps/api/shell'
import { exportJSON } from '@/utils/exportJSON'
import { importJSON } from '@/utils/importJSON'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Modal from '@/components/modal'
import useModal from '@/hooks/useModal'

import '@/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  const [mounted, setMounted] = useState(false)
  const [isTauri, setIsTauri] = useState(false)

  const { modalOpen, close, open, setModalText, modalText } = useModal()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
      setIsTauri((window as any).__TAURI__)
    }
  }, [])

  if (!mounted || !isTauri) return null

  //////////////////////////////////////////
  Command.sidecar('bin/template-io-server').execute()

  listen('tauri://menu', (event: { payload: string }) => {
    if (event.payload === 'export') {
      exportJSON({ data: 'data' }, 'Window Title')
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
