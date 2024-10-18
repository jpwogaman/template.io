import { type NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { useTheme } from 'next-themes'
import useKeyboard from '@/hooks/useKeyboard'
import useContextMenu from '@/hooks/useContextMenu'
import ContextMenu from '@/components/contextMenu'
import { invoke } from '@tauri-apps/api/tauri'

const Index: NextPage = () => {
  //useKeyboard()
  const { setTheme, resolvedTheme } = useTheme()
  const { contextMenuPosition, isContextMenuOpen, setIsContextMenuOpen } =
    useContextMenu()

  const openFileExplorer = (path: string) => {
    invoke('open_file_explorer', { path: path ?? '' })
  }

  return (
    <div className='h-screen'>
      {/* CONTEXT MENU */}
      <div className='absolute left-0 top-0 z-[100]'>
        {isContextMenuOpen && (
          <ContextMenu
            contextMenuPosition={contextMenuPosition}
            setIsContextMenuOpen={setIsContextMenuOpen}
          />
        )}
      </div>
      {/* NAVBAR */}
      <nav className='container sticky top-0 z-50 max-h-[40px] min-w-full items-center bg-zinc-900'>
        <ul className='flex justify-between'>
          <li className='block flex gap-2 p-2 pl-5 text-left text-xs text-zinc-200'>
            <button
              className='border px-2'
              onClick={() =>
                openFileExplorer('')
              }>{`Open File Explorer`}</button>
          </li>
          <li className='block w-60 cursor-pointer p-2 text-right text-zinc-200'>
            <IconBtnToggle
              classes='w-10'
              titleA='Change to Dark Mode.'
              titleB='Change to Light Mode.'
              id='themeChange'
              a='fa-solid fa-circle-half-stroke fa-rotate-180'
              b='fa-solid fa-circle-half-stroke'
              defaultIcon={resolvedTheme === 'light' ? 'a' : 'b'}
              onToggleA={() => setTheme('dark')}
              onToggleB={() => setTheme('light')}
            />
          </li>
        </ul>
      </nav>
      {/* MAIN */}
      <main
        className='flex h-[calc(100%-40px)]'
        onContextMenu={() => {
          setIsContextMenuOpen(true)
        }}></main>
    </div>
  )
}

export default Index
