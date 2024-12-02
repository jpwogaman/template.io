import '@/styles/globals.css'
import { allFontsClassName } from '@/styles/fonts'

import { ThemeProvider } from 'next-themes'
import { TRPCReactProvider } from '@/utils/trpc/react'

import { ModalProvider } from '@/components/modal/modalContext'
import { ContextMenuProvider } from '@/components/contextMenu/contextMenuContext'
import Modal from '@/components/modal'
import { ContextMenu } from '@/components/contextMenu'
import { SelectedItemProvider } from '@/components/selectedItemContext'
import { NavBar } from '@/components/layout/navbar'
import { TauriListenersProvider } from '@/components/tauriListenersContext'
import { KeyboardProvider } from '@/components/keyboardContext'

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={allFontsClassName}>
      <body className='h-screen overflow-x-hidden'>
        <TRPCReactProvider>
          <TauriListenersProvider>
            <SelectedItemProvider>
              <ModalProvider>
                <ContextMenuProvider>
                  <KeyboardProvider>
                    <ThemeProvider
                      storageKey='theme'
                      attribute='class'
                      defaultTheme='light'
                      enableColorScheme>
                      <NavBar />
                      <Modal />
                      <ContextMenu />
                      {children}
                    </ThemeProvider>
                  </KeyboardProvider>
                </ContextMenuProvider>
              </ModalProvider>
            </SelectedItemProvider>
          </TauriListenersProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
