'use client'

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type FC,
  useCallback,
  use
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

  const handleKeys = useCallback(
    (e: KeyboardEvent) => {
      const selectedInput = window.document.activeElement as HTMLInputElement
      const command = commandSimplifier(e)
      //const isButton = selectedInput?.tagName === 'BUTTON'
      const isSelect = selectedInput?.tagName === 'SELECT'

      ////////////////////////////////
      // Find out if selectedInput is in Track Options
      const selectedInputIsInTrackOptions =
        selectedInput?.id.includes('_FR_') ||
        selectedInput?.id.includes('_AT_') ||
        selectedInput?.id.includes('_AL_') ||
        selectedInput?.id.includes('_FL_')

      // id will be like: T_1_FR_0_name
      const optionType = selectedInput?.id.split('_')[2] // FR, AT, AL, FL
      const optionNumber = selectedInput?.id.split('_')[3] // 0, 1, 2, 3
      const optionField = selectedInput?.id.split('_')[4] // name, value, notes

      ////////////////////////////////
      // Special case for Articulations
      const artId = selectedItemId + '_AT_' + optionNumber
      const isArtTog = (artId: string) => {
        const art = selectedItem?.art_list_tog?.find((art) => art.id === artId)
        if (art) return true
      }

      ////////////////////////////////
      // NAVIGATE TRACKS or ARTS or LAYERS or FADS
      if (command === 'ARROWUP') {
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
              selectedItemId +
              '_FR_' +
              (selectedItemRangeCount - 1) +
              '_' +
              optionField
            previousSubItemId =
              selectedItemId + '_FR_' + (selectedItemRangeCount - 1)
          }
          if (optionType === 'AL' && nextNumber < 0) {
            newInput =
              selectedItemId +
              '_AT_' +
              (selectedItemArtCount - 1) +
              '_' +
              optionField
            previousSubItemId =
              selectedItemId + '_AT_' + (selectedItemArtCount - 1)
          }
          if (optionType === 'FL' && nextNumber < 0) {
            newInput =
              selectedItemId +
              '_AL_' +
              (selectedItemLayerCount - 1) +
              '_' +
              optionField
            previousSubItemId =
              selectedItemId + '_AL_' + (selectedItemLayerCount - 1)
          }

          setSelectedSubItemId(previousSubItemId)

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (previousItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          previousItemId ?? ''
        )
        const previousInput = window.document.getElementById(newInput ?? '')

        selectedInput?.blur()
        previousInput?.focus()
        setSelectedItemId(previousItemId ?? '')
        setSelectedSubItemId(previousItemId + '_notes')
      }
      if (command === 'ARROWDOWN') {
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

          if (optionType === 'FR' && nextNumber > selectedItemRangeCount - 1) {
            newInput = selectedItemId + '_AT_0_' + optionField
            nextSubItemId = selectedItemId + '_AT_0'
          }
          if (optionType === 'AT' && nextNumber > selectedItemArtCount - 1) {
            newInput = selectedItemId + '_AL_0_' + optionField
            nextSubItemId = selectedItemId + '_AL_0'
          }
          if (optionType === 'AL' && nextNumber > selectedItemLayerCount - 1) {
            newInput = selectedItemId + '_FL_0_' + optionField
            nextSubItemId = selectedItemId + '_FL_0'
          }
          if (optionType === 'FL' && nextNumber > selectedItemFadCount - 1) {
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
          nextItemId ?? ''
        )
        const nextInput = window.document.getElementById(newInput ?? '')

        nextInput?.focus()
        setSelectedItemId(nextItemId ?? '')
        setSelectedSubItemId(nextItemId + '_notes')
      }
      if (command === 'SHIFT_ARROWUP') {
        if (!selectedInput?.id.includes('_FR_0')) return
        e.preventDefault()
        const nextInput = window.document.getElementById(
          selectedItemId + '_notes'
        )
        setSelectedSubItemId(selectedItemId + '_notes')
        nextInput?.focus()
      }
      if (command === 'SHIFT_ARROWDOWN') {
        if (!selectedInput?.id.includes('_notes')) return
        e.preventDefault()

        const nextInput = window.document.getElementById(
          selectedItemId + '_FR_0_name'
        )
        setSelectedSubItemId(selectedItemId + '_FR_0')
        nextInput?.focus()
      }
      ////////////////////////////////
      // NAVIGATE BETWEEN TRACKLIST AND TRACK OPTIONS
      if (command === 'ARROWLEFT' || command === 'ARROWRIGHT') {
        if (isSelect) e.preventDefault()
      }
      if (command === 'CTRL_ARROWRIGHT') {
        if (selectedInput?.id.includes('notes')) return
        if (selectedInputIsInTrackOptions) return

        e.preventDefault()
        const trackOptionsNameInput = window.document.getElementById(
          selectedItemId + '_notes'
        )
        setSelectedSubItemId(selectedItemId + '_notes')
        trackOptionsNameInput?.focus()
      }
      if (command === 'CTRL_ARROWLEFT') {
        if (
          !selectedInput?.id.includes('notes') &&
          !selectedInputIsInTrackOptions
        )
          return

        e.preventDefault()
        const trackListNameInput = window.document.getElementById(
          selectedItemId + '_name'
        )
        trackListNameInput?.focus()
      }
      ////////////////////////////////
      // ADD NEW TRACK or ART or LAYER or FAD
      if (command === 'CTRL_SHIFT_ARROWUP') {
        if (selectedInput?.id.includes('notes')) return
        e.preventDefault()
        alert('Add new item above')
        //create.track()
      }
      if (command === 'CTRL_SHIFT_ARROWDOWN') {
        if (selectedInput?.id.includes('notes')) return
        e.preventDefault()
        alert('Add new item below')
        create.track({ count: 1 })
      }
      ////////////////////////////////
      // DUPLICATE TRACK or ART or LAYER or FAD
      if (command === 'CTRL_SHIFT_ALT_ARROWUP') {
        if (selectedInput?.id.includes('notes')) return
        e.preventDefault()
        alert('Duplicate selected item above')
      }
      if (command === 'CTRL_SHIFT_ALT_ARROWDOWN') {
        if (selectedInput?.id.includes('notes')) return
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
              if (isArtTog(artId ?? '')) {
                del.artListTog({
                  artId: artId ?? '',
                  fileitems_item_id: selectedItemId ?? ''
                })
              }
              if (!isArtTog(artId ?? '')) {
                del.artListTap({
                  artId: artId ?? '',
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
    [selectedItemId, previousItemId, nextItemId]
  )
  useEffect(() => {
    window.addEventListener('keydown', handleKeys)
    return () => {
      window.removeEventListener('keydown', handleKeys)
    }
  }, [handleKeys])

  return <KeyboardContext.Provider value>{children}</KeyboardContext.Provider>
}

export const useKeyboard = () => {
  return useContext(KeyboardContext)
}
