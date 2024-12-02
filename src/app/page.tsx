'use client'

import { type NextPage } from 'next'
import { useState, useEffect } from 'react'
import { listen } from '@tauri-apps/api/event'

import { exportJSON } from '@/utils/exportJSON'
import { importJSON } from '@/utils/importJSON'
import {api as trpc } from '@/utils/trpc/react'

import useKeyboard from '@/hooks/useKeyboard'
import useMutations from '@/hooks/useMutations'

import { useModal } from '@/components/modal/modalContext'
import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'

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
    selectedItemRangeCount,
    selectedItemArtCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    previousItemId,
    nextItemId,
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

  return (
      <main className='flex h-[calc(100%-40px)]'>
        <TrackList />
        <TrackOptions />
      </main>
  )
}

export default Index
