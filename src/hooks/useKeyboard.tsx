'use client'
import { useEffect, type Dispatch, type SetStateAction } from 'react'
import useMutations from '@/hooks/useMutations'

type useKeyboardProps = {
  previousItemId: string
  nextItemId: string
  selectedItemRangeCount: number
  selectedItemArtCount: number
  selectedItemArtTogCount: number
  selectedItemArtTapCount: number
  selectedItemLayerCount: number
  selectedItemFadCount: number
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
  selectedSubItemId: string | null
  setSelectedSubItemId: Dispatch<SetStateAction<string | null>>
  copiedItemId: string | null
  setCopiedItemId: Dispatch<SetStateAction<string | null>>
  copiedSubItemId: string | null
  setCopiedSubItemId: Dispatch<SetStateAction<string | null>>
}

const useKeyboard = ({
  previousItemId,
  nextItemId,
  selectedItemRangeCount: rangeCount,
  selectedItemArtCount: artCount,
  selectedItemArtTogCount: artTogCount,
  selectedItemArtTapCount: artTapCount,
  selectedItemLayerCount: layerCount,
  selectedItemFadCount: fadCount,
  selectedItemId,
  setSelectedItemId,
  setSelectedSubItemId,
  copiedItemId,
  setCopiedItemId,
  copiedSubItemId,
  setCopiedSubItemId
}: useKeyboardProps) => {
  const { selectedItem, create, del, clear, paste } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const selectedInput = window.document.activeElement as HTMLInputElement

      const isButton = selectedInput?.tagName === 'BUTTON'
      const isSelect = selectedInput?.tagName === 'SELECT'

      ////////////////////////////////
      // Find out if selectedInput is in Track Options
      const selectedInputIsInTrackOptions =
        selectedInput?.id.includes('_FR_') ||
        selectedInput?.id.includes('_AT_') ||
        selectedInput?.id.includes('_AL_') ||
        selectedInput?.id.includes('_FL_')

      const optionType = selectedInput?.id.split('_')[2]
      const optionNumber = selectedInput?.id.split('_')[3]
      const optionField = selectedInput?.id.split('_')[4]

      ////////////////////////////////
      // Special case for Articulations
      const artId = selectedItemId + '_AT_' + optionNumber
      const isArtTog = (artId: string) => {
        const art = selectedItem?.artListTog?.find((art) => art.id === artId)
        if (art) return true
      }

      ////////////////////////////////
      // NAVIGATE TRACKS or ARTS or LAYERS or FADS
      if (!e.ctrlKey && !e.shiftKey && e.key === 'ArrowUp') {
        
        if (selectedInput?.id.includes('notes')) return      
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') - 1
          let newInput =
            selectedItemId +
            '_' +
            optionType +
            '_' +
            nextNumber +
            '_' +
            optionField

          let previousSubItemId =
            selectedItemId + '_' + optionType + '_' + nextNumber

          if (optionType === 'FR' && nextNumber < 0) {
            return
          }
          if (optionType === 'AT' && nextNumber < 0) {
            newInput =
              selectedItemId + '_FR_' + (rangeCount - 1) + '_' + optionField
            previousSubItemId = selectedItemId + '_FR_' + (rangeCount - 1)
          }
          if (optionType === 'AL' && nextNumber < 0) {
            newInput =
              selectedItemId + '_AT_' + (artCount - 1) + '_' + optionField
            previousSubItemId = selectedItemId + '_AT_' + (artCount - 1)
          }
          if (optionType === 'FL' && nextNumber < 0) {
            newInput =
              selectedItemId + '_AL_' + (layerCount - 1) + '_' + optionField
            previousSubItemId = selectedItemId + '_AL_' + (layerCount - 1)
          }

          setSelectedSubItemId(previousSubItemId)

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }
        if (previousItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          previousItemId
        )
        const previousInput = window.document.getElementById(newInput ?? '')

        selectedInput?.blur()
        previousInput?.focus()
        setSelectedItemId(previousItemId)
        setSelectedSubItemId(previousItemId + '_notes')      
      }
      if (!e.ctrlKey && !e.shiftKey && e.key === 'ArrowDown') {

        if (selectedInput?.id.includes('notes')) return
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') + 1
          let newInput =
            selectedItemId +
            '_' +
            optionType +
            '_' +
            nextNumber +
            '_' +
            optionField

          let nextSubItemId =
            selectedItemId + '_' + optionType + '_' + nextNumber

          if (optionType === 'FR' && nextNumber > rangeCount - 1) {
            newInput = selectedItemId + '_AT_0_' + optionField
            nextSubItemId = selectedItemId + '_AT_0'
          }
          if (optionType === 'AT' && nextNumber > artCount - 1) {
            newInput = selectedItemId + '_AL_0_' + optionField
            nextSubItemId = selectedItemId + '_AL_0'
          }
          if (optionType === 'AL' && nextNumber > layerCount - 1) {
            newInput = selectedItemId + '_FL_0_' + optionField
            nextSubItemId = selectedItemId + '_FL_0'
          }
          if (optionType === 'FL' && nextNumber > fadCount - 1) {
            return
          }
          setSelectedSubItemId(nextSubItemId)

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (nextItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          nextItemId
        )
        const nextInput = window.document.getElementById(newInput ?? '')

        nextInput?.focus()
        setSelectedItemId(nextItemId)
        setSelectedSubItemId(nextItemId + '_notes')
      }
      if (e.shiftKey && e.key === 'ArrowUp') {
        if (!selectedInput?.id.includes('_FR_0')) return
        e.preventDefault()
        const nextInput = window.document.getElementById(selectedItemId + '_notes')
        setSelectedSubItemId(selectedItemId + '_notes')
        nextInput?.focus()
      }
      if (e.shiftKey && e.key === 'ArrowDown') {
        if (!selectedInput?.id.includes('_notes')) return
        e.preventDefault()

        const nextInput = window.document.getElementById(selectedItemId + '_FR_0_name')
        setSelectedSubItemId(selectedItemId + '_FR_0')
        nextInput?.focus()
      }


      ////////////////////////////////
      // NAVIGATE BETWEEN TRACKLIST AND TRACK OPTIONS
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (isSelect) e.preventDefault()
      }
      if (e.ctrlKey && e.key === 'ArrowRight') {
        if (selectedInput?.id.includes('notes')) return 
        if (selectedInputIsInTrackOptions) return

        e.preventDefault()
        const trackOptionsNameInput = window.document.getElementById(
          selectedItemId + '_notes'
        )
        setSelectedSubItemId(selectedItemId + '_notes')
        trackOptionsNameInput?.focus()
      }
      if (e.ctrlKey && e.key === 'ArrowLeft') {        
        if (!selectedInput?.id.includes('notes') && !selectedInputIsInTrackOptions) return
        
        e.preventDefault()
        const trackListNameInput = window.document.getElementById(
          selectedItemId + '_name'
        )
        trackListNameInput?.focus()
      }
      ////////////////////////////////
      // ADD NEW TRACK or ART or LAYER or FAD
      if (!e.altKey && e.ctrlKey && e.shiftKey && e.key === 'ArrowUp') {
        if (selectedInput?.id.includes('notes')) return 
        e.preventDefault()
        alert('Add new item above')
        //create.track()
      }
      if (!e.altKey && e.ctrlKey && e.shiftKey && e.key === 'ArrowDown') {
        if (selectedInput?.id.includes('notes')) return 
        e.preventDefault()
        alert('Add new item below')
        create.track({ count: 1 })
      }
      ////////////////////////////////
      // DUPLICATE TRACK or ART or LAYER or FAD
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'ArrowUp') {
        if (selectedInput?.id.includes('notes')) return 
        e.preventDefault()
        alert('Duplicate selected item above')
      }
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'ArrowDown') {
        if (selectedInput?.id.includes('notes')) return 
        e.preventDefault()
        alert('Duplicate selected item below')
      }
      ////////////////////////////////
      // DELETE TRACK or ART or LAYER or FAD
      if (e.ctrlKey && e.key === 'Delete') {
        e.preventDefault()
        if (selectedInputIsInTrackOptions) {
          switch (optionType) {
            case 'FR':
              del.fullRange({
                rangeId: optionNumber ?? '',
                fileItemsItemId: selectedItemId ?? ''
              })
              break
            case 'AT':
              if (isArtTog(artId ?? '')) {
                del.artListTog({
                  artId: artId ?? '',
                  fileItemsItemId: selectedItemId ?? ''
                })
              }
              if (!isArtTog(artId ?? '')) {
                del.artListTap({
                  artId: artId ?? '',
                  fileItemsItemId: selectedItemId ?? ''
                })
              }
              break
            case 'AL':
              del.artLayer({
                layerId: optionNumber ?? '',
                fileItemsItemId: selectedItemId ?? ''
              })
              break
            case 'FL':
              del.fadList({
                fadId: optionNumber ?? '',
                fileItemsItemId: selectedItemId ?? ''
              })
              break
            default:
              break
          }
          return
        }

        //del.track({
        //  itemId: selectedItemId ?? ''
        //})
      }
      ////////////////////////////////
    }

    window.addEventListener('keydown', handleKeys)
    return () => {
      window.removeEventListener('keydown', handleKeys)
    }
  }, [setSelectedItemId, selectedItemId])

  return {}
}

export default useKeyboard
