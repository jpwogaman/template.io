import { type NextPage } from 'next'
import { useState } from 'react'
import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { useTheme } from 'next-themes'
import useKeyboard from '@/hooks/useKeyboard'
import dynamic from 'next/dynamic'
import useContextMenu from '@/hooks/useContextMenu'
import useMutations from '@/hooks/useMutations'
const ContextMenu = dynamic(() => import('@/components/contextMenu'))

const Index: NextPage = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>('T_0')
  const [selectedSubItemId, setSelectedSubItemId] = useState<null | string>(
    'T_0_FR_0'
  )
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  const [copiedSubItemId, setCopiedSubItemId] = useState<string | null>(null)

  const {
    dataLength,
    vepSamplerCount,
    vepInstanceCount,
    nonVepSamplerCount,
    selectedItemRangeCount,
    selectedItemArtCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    previousItemId,
    nextItemId,
    del,
    renumber
  } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  useKeyboard({
    selectedItemId,
    setSelectedItemId,
    previousItemId,
    nextItemId,
    selectedItemRangeCount,
    selectedItemArtCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    selectedSubItemId,
    setSelectedSubItemId,
    copiedItemId,
    setCopiedItemId,
    copiedSubItemId,
    setCopiedSubItemId
  })
  const { setTheme, resolvedTheme } = useTheme()
  const {
    contextMenuPosition,
    isContextMenuOpen,
    setIsContextMenuOpen,
    contextMenuId,
    setContextMenuId
  } = useContextMenu()

  return (
    <div className='h-screen'>
      {/* CONTEXT MENU */}
      <div className='absolute left-0 top-0 z-[100]'>
        {isContextMenuOpen && (
          <ContextMenu
            contextMenuId={contextMenuId}
            contextMenuPosition={contextMenuPosition}
            setIsContextMenuOpen={setIsContextMenuOpen}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            selectedSubItemId={selectedSubItemId}
            setSelectedSubItemId={setSelectedSubItemId}
            copiedItemId={copiedItemId}
            setCopiedItemId={setCopiedItemId}
            copiedSubItemId={copiedSubItemId}
            setCopiedSubItemId={setCopiedSubItemId}
          />
        )}
      </div>
      {/* NAVBAR */}
      <nav className='container sticky top-0 z-50 max-h-[40px] min-w-full items-center bg-zinc-900'>
        <ul className='flex justify-between'>
          <li className='block whitespace-nowrap p-2 pl-5 text-left text-zinc-200'>
            <span className='underline underline-offset-4'>
              {dataLength} {dataLength > 1 ? 'Tracks' : 'Track'}
            </span>
            <span> across </span>
            <span className='underline underline-offset-4'>
              {vepSamplerCount + nonVepSamplerCount}{' '}
              {vepSamplerCount + nonVepSamplerCount > 1
                ? 'Samplers'
                : 'Sampler'}
            </span>
            <span> (</span>
            <span className='underline underline-offset-4'>
              {vepSamplerCount}
            </span>
            <span> across </span>
            <span className='underline underline-offset-4'>
              {vepInstanceCount}{' '}
              {vepInstanceCount > 1 ? 'VEP Instances' : 'VEP Instance'}
            </span>
            <span> and </span>
            <span className='underline underline-offset-4'>
              {nonVepSamplerCount}
            </span>
            <span> standalone in DAW)</span>
          </li>
          <li className='block flex gap-2 p-2 pl-5 text-left text-zinc-200'>
            <button
              className='border px-2'
              onClick={() => del.allTracks()}>
              Flush DB / Clear All
            </button>
            <button
              className='border px-2'
              onClick={() =>
                renumber.artList({ itemId: selectedItemId ?? '' })
              }>
              Renumber Arts
            </button>
            <button
              className='border px-2'
              onClick={() => renumber.allTracks()}>
              Renumber Tracks
            </button>
            <button className='border px-2'>{copiedItemId}</button>
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
        <TrackList
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
          setIsContextMenuOpen={setIsContextMenuOpen}
          setContextMenuId={setContextMenuId}
          setSelectedSubItemId={setSelectedSubItemId}
        />
        <TrackOptions
          selectedItemId={selectedItemId}
          setIsContextMenuOpen={setIsContextMenuOpen}
          setContextMenuId={setContextMenuId}
          setSelectedItemId={setSelectedItemId}
          selectedSubItemId={selectedSubItemId}
          setSelectedSubItemId={setSelectedSubItemId}
        />
      </main>
    </div>
  )
}

export default Index
