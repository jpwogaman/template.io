import '@/styles/globals.css'
import { allFontsClassName } from '@/styles/fonts'

import { ThemeProvider } from 'next-themes'
import { TRPCReactProvider } from '@/utils/trpc/react'

import { ModalProvider } from '@/components/modal/modalContext'
import { ContextMenuProvider } from '@/components/contextMenu/contextMenuContext' 
import Modal from '@/components/modal'
import {ContextMenu} from '@/components/contextMenu'
import { SelectedItemProvider } from '@/components/selectedItemContext'

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={allFontsClassName}>
      <body className='overflow-x-hidden'>
        <TRPCReactProvider>
            <ModalProvider>
              <ContextMenuProvider>
              <SelectedItemProvider>
              <ThemeProvider
                storageKey='theme'
                attribute='class'
                defaultTheme='light'
                enableColorScheme>
                <Modal />
                <ContextMenu />
                {children}
              </ThemeProvider>
              </SelectedItemProvider>
              </ContextMenuProvider>
            </ModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
