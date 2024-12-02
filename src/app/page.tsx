'use client'

import { type NextPage } from 'next'
import useKeyboard from '@/hooks/useKeyboard'
import useMutations from '@/hooks/useMutations'

import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'

import { useSelectedItem } from '@/components/selectedItemContext'

const Index: NextPage = () => {
  const {
    selectedItemId,
    setSelectedItemId,
    selectedSubItemId,
    setSelectedSubItemId,
    copiedItemId,
    setCopiedItemId,
    copiedSubItemId,
    setCopiedSubItemId
  } = useSelectedItem()
  const {
    selectedItemRangeCount,
    selectedItemArtCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    previousItemId,
    nextItemId
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

  return (
    <main className='flex h-[calc(100%-40px)]'>
      <TrackList />
      <TrackOptions />
    </main>
  )
}

export default Index
