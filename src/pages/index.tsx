import { type NextPage } from 'next'
import { use, useEffect, useRef, useState } from 'react'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { useTheme } from 'next-themes'
import useKeyboard from '@/hooks/useKeyboard'
import dynamic from 'next/dynamic'
import useContextMenu from '@/hooks/useContextMenu'
import useMutations from '@/hooks/useMutations'
const ContextMenu = dynamic(() => import('@/components/contextMenu'))

const Index: NextPage = () => {
  
  const [isTauri, setIsTauri] = useState(false)
  //const {} = useMutations()
  //useKeyboard()
  const { setTheme, resolvedTheme } = useTheme()
  const {
    contextMenuPosition,
    isContextMenuOpen,
    setIsContextMenuOpen,
    contextMenuId,
  } = useContextMenu()

  const openFileExplorer = () => {
    if (!isTauri) return
    import('@tauri-apps/api/tauri').then((mod) =>{
      const invoke = mod.invoke
      invoke('open_file_explorer', {path: ''})
    })
  }


  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTauri((window as any).__TAURI__);
    }
    
    if (isTauri) {
      import('@tauri-apps/api/shell').then((mod) => {
        const command = mod.Command.sidecar('bin/template-io-server')        
        command.execute();
      });
    }
  }, []);

  return (
    <div className='h-screen'>
      {/* CONTEXT MENU */}
      <div className='absolute left-0 top-0 z-[100]'>
        {isContextMenuOpen && (
          <ContextMenu
            contextMenuId={contextMenuId}
            contextMenuPosition={contextMenuPosition}
            setIsContextMenuOpen={setIsContextMenuOpen}            
          />
        )}
      </div>
      {/* NAVBAR */}
      <nav className='container sticky top-0 z-50 max-h-[40px] min-w-full items-center bg-zinc-900'>
        <ul className='flex justify-between'>
          <li className='block flex gap-2 p-2 pl-5 text-left text-xs text-zinc-200'>
            
            <button className='border px-2'
              onClick={() => openFileExplorer()}
            >{`Open File Explorer`}</button>

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
      <main className='flex h-[calc(100%-40px)]'>
        
      </main>
    </div>
  )
}

export default Index
