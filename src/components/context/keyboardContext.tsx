'use client'

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
  type FC,
  useCallback
} from 'react'
import { useMutations, useSelectedItem } from '@/components/context'
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    selectedItemRangeCount,
    selectedItemArtCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    settings,
    updateSettings
  } = useSelectedItem()

  const {
    selected_item_id,
    next_item_id,
    previous_item_id,
    selected_sub_item_id
  } = settings

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
      // FROM because we are using keydown, not keyup
      const keyDownTarget_FROM = e.target as HTMLInputElement
      const command = commandSimplifier(e)

      const isSelect = keyDownTarget_FROM?.tagName === 'SELECT'
      const isTextArea = keyDownTarget_FROM?.tagName === 'TEXTAREA'
      const isInput = keyDownTarget_FROM?.type === 'text'

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
        if (e.repeat && !isTextArea) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        if (keyDownTarget_FROM?.id.includes('changeLayout')) return
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') - 1

          let newInput = `${selected_item_id}_${optionType}_${nextNumber}_${optionField}`

          if (optionType === 'FR' && nextNumber < 0) {
            return
          }
          if (optionType === 'AT' && nextNumber < 0) {
            newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_${optionField}`
          }
          if (optionType === 'AL' && nextNumber < 0) {
            newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_${optionField}`
          }
          if (optionType === 'FL' && nextNumber < 0) {
            newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_${optionField}`
          }

          const nextInput = window.document.getElementById(newInput)

          nextInput?.focus()
          return
        }

        if (!previous_item_id) return

        const newInput = keyDownTarget_FROM?.id.replace(
          selected_item_id,
          previous_item_id
        )
        const previousInput = window.document.getElementById(newInput)

        keyDownTarget_FROM?.blur()
        previousInput?.focus()
        updateSettings({
          key: 'selected_item_id',
          value: previous_item_id
        })
        updateSettings({
          key: 'selected_sub_item_id',
          value: `${previous_item_id}_notes`
        })
      }
      if (command === 'ARROWDOWN') {
        if (e.repeat && !isTextArea) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        if (keyDownTarget_FROM?.id.includes('changeLayout')) return

        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') + 1

          let newInput = `${selected_item_id}_${optionType}_${nextNumber}_${optionField}`

          if (optionType === 'FR' && nextNumber > selectedItemRangeCount - 1) {
            newInput = `${selected_item_id}_AT_0_name` // no like option-fields besides name for FR
          }
          if (optionType === 'AT' && nextNumber > selectedItemArtCount - 1) {
            newInput = `${selected_item_id}_AL_0_${optionField}`
          }
          if (optionType === 'AL' && nextNumber > selectedItemLayerCount - 1) {
            newInput = `${selected_item_id}_FL_0_${optionField}`
          }
          if (optionType === 'FL' && nextNumber > selectedItemFadCount - 1) {
            return
          }

          const nextInput = window.document.getElementById(newInput)

          nextInput?.focus()
          return
        }

        if (!next_item_id) return

        const newInput = keyDownTarget_FROM?.id.replace(
          selected_item_id,
          next_item_id
        )
        const nextInput = window.document.getElementById(newInput)

        nextInput?.focus()
        updateSettings({
          key: 'selected_item_id',
          value: next_item_id
        })
        updateSettings({
          key: 'selected_sub_item_id',
          value: `${next_item_id}_notes`
        })
      }
      if (command === 'SHIFT_ARROWUP') {
        if (e.repeat) return
        if (!keyDownTarget_FROM?.id.includes('_FR_0')) return
        e.preventDefault()
        const nextInput = window.document.getElementById(
          `${selected_item_id}_notes`
        )
        updateSettings({
          key: 'selected_sub_item_id',
          value: `${selected_item_id}_notes`
        })

        nextInput?.focus()
      }
      if (command === 'SHIFT_ARROWDOWN') {
        if (e.repeat) return
        if (!keyDownTarget_FROM?.id.includes('_notes')) return
        e.preventDefault()

        const nextInput = window.document.getElementById(
          `${selected_item_id}_FR_0_name`
        )
        updateSettings({
          key: 'selected_sub_item_id',
          value: `${selected_item_id}_FR_0`
        })

        nextInput?.focus()
      }
      ////////////////////////////////
      // NAVIGATE BETWEEN TRACKLIST AND TRACK OPTIONS
      if (command === 'ARROWLEFT' || command === 'ARROWRIGHT') {
        if (e.repeat && !(isTextArea || isInput)) return
        if (isSelect) e.preventDefault()
      }
      if (command === 'CTRL_ARROWRIGHT') {
        if (e.repeat) return
        if (selectedInputIsInTrackOptions) return
        e.preventDefault()
        const trackOptionsNameInput = window.document.getElementById(
          `${selected_item_id}_notes`
        )
        updateSettings({
          key: 'selected_sub_item_id',
          value: `${selected_item_id}_notes`
        })

        trackOptionsNameInput?.focus()
      }
      if (command === 'CTRL_ARROWLEFT') {
        if (e.repeat) return
        if (!selectedInputIsInTrackOptions) return

        e.preventDefault()
        const trackListNameInput = window.document.getElementById(
          `${selected_item_id}_name`
        )
        trackListNameInput?.focus()
      }
      ////////////////////////////////
      // ADD NEW TRACK or ART or LAYER or FAD
      if (command === 'CTRL_SHIFT_ARROWUP') {
        if (e.repeat) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Add new item above')
        //create.track()
      }
      if (command === 'CTRL_SHIFT_ARROWDOWN') {
        if (e.repeat) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Add new item below')
        //create.track()
      }
      ////////////////////////////////
      // DUPLICATE TRACK or ART or LAYER or FAD
      if (command === 'CTRL_SHIFT_ALT_ARROWUP') {
        if (e.repeat) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Duplicate selected item above')
      }
      if (command === 'CTRL_SHIFT_ALT_ARROWDOWN') {
        if (e.repeat) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        e.preventDefault()
        alert('Duplicate selected item below')
      }
      ////////////////////////////////
      // DELETE TRACK or ART or LAYER or FAD
      if (command === 'CTRL_DELETE') {
        if (e.repeat) return
        e.preventDefault()
        if (selectedInputIsInTrackOptions) {
          switch (optionType) {
            case 'FR':
              del.fullRange({
                id: selected_sub_item_id,
                fileitemsItemId: selected_item_id
              })
              break
            case 'AT':
              if (isArtTog(selected_sub_item_id)) {
                del.artListTog({
                  id: selected_sub_item_id,
                  fileitemsItemId: selected_item_id
                })
              }
              if (!isArtTog(selected_sub_item_id)) {
                del.artListTap({
                  id: selected_sub_item_id,
                  fileitemsItemId: selected_item_id
                })
              }
              break
            case 'AL':
              del.artLayer({
                id: selected_sub_item_id,
                fileitemsItemId: selected_item_id
              })
              break
            case 'FL':
              del.fadList({
                id: selected_sub_item_id,
                fileitemsItemId: selected_item_id
              })
              break
            default:
              break
          }
          return
        }
      }
      ////////////////////////////////
    },
    [
      selected_item_id,
      next_item_id,
      previous_item_id,
      selectedItemRangeCount,
      selectedItemArtCount,
      selectedItemLayerCount,
      selectedItemFadCount,
      commandSimplifier,
      create,
      del,
      selectedItem?.art_list_tog
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
