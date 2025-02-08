import '@/styles/globals.css'
import { allFontsClassName } from '@/styles/fonts'

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
      <body>
        <SelectedItemProvider>
          <MutationProvider>
            <KeyboardProvider>
              <ModalProvider>
                <ContextMenuProvider>
                  <TauriListenersProvider>
                    <ThemeProvider
                      storageKey='theme'
                      attribute='class'
                      defaultTheme='dark'
                      enableColorScheme
                      themes={['dark', 'light']}>
                      <NavBar />
                      <Modal />
                      <ContextMenu />
                      {children}
                    </ThemeProvider>
                  </TauriListenersProvider>
                </ContextMenuProvider>
              </ModalProvider>
            </KeyboardProvider>
          </MutationProvider>
        </SelectedItemProvider>
      </body>
    </html>
  )
}
