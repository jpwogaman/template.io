import '@/styles/globals.css'
import { allFontsClassName } from '@/styles/fonts'

import { ThemeProvider } from 'next-themes'
import { TRPCReactProvider } from '@/utils/trpc/react'

import { ModalProvider } from '@/components/modal/modalContext'
import Modal from '@/components/modal'

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
              <ThemeProvider
                storageKey='theme'
                attribute='class'
                defaultTheme='light'
                enableColorScheme>
                <Modal />
                {children}
              </ThemeProvider>
            </ModalProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
