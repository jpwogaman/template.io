'use client'

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type FC,
  useCallback,
  useState,
  useRef
} from 'react'
import { useMutations, useSelectedItem } from '@/components/context'

interface KeyboardType {}

const keyboardContextDefaultValues: KeyboardType = {}

export const KeyboardContext = createContext<KeyboardType>(
  keyboardContextDefaultValues
)

interface KeyboardProviderProps {
  children: ReactNode
}

export const KeyboardProvider: FC<KeyboardProviderProps> = ({ children }) => {
  const {
    selectedItemId,
    setSelectedItemId,
    copiedItemId,
    copiedSubItemId,
    selectedSubItemId,
    setCopiedItemId,
    setCopiedSubItemId,
    nextItemId,
    setNextItemId,
    previousItemId,
    setPreviousItemId,
    setSelectedSubItemId,
    selectedItemRangeCount,
    selectedItemArtCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemLayerCount,
    selectedItemFadCount
  } = useSelectedItem()
  const { selectedItem, create, del } = useMutations()

  const commandSimplifier = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
      return `CTRL_${e.key.toUpperCase()}`
    }
    if (e.ctrlKey && e.shiftKey && !e.altKey) {
      return `CTRL_SHIFT_${e.key.toUpperCase()}`
    }
    if (e.ctrlKey && e.shiftKey && e.altKey) {
      return `CTRL_SHIFT_ALT_${e.key.toUpperCase()}`
    }
    if (!e.ctrlKey && e.shiftKey && !e.altKey) {
      return `SHIFT_${e.key.toUpperCase()}`
    }
    if (!e.ctrlKey && e.shiftKey && e.altKey) {
      return `SHIFT_ALT_${e.key.toUpperCase()}`
    }
    if (!e.ctrlKey && !e.shiftKey && e.altKey) {
      return `ALT_${e.key.toUpperCase()}`
    }
    return e.key.toUpperCase()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) {
        e.preventDefault()
        return
      }

      // FROM because we are using keydown, not keyup
      const keyDownTarget_FROM = e.target as HTMLElement
      const command = commandSimplifier(e)

      const isSelect = keyDownTarget_FROM?.tagName === 'SELECT'

      ////////////////////////////////
      // Find out if selectedInput is in Track Options
      const selectedInputIsInTrackOptions =
        keyDownTarget_FROM?.id.includes('_notes') ||
        keyDownTarget_FROM?.id.includes('_FR_') ||
        keyDownTarget_FROM?.id.includes('_AT_') ||
        keyDownTarget_FROM?.id.includes('_AL_') ||
        keyDownTarget_FROM?.id.includes('_FL_')

      // id will be like: T_1_FR_0_name
      const optionType = keyDownTarget_FROM?.id.split('_')[2] // FR, AT, AL, FL
      const optionNumber = keyDownTarget_FROM?.id.split('_')[3] // 0, 1, 2, 3
      const optionField = keyDownTarget_FROM?.id.split('_')?.slice(4).join('_') // name, value, notes, code_type

      ////////////////////////////////
      // Special case for Articulations
      const isArtTog = (selectedSubItemId: string) => {
        const art = selectedItem?.art_list_tog?.find(
          (art) => art.id === selectedSubItemId
        )
        if (art) return true
      }
      ////////////////////////////////
      // NAVIGATE TRACKS or ARTS or LAYERS or FADS
      if (command === 'ARROWUP') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') - 1

          let newInput = `${selectedItemId}_${optionType}_${nextNumber}_${optionField}`

          if (optionType === 'FR' && nextNumber < 0) {
            return
          }
          if (optionType === 'AT' && nextNumber < 0) {
            newInput = `${selectedItemId}_FR_${selectedItemRangeCount - 1}_${optionField}`
          }
          if (optionType === 'AL' && nextNumber < 0) {
            newInput = `${selectedItemId}_AT_${selectedItemArtCount - 1}_${optionField}`
          }
          if (optionType === 'FL' && nextNumber < 0) {
            newInput = `${selectedItemId}_AL_${selectedItemLayerCount - 1}_${optionField}`
          }

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (previousItemId === '') return

        const newInput = keyDownTarget_FROM?.id.replace(
          selectedItemId ?? '',
          previousItemId ?? ''
        )
        const previousInput = window.document.getElementById(newInput ?? '')

        keyDownTarget_FROM?.blur()
        previousInput?.focus()
        setSelectedItemId(previousItemId ?? '')
        setSelectedSubItemId(`${previousItemId}_notes`)
      }
      if (command === 'ARROWDOWN') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') + 1

          let newInput = `${selectedItemId}_${optionType}_${nextNumber}_${optionField}`

          if (optionType === 'FR' && nextNumber > selectedItemRangeCount - 1) {
            newInput = `${selectedItemId}_AT_0_name` // no like option-fields besides name for FR
          }
          if (optionType === 'AT' && nextNumber > selectedItemArtCount - 1) {
            newInput = `${selectedItemId}_AL_0_${optionField}`
          }
          if (optionType === 'AL' && nextNumber > selectedItemLayerCount - 1) {
            newInput = `${selectedItemId}_FL_0_${optionField}`
          }
          if (optionType === 'FL' && nextNumber > selectedItemFadCount - 1) {
            return
          }

          const nextInput = window.document.getElementById(newInput)

          nextInput?.focus()
          return
        }

        if (nextItemId === '') return

        const newInput = keyDownTarget_FROM?.id.replace(
          selectedItemId ?? '',
          nextItemId ?? ''
        )
        const nextInput = window.document.getElementById(newInput ?? '')

        nextInput?.focus()
        setSelectedItemId(nextItemId ?? '')
        setSelectedSubItemId(`${nextItemId}_notes`)
      }
      if (command === 'SHIFT_ARROWUP') {
        if (!keyDownTarget_FROM?.id.includes('_FR_0')) return
        e.preventDefault()
        const nextInput = window.document.getElementById(
          `${selectedItemId}_notes`
        )
        setSelectedSubItemId(selectedItemId + '_notes')
        nextInput?.focus()
      }
      if (command === 'SHIFT_ARROWDOWN') {
        if (!keyDownTarget_FROM?.id.includes('_notes')) return
        e.preventDefault()

        const nextInput = window.document.getElementById(
          `${selectedItemId}_FR_0_name`
        )
        setSelectedSubItemId(`${selectedItemId}_FR_0`)
        nextInput?.focus()
      }
      ////////////////////////////////
      // NAVIGATE BETWEEN TRACKLIST AND TRACK OPTIONS
      if (command === 'ARROWLEFT' || command === 'ARROWRIGHT') {
        if (isSelect) e.preventDefault()
      }
      if (command === 'CTRL_ARROWRIGHT') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        if (selectedInputIsInTrackOptions) return

        e.preventDefault()
        const trackOptionsNameInput = window.document.getElementById(
          `${selectedItemId}_notes`
        )
        setSelectedSubItemId(`${selectedItemId}_notes`)
        trackOptionsNameInput?.focus()
      }
      if (command === 'CTRL_ARROWLEFT') {
        if (
          !keyDownTarget_FROM?.id.includes('notes') &&
          !selectedInputIsInTrackOptions
        )
          return

        e.preventDefault()
        const trackListNameInput = window.document.getElementById(
          `${selectedItemId}_name`
        )
        trackListNameInput?.focus()
      }
      ////////////////////////////////
      // ADD NEW TRACK or ART or LAYER or FAD
      if (command === 'CTRL_SHIFT_ARROWUP') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Add new item above')
        //create.track()
      }
      if (command === 'CTRL_SHIFT_ARROWDOWN') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Add new item below')
        create.track({ count: 1 })
      }
      ////////////////////////////////
      // DUPLICATE TRACK or ART or LAYER or FAD
      if (command === 'CTRL_SHIFT_ALT_ARROWUP') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Duplicate selected item above')
      }
      if (command === 'CTRL_SHIFT_ALT_ARROWDOWN') {
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Duplicate selected item below')
      }
      ////////////////////////////////
      // DELETE TRACK or ART or LAYER or FAD
      if (command === 'CTRL_DELETE') {
        e.preventDefault()
        if (selectedInputIsInTrackOptions) {
          switch (optionType) {
            case 'FR':
              del.fullRange({
                rangeId: optionNumber ?? '',
                fileitems_item_id: selectedItemId ?? ''
              })
              break
            case 'AT':
              if (isArtTog(selectedSubItemId)) {
                del.artListTog({
                  artId: selectedSubItemId,
                  fileitems_item_id: selectedItemId ?? ''
                })
              }
              if (!isArtTog(selectedSubItemId)) {
                del.artListTap({
                  artId: selectedSubItemId,
                  fileitems_item_id: selectedItemId ?? ''
                })
              }
              break
            case 'AL':
              del.artLayer({
                layerId: optionNumber ?? '',
                fileitems_item_id: selectedItemId ?? ''
              })
              break
            case 'FL':
              del.fadList({
                fadId: optionNumber ?? '',
                fileitems_item_id: selectedItemId ?? ''
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      selectedItemId,
      setSelectedItemId,
      copiedItemId,
      copiedSubItemId,
      selectedSubItemId,
      setCopiedItemId,
      setCopiedSubItemId,
      nextItemId,
      setNextItemId,
      previousItemId,
      setPreviousItemId,
      setSelectedSubItemId,
      selectedItemRangeCount,
      selectedItemArtCount,
      selectedItemArtTogCount,
      selectedItemArtTapCount,
      selectedItemLayerCount,
      selectedItemFadCount
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return <KeyboardContext.Provider value>{children}</KeyboardContext.Provider>
}

export const useKeyboard = () => {
  return useContext(KeyboardContext)
}
