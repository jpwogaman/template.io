'use client'

import { type FC } from 'react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { IconBtnToggle } from '@/components/layout/icon-btn-toggle'
import {
  useMutations,
  useSelectedItem,
  useContextMenu
} from '@/components/context'

export const NavBar: FC = () => {
  const { selectedItemId, setSelectedItemId, copiedItemId, copiedSubItemId } =
    useSelectedItem()
  const [mounted, setMounted] = useState(false)
  const {
    dataLength,
    vepSamplerCount,
    vepInstanceCount,
    nonVepSamplerCount,
    renumber
  } = useMutations()

  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  const listItems = () => {
    invoke('list_all_fileitems_and_relations').then((response) => {
      console.log(response)
    })
  }
  const createItem = () => {
    invoke('create_fileitem', { count: 1 }).then((response) => {
      console.log(response)
    })
  }
  const createArtTog = () => {
    invoke('create_art_tog', { fileitems_item_id: 'T_0', count: 1 }).then(
      (response) => {
        console.log(response)
      }
    )
  }
  const createArtTap = () => {
    invoke('create_art_tap', { fileitems_item_id: 'T_0', count: 1 }).then(
      (response) => {
        console.log(response)
      }
    )
  }
  return (
    <nav className='container sticky top-0 z-50 max-h-[40px] min-w-full items-center bg-zinc-900'>
      <ul className='flex justify-between'>
        <li className='block whitespace-nowrap p-2 pl-5 text-left text-zinc-200'>
          <span className='underline underline-offset-4'>
            {dataLength} {dataLength > 1 ? 'Tracks' : 'Track'}
          </span>
          <span> across </span>
          <span className='underline underline-offset-4'>
            {vepSamplerCount + nonVepSamplerCount}{' '}
            {vepSamplerCount + nonVepSamplerCount > 1 ? 'Samplers' : 'Sampler'}
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
        <li className='block flex gap-2 p-2 pl-5 text-left text-xs text-zinc-200'>
          <button
            className='border px-2'
            onClick={() => renumber.artList({ itemId: selectedItemId ?? '' })}>
            Renumber Arts
          </button>
          <button
            className='border px-2'
            onClick={() => renumber.allTracks()}>
            Renumber Tracks
          </button>
          <button className='border px-2'>{`Copied Item: ${copiedItemId}`}</button>
          <button className='border px-2'>{`Copied SubItem: ${copiedSubItemId}`}</button>
          <button
            className='border px-2'
            onClick={listItems}>
            SQL Test
          </button>
          <button
            className='border px-2'
            onClick={createItem}>
            SQL Create
          </button>
          <button
            className='border px-2'
            onClick={createArtTog}>
            SQL Create Art Tog
          </button>
          <button
            className='border px-2'
            onClick={createArtTap}>
            SQL Create Art Tap
          </button>
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
  )
}
