import '@/styles/globals.css'
import { allFontsClassName } from '@/styles/fonts'

import { TRPCReactProvider } from '@/utils/trpc/react'
import {
  TauriListenersProvider,
  SelectedItemProvider,
  MutationProvider,
  ModalProvider,
  ContextMenuProvider,
  KeyboardProvider
} from '@/components/context'
import { ThemeProvider } from 'next-themes'

import { NavBar } from '@/components/layout/navbar'
import { Modal } from '@/components/modal'
import { ContextMenu } from '@/components/contextMenu'

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
              <MutationProvider>
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
              </MutationProvider>
            </SelectedItemProvider>
          </TauriListenersProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
