'use client'

import {
  type ReactNode,
  type FC,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo
} from 'react'
import { useMutations, useSelectedItem } from '@/components/context'

const keyboardContextDefaultValues: Record<string, unknown> = {}

export const KeyboardContext = createContext<Record<string, unknown>>(
  keyboardContextDefaultValues
)

interface KeyboardProviderProps {
  children: ReactNode
}

export const KeyboardProvider: FC<KeyboardProviderProps> = ({ children }) => {
  const { selectedItemSubItemCounts, settings, updateSettings } =
    useSelectedItem()

  const {
    art_layers: selectedItemLayerCount,
    art_list_both: selectedItemArtCount,
    art_list_tog: selectedItemArtTapCount,
    art_list_tap: selectedItemArtTogCount,
    fad_list: selectedItemFadCount,
    full_ranges: selectedItemRangeCount
  } = selectedItemSubItemCounts
  const {
    selected_item_id,
    next_item_id,
    previous_item_id,
    selected_sub_item_id,
    track_options_layouts
  } = settings

  const { selectedItem, previousItemLocked, nextItemLocked, del } =
    useMutations()

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

      const allKeysFR = [
        //'id', //not selectable
        'name',
        'low',
        'high',
        'white_keys_only'
      ]

      const allKeysATog = [
        //'id', //not selectable
        'name',
        //'toggle', //not selectable or visible
        'code_type',
        'code',
        'on',
        'off',
        'default',
        'delay',
        'change_type',
        'ranges',
        'art_layers'
      ]
      const allKeysATap = [
        //'id', //not selectable
        'name',
        //'toggle', //not selectable or visible
        'code_type',
        'code',
        'on',
        //'off', //not selectable or visible
        'default',
        'delay',
        'change_type',
        'ranges',
        'art_layers'
      ]
      const allKeysAL = [
        //'id', //not selectable
        'name',
        'code_type',
        'code',
        'on',
        'off',
        'default',
        'change_type'
      ]

      const allKeysFL = [
        //'id', //not selectable
        'name',
        'code_type',
        'code',
        'default',
        'change_type'
      ]

      const FRLayout = track_options_layouts.full_ranges
      const ATogLayout = track_options_layouts.art_list_tog
      const ATapLayout = track_options_layouts.art_list_tap
      const ALLayout = track_options_layouts.art_layers
      const FLLayout = track_options_layouts.fad_list

      const getNextKey = (currentField: string, list: string[]) => {
        const currentIndex = list.indexOf(currentField)
        return list[currentIndex + 1]
      }
      const getPreviousKey = (currentField: string, list: string[]) => {
        const currentIndex = list.indexOf(currentField)
        return list[currentIndex - 1]
      }

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
          const previousSubItemNumber = parseInt(optionNumber ?? '0') - 1

          let newInput = ''

          if (optionType === 'FR') {
            if (FRLayout === 'card' && optionField !== allKeysFR[0]) {
              const previousOptionField = getPreviousKey(optionField, allKeysFR)
              newInput = `${selected_item_id}_FR_${optionNumber}_${previousOptionField}`
            } else if (
              FRLayout === 'card' &&
              optionField === allKeysFR[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_FR_${previousSubItemNumber}_white_keys_only`
            } else if (
              FRLayout === 'card' &&
              optionField === allKeysFR[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_notes`
            } else if (FRLayout === 'table' && previousSubItemNumber < 0) {
              newInput = `${selected_item_id}_notes`
            } else if (FRLayout === 'table' && previousSubItemNumber >= 0) {
              newInput = `${selected_item_id}_FR_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AT' && isArtTog(selected_sub_item_id)) {
            if (ATogLayout === 'card' && optionField !== allKeysATog[0]) {
              const previousOptionField = getPreviousKey(
                optionField,
                allKeysATog
              )
              newInput = `${selected_item_id}_AT_${optionNumber}_${previousOptionField}`
            } else if (
              ATogLayout === 'card' &&
              optionField === allKeysATog[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_art_layers`
            } else if (
              ATogLayout === 'card' &&
              FRLayout === 'table' &&
              optionField === allKeysATog[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_name`
            } else if (
              ATogLayout === 'table' &&
              FRLayout === 'table' &&
              optionField === 'name' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_name`
            } else if (
              ATogLayout === 'table' &&
              FRLayout === 'table' &&
              (optionField === 'code_type' ||
                optionField === 'code' ||
                optionField === 'on' ||
                optionField === 'off') &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_low`
            } else if (
              ATogLayout === 'table' &&
              FRLayout === 'table' &&
              (optionField === 'default' ||
                optionField === 'delay' ||
                optionField === 'change_type' ||
                optionField === 'ranges' ||
                optionField === 'art_layers') &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_high`
            } else if (
              ATogLayout === 'card' &&
              FRLayout === 'card' &&
              optionField === allKeysATog[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_white_keys_only`
            } else if (
              ATogLayout === 'table' &&
              FRLayout === 'card' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_white_keys_only`
            } else if (ATogLayout === 'table' && previousSubItemNumber >= 0) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AT' && !isArtTog(selected_sub_item_id)) {
            if (ATapLayout === 'card' && optionField !== allKeysATap[0]) {
              const previousOptionField = getPreviousKey(
                optionField,
                allKeysATap
              )
              newInput = `${selected_item_id}_AT_${optionNumber}_${previousOptionField}`
            } else if (
              ATapLayout === 'card' &&
              optionField === allKeysATap[0] &&
              previousSubItemNumber >= selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_art_layers`
            } else if (
              ATapLayout === 'card' &&
              ATogLayout === 'table' &&
              optionField === allKeysATap[0] &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_name`
            } else if (
              ATapLayout === 'table' &&
              ATogLayout === 'table' &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_${optionField}`
            } else if (
              ATapLayout === 'card' &&
              ATogLayout === 'card' &&
              optionField === allKeysATap[0] &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_art_layers`
            } else if (
              ATapLayout === 'table' &&
              ATogLayout === 'card' &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_art_layers`
            } else if (
              ATapLayout === 'table' &&
              previousSubItemNumber >= selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AL') {
            if (ALLayout === 'card' && optionField !== allKeysAL[0]) {
              const previousOptionField = getPreviousKey(optionField, allKeysAL)
              newInput = `${selected_item_id}_AL_${optionNumber}_${previousOptionField}`
            } else if (
              ALLayout === 'card' &&
              optionField === allKeysAL[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_AL_${previousSubItemNumber}_change_type`
            } else if (
              ALLayout === 'card' &&
              ATapLayout === 'table' &&
              optionField === allKeysAL[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_name`
            } else if (
              ALLayout === 'table' &&
              ATapLayout === 'table' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_${optionField}`
            } else if (
              ALLayout === 'card' &&
              ATapLayout === 'card' &&
              optionField === allKeysAL[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_art_layers`
            } else if (
              ALLayout === 'table' &&
              ATapLayout === 'card' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_art_layers`
            } else if (ALLayout === 'table' && previousSubItemNumber >= 0) {
              newInput = `${selected_item_id}_AL_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'FL') {
            if (FLLayout === 'card' && optionField !== allKeysFL[0]) {
              const previousOptionField = getPreviousKey(optionField, allKeysFL)
              newInput = `${selected_item_id}_FL_${optionNumber}_${previousOptionField}`
            } else if (
              FLLayout === 'card' &&
              optionField === allKeysFL[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_FL_${previousSubItemNumber}_change_type`
            } else if (
              FLLayout === 'card' &&
              ALLayout === 'table' &&
              optionField === allKeysFL[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_name`
            } else if (
              FLLayout === 'table' &&
              ALLayout === 'table' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_${optionField}`
            } else if (
              FLLayout === 'card' &&
              ALLayout === 'card' &&
              optionField === allKeysFL[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_change_type`
            } else if (
              FLLayout === 'table' &&
              ALLayout === 'card' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_change_type`
            } else if (FLLayout === 'table' && previousSubItemNumber >= 0) {
              newInput = `${selected_item_id}_FL_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }

          const previousInput = window.document.getElementById(newInput)

          previousInput?.focus()
          return
        }

        if (!previous_item_id) return

        void updateSettings({
          key: 'selected_item_id',
          value: previous_item_id
        })
        void updateSettings({
          key: 'selected_sub_item_id',
          value: `${previous_item_id}_notes`
        })

        let newInput: string

        if (previousItemLocked) {
          newInput = `${previous_item_id}_locked`
        } else {
          newInput = keyDownTarget_FROM?.id.replace(
            selected_item_id,
            previous_item_id
          )
        }
        const previousInput = window.document.getElementById(newInput)
        previousInput?.focus()
      }
      if (command === 'ARROWDOWN') {
        if (e.repeat && !isTextArea) return
        if (keyDownTarget_FROM?.id.includes('notes')) return
        if (keyDownTarget_FROM?.id.includes('changeLayout')) return

        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextSubItemNumber = parseInt(optionNumber ?? '0') + 1

          let newInput = ''

          if (optionType === 'FR') {
            const lastOption = optionField === allKeysFR[allKeysFR.length - 1]

            if (FRLayout === 'card' && !lastOption) {
              newInput = `${selected_item_id}_FR_${optionNumber}_${getNextKey(optionField, allKeysFR)}`
            } else if (
              FRLayout === 'card' &&
              lastOption &&
              nextSubItemNumber < selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_FR_${nextSubItemNumber}_name`
            } else if (
              FRLayout === 'card' &&
              lastOption &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_name`
            } else if (
              FRLayout === 'table' &&
              nextSubItemNumber < selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_FR_${nextSubItemNumber}_${optionField}`
            } else if (
              FRLayout === 'table' &&
              optionField === 'low' &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_code_type`
            } else if (
              FRLayout === 'table' &&
              optionField === 'high' &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_default`
            } else if (
              FRLayout === 'table' &&
              optionField === 'white_keys_only' &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_ranges`
            } else if (
              FRLayout === 'table' &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_name`
            }
          }
          if (optionType === 'AT' && isArtTog(selected_sub_item_id)) {
            const lastOption =
              optionField === allKeysATog[allKeysATog.length - 1]

            if (ATogLayout === 'card' && !lastOption) {
              newInput = `${selected_item_id}_AT_${optionNumber}_${getNextKey(optionField, allKeysATog)}`
            } else if (
              ATogLayout === 'card' &&
              lastOption &&
              nextSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${nextSubItemNumber}_name`
            } else if (
              ATogLayout === 'card' &&
              lastOption &&
              nextSubItemNumber >= selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount}_name`
            } else if (
              ATogLayout === 'table' &&
              optionField === 'off' &&
              nextSubItemNumber >= selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${nextSubItemNumber}_on`
            } else if (
              ATogLayout === 'table' &&
              nextSubItemNumber < selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AT_${nextSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AT' && !isArtTog(selected_sub_item_id)) {
            const lastOption =
              optionField === allKeysATap[allKeysATap.length - 1]

            if (ATapLayout === 'card' && !lastOption) {
              newInput = `${selected_item_id}_AT_${optionNumber}_${getNextKey(optionField, allKeysATap)}`
            } else if (
              ATapLayout === 'card' &&
              lastOption &&
              nextSubItemNumber < selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AT_${nextSubItemNumber}_name`
            } else if (
              ATapLayout === 'card' &&
              lastOption &&
              nextSubItemNumber >= selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AL_0_name`
            } else if (
              ATapLayout === 'table' &&
              optionField === 'delay' &&
              nextSubItemNumber >= selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AL_0_default`
            } else if (
              ATapLayout === 'table' &&
              (optionField === 'ranges' || optionField === 'art_layers') &&
              nextSubItemNumber >= selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AL_0_change_type`
            } else if (
              ATapLayout === 'table' &&
              nextSubItemNumber < selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AT_${nextSubItemNumber}_${optionField}`
            } else if (
              ATapLayout === 'table' &&
              nextSubItemNumber >= selectedItemArtCount
            ) {
              newInput = `${selected_item_id}_AL_0_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AL') {
            const lastOption = optionField === allKeysAL[allKeysAL.length - 1]

            if (ALLayout === 'card' && !lastOption) {
              newInput = `${selected_item_id}_AL_${optionNumber}_${getNextKey(optionField, allKeysAL)}`
            } else if (
              ALLayout === 'card' &&
              lastOption &&
              nextSubItemNumber < selectedItemLayerCount
            ) {
              newInput = `${selected_item_id}_AL_${nextSubItemNumber}_name`
            } else if (
              ALLayout === 'card' &&
              lastOption &&
              nextSubItemNumber >= selectedItemLayerCount
            ) {
              newInput = `${selected_item_id}_FL_0_name`
            } else if (
              ALLayout === 'table' &&
              (optionField === 'on' || optionField === 'off') &&
              nextSubItemNumber >= selectedItemLayerCount
            ) {
              newInput = `${selected_item_id}_FL_0_code`
            } else if (
              ALLayout === 'table' &&
              nextSubItemNumber < selectedItemLayerCount
            ) {
              newInput = `${selected_item_id}_AL_${nextSubItemNumber}_${optionField}`
            } else if (
              ALLayout === 'table' &&
              nextSubItemNumber >= selectedItemLayerCount
            ) {
              newInput = `${selected_item_id}_FL_0_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'FL') {
            const lastOption = optionField === allKeysFL[allKeysFL.length - 1]

            if (FLLayout === 'card' && !lastOption) {
              newInput = `${selected_item_id}_FL_${optionNumber}_${getNextKey(optionField, allKeysFL)}`
            } else if (
              FLLayout === 'card' &&
              lastOption &&
              nextSubItemNumber < selectedItemFadCount
            ) {
              newInput = `${selected_item_id}_FL_${nextSubItemNumber}_name`
            } else if (
              FLLayout === 'table' &&
              nextSubItemNumber < selectedItemFadCount
            ) {
              newInput = `${selected_item_id}_FL_${nextSubItemNumber}_${optionField}`
            } else {
              return
            }
          }

          const nextInput = window.document.getElementById(newInput)

          nextInput?.focus()
          return
        }

        if (!next_item_id) return
        void updateSettings({
          key: 'selected_item_id',
          value: next_item_id
        })
        void updateSettings({
          key: 'selected_sub_item_id',
          value: `${next_item_id}_notes`
        })

        let newInput: string

        if (nextItemLocked) {
          newInput = `${next_item_id}_locked`
        } else {
          newInput = keyDownTarget_FROM?.id.replace(
            selected_item_id,
            next_item_id
          )
        }
        const nextInput = window.document.getElementById(newInput)
        nextInput?.focus()
      }
      if (command === 'SHIFT_ARROWUP') {
        if (e.repeat) return
        if (!keyDownTarget_FROM?.id.includes('_FR_0')) return
        e.preventDefault()

        void updateSettings({
          key: 'selected_sub_item_id',
          value: `${selected_item_id}_notes`
        })
        const nextInput = window.document.getElementById(
          `${selected_item_id}_notes`
        )
        nextInput?.focus()
      }
      if (command === 'SHIFT_ARROWDOWN') {
        if (e.repeat) return
        if (!keyDownTarget_FROM?.id.includes('_notes')) return
        e.preventDefault()

        void updateSettings({
          key: 'selected_sub_item_id',
          value: `${selected_item_id}_FR_0`
        })

        const nextInput = window.document.getElementById(
          `${selected_item_id}_FR_0_name`
        )
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

        void updateSettings({
          key: 'selected_sub_item_id',
          value: `${selected_item_id}_notes`
        })
        const trackOptionsNameInput = window.document.getElementById(
          `${selected_item_id}_notes`
        )
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
      commandSimplifier,
      del,
      selectedItem?.art_list_tog,
      previousItemLocked,
      nextItemLocked,
      selectedItemLayerCount,
      selectedItemArtCount,
      selectedItemArtTapCount,
      selectedItemArtTogCount,
      selectedItemFadCount,
      selectedItemRangeCount,
      updateSettings,
      selected_sub_item_id,
      track_options_layouts
    ]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const value: Record<string, unknown> = useMemo(() => ({}), [])

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  )
}

export const useKeyboard = () => {
  return useContext(KeyboardContext)
}
