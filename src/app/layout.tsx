import '@/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import {
  TauriListenersProvider,
  SelectedItemProvider,
  MutationProvider,
  ModalProvider,
  ContextMenuProvider,
  KeyboardProvider,
  SelectArraysProvider
} from '@/components/context'
import { NavBar } from '@/components/layout/navbar'
import { Modal } from '@/components/modal'
import { ContextMenu } from '@/components/contextMenu'
import { allFontsClassName } from '@/styles/fonts'

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
            <SelectArraysProvider>
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
            </SelectArraysProvider>
          </MutationProvider>
        </SelectedItemProvider>
      </body>
    </html>
  )
}
