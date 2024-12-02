'use client'

import { type NextPage } from 'next'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/core';

import { exportJSON } from '@/utils/exportJSON'
import { importJSON } from '@/utils/importJSON'
import {api as trpc } from '@/utils/trpc/react'

import useKeyboard from '@/hooks/useKeyboard'

import useMutations from '@/hooks/useMutations'

import { useModal } from '@/components/modal/modalContext'
import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'
import { IconBtnToggle } from '@/components/icon-btn-toggle'

import { useSelectedItem } from '@/components/selectedItemContext'

const Index: NextPage = () => {
    const {selectedItemId,
  setSelectedItemId,
  selectedSubItemId,
  setSelectedSubItemId,
  copiedItemId,
  setCopiedItemId,
  copiedSubItemId,
  setCopiedSubItemId} = useSelectedItem()
  const [mounted, setMounted] = useState(false)
  const { modalOpen, close, open, setModalType } = useModal()
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
  
  const exportMutation = trpc.tauriMenuEvents.export.useMutation({
    onSuccess: (data) => {
      exportJSON(data)
      exportMutation.reset()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  const createAllItemsFromJSONMutation =
    trpc.items.createAllItemsFromJSON.useMutation({
      onSuccess: () => {
        createAllItemsFromJSONMutation.reset()
      },
      onError: (error) => {
        alert(error.message)
      }
    })
  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      deleteAllItemsMutation.reset()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  listen('export', () => {
    exportMutation.mutate()
  })
  listen('import', () => {
    importJSON().then((data) => {
      createAllItemsFromJSONMutation.mutate(data ?? '')
    })
  })
  listen('delete_all', () => {
    deleteAllItemsMutation.mutate()
  })
  listen('about', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalType('about')
    }
  })
  listen('settings', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalType('settings')
    }
  })
  const listItems = ()=>{
    invoke('list_fileitems').then((response) => {
      console.log(response);
    });
  } 
  const createItem = ()=>{
    invoke('create_fileitem').then((response) => {
      console.log(response);
    });
  }  
  return (
    <div className='h-screen'>
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
              {vepSamplerCount + nonVepSamplerCount > 1 ? 'Samplers' : 'Sampler'}
            </span>
            <span> (</span>
            <span className='underline underline-offset-4'>{vepSamplerCount}</span>
            <span> across </span>
            <span className='underline underline-offset-4'>
              {vepInstanceCount} {vepInstanceCount > 1 ? 'VEP Instances' : 'VEP Instance'}
            </span>
            <span> and </span>
            <span className='underline underline-offset-4'>{nonVepSamplerCount}</span>
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
            <button className='border px-2' onClick={listItems}>SQL Test</button>
            <button className='border px-2' onClick={createItem}>SQL Create</button>
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
        <TrackList />
        <TrackOptions />
      </main>
    </div>
  )
}

export default Index
