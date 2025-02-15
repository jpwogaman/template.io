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
import { option } from 'motion/react-m'
import { FullTrackCounts } from '../backendCommands/backendCommands'

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

      const allOptionsFullRanges = [
        //'id', //not selectable
        'name',
        'low',
        'high',
        'white_keys_only'
      ]
      const allOptionsArtListTog = [
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
      const allOptionsArtListTap = [
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
      const allOptionsArtLayers = [
        //'id', //not selectable
        'name',
        'code_type',
        'code',
        'on',
        'off',
        'default',
        'change_type'
      ]

      const allOptionsFadList = [
        //'id', //not selectable
        'name',
        'code_type',
        'code',
        'default',
        'change_type'
      ]

      const getNextOptionField = (currentField: string, list: string[]) => {
        const currentIndex = list.indexOf(currentField)
        return list[currentIndex + 1]
      }
      const getPreviousOptionField = (currentField: string, list: string[]) => {
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
            if (
              track_options_layouts.full_ranges === 'card' &&
              optionField !== allOptionsFullRanges[0]
            ) {
              const previousOptionField = getPreviousOptionField(
                optionField,
                allOptionsFullRanges
              )
              newInput = `${selected_item_id}_FR_${optionNumber}_${previousOptionField}`
            } else if (
              track_options_layouts.full_ranges === 'card' &&
              optionField === allOptionsFullRanges[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_FR_${previousSubItemNumber}_white_keys_only`
            } else if (
              track_options_layouts.full_ranges === 'card' &&
              optionField === allOptionsFullRanges[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_notes`
            } else if (
              track_options_layouts.full_ranges === 'table' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_notes`
            } else if (
              track_options_layouts.full_ranges === 'table' &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_FR_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AT' && isArtTog(selected_sub_item_id)) {
            if (
              track_options_layouts.art_list_tog === 'card' &&
              optionField !== allOptionsArtListTog[0]
            ) {
              const previousOptionField = getPreviousOptionField(
                optionField,
                allOptionsArtListTog
              )
              newInput = `${selected_item_id}_AT_${optionNumber}_${previousOptionField}`
            } else if (
              track_options_layouts.art_list_tog === 'card' &&
              optionField === allOptionsArtListTog[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_art_layers`
            } else if (
              track_options_layouts.art_list_tog === 'card' &&
              track_options_layouts.full_ranges === 'table' &&
              optionField === allOptionsArtListTog[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_name`
            } else if (
              track_options_layouts.art_list_tog === 'table' &&
              track_options_layouts.full_ranges === 'table' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_${optionField}`
            } else if (
              track_options_layouts.art_list_tog === 'card' &&
              track_options_layouts.full_ranges === 'card' &&
              optionField === allOptionsArtListTog[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_white_keys_only`
            } else if (
              track_options_layouts.art_list_tog === 'table' &&
              track_options_layouts.full_ranges === 'card' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_white_keys_only`
            } else if (
              track_options_layouts.art_list_tog === 'table' &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AT' && !isArtTog(selected_sub_item_id)) {
            if (
              track_options_layouts.art_list_tap === 'card' &&
              optionField !== allOptionsArtListTap[0]
            ) {
              const previousOptionField = getPreviousOptionField(
                optionField,
                allOptionsArtListTap
              )
              newInput = `${selected_item_id}_AT_${optionNumber}_${previousOptionField}`
            } else if (
              track_options_layouts.art_list_tap === 'card' &&
              optionField === allOptionsArtListTap[0] &&
              previousSubItemNumber >= selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_art_layers`
            } else if (
              track_options_layouts.art_list_tap === 'card' &&
              track_options_layouts.art_list_tog === 'table' &&
              optionField === allOptionsArtListTap[0] &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_name`
            } else if (
              track_options_layouts.art_list_tap === 'table' &&
              track_options_layouts.art_list_tog === 'table' &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_${optionField}`
            } else if (
              track_options_layouts.art_list_tap === 'card' &&
              track_options_layouts.art_list_tog === 'card' &&
              optionField === allOptionsArtListTap[0] &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_art_layers`
            } else if (
              track_options_layouts.art_list_tap === 'table' &&
              track_options_layouts.art_list_tog === 'card' &&
              previousSubItemNumber < selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_art_layers`
            } else if (
              track_options_layouts.art_list_tap === 'table' &&
              previousSubItemNumber >= selectedItemArtTogCount
            ) {
              newInput = `${selected_item_id}_AT_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'AL') {
            if (
              track_options_layouts.art_layers === 'card' &&
              optionField !== allOptionsArtLayers[0]
            ) {
              const previousOptionField = getPreviousOptionField(
                optionField,
                allOptionsArtLayers
              )
              newInput = `${selected_item_id}_AL_${optionNumber}_${previousOptionField}`
            } else if (
              track_options_layouts.art_layers === 'card' &&
              optionField === allOptionsArtLayers[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_AL_${previousSubItemNumber}_change_type`
            } else if (
              track_options_layouts.art_layers === 'card' &&
              track_options_layouts.art_list_tap === 'table' &&
              optionField === allOptionsArtLayers[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_name`
            } else if (
              track_options_layouts.art_layers === 'table' &&
              track_options_layouts.art_list_tap === 'table' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_${optionField}`
            } else if (
              track_options_layouts.art_layers === 'card' &&
              track_options_layouts.art_list_tap === 'card' &&
              optionField === allOptionsArtLayers[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_art_layers`
            } else if (
              track_options_layouts.art_layers === 'table' &&
              track_options_layouts.art_list_tap === 'card' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_art_layers`
            } else if (
              track_options_layouts.art_layers === 'table' &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_AL_${previousSubItemNumber}_${optionField}`
            } else {
              return
            }
          }
          if (optionType === 'FL') {
            if (
              track_options_layouts.fad_list === 'card' &&
              optionField !== allOptionsFadList[0]
            ) {
              const previousOptionField = getPreviousOptionField(
                optionField,
                allOptionsFadList
              )
              newInput = `${selected_item_id}_FL_${optionNumber}_${previousOptionField}`
            } else if (
              track_options_layouts.fad_list === 'card' &&
              optionField === allOptionsFadList[0] &&
              previousSubItemNumber >= 0
            ) {
              newInput = `${selected_item_id}_FL_${previousSubItemNumber}_change_type`
            } else if (
              track_options_layouts.fad_list === 'card' &&
              track_options_layouts.art_layers === 'table' &&
              optionField === allOptionsFadList[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_name`
            } else if (
              track_options_layouts.fad_list === 'table' &&
              track_options_layouts.art_layers === 'table' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_${optionField}`
            } else if (
              track_options_layouts.fad_list === 'card' &&
              track_options_layouts.art_layers === 'card' &&
              optionField === allOptionsFadList[0] &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_change_type`
            } else if (
              track_options_layouts.fad_list === 'table' &&
              track_options_layouts.art_layers === 'card' &&
              previousSubItemNumber < 0
            ) {
              newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_change_type`
            } else if (
              track_options_layouts.fad_list === 'table' &&
              previousSubItemNumber >= 0
            ) {
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
            if (
              track_options_layouts.full_ranges === 'card' &&
              optionField !==
                allOptionsFullRanges[allOptionsFullRanges.length - 1]
            ) {
              const nextOptionField = getNextOptionField(
                optionField,
                allOptionsFullRanges
              )
              newInput = `${selected_item_id}_FR_${optionNumber}_${nextOptionField}`
            } else if (
              track_options_layouts.full_ranges === 'card' &&
              optionField ===
                allOptionsFullRanges[allOptionsFullRanges.length - 1] &&
              nextSubItemNumber < selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_FR_${nextSubItemNumber}_name`
            } else if (
              track_options_layouts.full_ranges === 'card' &&
              optionField ===
                allOptionsFullRanges[allOptionsFullRanges.length - 1] &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_name`
            } else if (
              track_options_layouts.full_ranges === 'table' &&
              nextSubItemNumber < selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_FR_${nextSubItemNumber}_${optionField}`
            } else if (
              track_options_layouts.full_ranges === 'table' &&
              nextSubItemNumber >= selectedItemRangeCount
            ) {
              newInput = `${selected_item_id}_AT_0_name`
            }
          }
          //if (optionType === 'AT' && isArtTog(selected_sub_item_id)) {
          //  if (
          //    track_options_layouts.art_list_tog === 'card' &&
          //    optionField !==
          //      allOptionsArtListTog[allOptionsArtListTog.length - 1]
          //  ) {
          //    const nextOptionField = getNextOptionField(
          //      optionField,
          //      allOptionsArtListTog
          //    )
          //    newInput = `${selected_item_id}_AT_${optionNumber}_${nextOptionField}`
          //  } else if (
          //    track_options_layouts.art_list_tog === 'card' &&
          //    optionField ===
          //      allOptionsArtListTog[allOptionsArtListTog.length - 1] &&
          //    nextSubItemNumber >= 0
          //  ) {
          //    newInput = `${selected_item_id}_AT_${nextSubItemNumber}_art_layers`
          //  } else if (
          //    track_options_layouts.art_list_tog === 'card' &&
          //    track_options_layouts.full_ranges === 'table' &&
          //    optionField ===
          //      allOptionsArtListTog[allOptionsArtListTog.length - 1] &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_name`
          //  } else if (
          //    track_options_layouts.art_list_tog === 'table' &&
          //    track_options_layouts.full_ranges === 'table' &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_${optionField}`
          //  } else if (
          //    track_options_layouts.art_list_tog === 'card' &&
          //    track_options_layouts.full_ranges === 'card' &&
          //    optionField ===
          //      allOptionsArtListTog[allOptionsArtListTog.length - 1] &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_white_keys_only`
          //  } else if (
          //    track_options_layouts.art_list_tog === 'table' &&
          //    track_options_layouts.full_ranges === 'card' &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_FR_${selectedItemRangeCount - 1}_white_keys_only`
          //  } else if (
          //    track_options_layouts.art_list_tog === 'table' &&
          //    nextSubItemNumber >= 0
          //  ) {
          //    newInput = `${selected_item_id}_AT_${nextSubItemNumber}_${optionField}`
          //  } else {
          //    return
          //  }
          //}
          //if (optionType === 'AT' && !isArtTog(selected_sub_item_id)) {
          //  if (
          //    track_options_layouts.art_list_tap === 'card' &&
          //    optionField !==
          //      allOptionsArtListTap[allOptionsArtListTap.length - 1]
          //  ) {
          //    const nextOptionField = getNextOptionField(
          //      optionField,
          //      allOptionsArtListTap
          //    )
          //    newInput = `${selected_item_id}_AT_${optionNumber}_${nextOptionField}`
          //  } else if (
          //    track_options_layouts.art_list_tap === 'card' &&
          //    optionField ===
          //      allOptionsArtListTap[allOptionsArtListTap.length - 1] &&
          //    nextSubItemNumber >= selectedItemArtTogCount
          //  ) {
          //    newInput = `${selected_item_id}_AT_${nextSubItemNumber}_art_layers`
          //  } else if (
          //    track_options_layouts.art_list_tap === 'card' &&
          //    track_options_layouts.art_list_tog === 'table' &&
          //    optionField ===
          //      allOptionsArtListTap[allOptionsArtListTap.length - 1] &&
          //    nextSubItemNumber < selectedItemArtTogCount
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_name`
          //  } else if (
          //    track_options_layouts.art_list_tap === 'table' &&
          //    track_options_layouts.art_list_tog === 'table' &&
          //    nextSubItemNumber < selectedItemArtTogCount
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_${optionField}`
          //  } else if (
          //    track_options_layouts.art_list_tap === 'card' &&
          //    track_options_layouts.art_list_tog === 'card' &&
          //    optionField ===
          //      allOptionsArtListTap[allOptionsArtListTap.length - 1] &&
          //    nextSubItemNumber < selectedItemArtTogCount
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_art_layers`
          //  } else if (
          //    track_options_layouts.art_list_tap === 'table' &&
          //    track_options_layouts.art_list_tog === 'card' &&
          //    nextSubItemNumber < selectedItemArtTogCount
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtTogCount - 1}_art_layers`
          //  } else if (
          //    track_options_layouts.art_list_tap === 'table' &&
          //    nextSubItemNumber >= selectedItemArtTogCount
          //  ) {
          //    newInput = `${selected_item_id}_AT_${nextSubItemNumber}_${optionField}`
          //  } else {
          //    return
          //  }
          //}
          //if (optionType === 'AL') {
          //  if (
          //    track_options_layouts.art_layers === 'card' &&
          //    optionField !==
          //      allOptionsArtLayers[allOptionsArtLayers.length - 1]
          //  ) {
          //    const nextOptionField = getNextOptionField(
          //      optionField,
          //      allOptionsArtLayers
          //    )
          //    newInput = `${selected_item_id}_AL_${optionNumber}_${nextOptionField}`
          //  } else if (
          //    track_options_layouts.art_layers === 'card' &&
          //    optionField ===
          //      allOptionsArtLayers[allOptionsArtLayers.length - 1] &&
          //    nextSubItemNumber >= 0
          //  ) {
          //    newInput = `${selected_item_id}_AL_${nextSubItemNumber}_change_type`
          //  } else if (
          //    track_options_layouts.art_layers === 'card' &&
          //    track_options_layouts.art_list_tap === 'table' &&
          //    optionField ===
          //      allOptionsArtLayers[allOptionsArtLayers.length - 1] &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_name`
          //  } else if (
          //    track_options_layouts.art_layers === 'table' &&
          //    track_options_layouts.art_list_tap === 'table' &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_${optionField}`
          //  } else if (
          //    track_options_layouts.art_layers === 'card' &&
          //    track_options_layouts.art_list_tap === 'card' &&
          //    optionField ===
          //      allOptionsArtLayers[allOptionsArtLayers.length - 1] &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_art_layers`
          //  } else if (
          //    track_options_layouts.art_layers === 'table' &&
          //    track_options_layouts.art_list_tap === 'card' &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AT_${selectedItemArtCount - 1}_art_layers`
          //  } else if (
          //    track_options_layouts.art_layers === 'table' &&
          //    nextSubItemNumber >= 0
          //  ) {
          //    newInput = `${selected_item_id}_AL_${nextSubItemNumber}_${optionField}`
          //  } else {
          //    return
          //  }
          //}
          //if (optionType === 'FL') {
          //  if (
          //    track_options_layouts.fad_list === 'card' &&
          //    optionField !== allOptionsFadList[allOptionsFadList.length - 1]
          //  ) {
          //    const nextOptionField = getNextOptionField(
          //      optionField,
          //      allOptionsFadList
          //    )
          //    newInput = `${selected_item_id}_FL_${optionNumber}_${nextOptionField}`
          //  } else if (
          //    track_options_layouts.fad_list === 'card' &&
          //    optionField === allOptionsFadList[allOptionsFadList.length - 1] &&
          //    nextSubItemNumber >= 0
          //  ) {
          //    newInput = `${selected_item_id}_FL_${nextSubItemNumber}_change_type`
          //  } else if (
          //    track_options_layouts.fad_list === 'card' &&
          //    track_options_layouts.art_layers === 'table' &&
          //    optionField === allOptionsFadList[allOptionsFadList.length - 1] &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_name`
          //  } else if (
          //    track_options_layouts.fad_list === 'table' &&
          //    track_options_layouts.art_layers === 'table' &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_${optionField}`
          //  } else if (
          //    track_options_layouts.fad_list === 'card' &&
          //    track_options_layouts.art_layers === 'card' &&
          //    optionField === allOptionsFadList[allOptionsFadList.length - 1] &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_change_type`
          //  } else if (
          //    track_options_layouts.fad_list === 'table' &&
          //    track_options_layouts.art_layers === 'card' &&
          //    nextSubItemNumber < 0
          //  ) {
          //    newInput = `${selected_item_id}_AL_${selectedItemLayerCount - 1}_change_type`
          //  } else if (
          //    track_options_layouts.fad_list === 'table' &&
          //    nextSubItemNumber >= 0
          //  ) {
          //    newInput = `${selected_item_id}_FL_${nextSubItemNumber}_${optionField}`
          //  } else {
          //    return
          //  }
          //}

          if (optionType === 'AT') {
            if (
              track_options_layouts.art_list_tog === 'card' &&
              isArtTog(selected_sub_item_id)
            ) {
              const nextOptionField = getNextOptionField(
                optionField,
                allOptionsArtListTog
              )
              newInput = `${selected_item_id}_AT_${optionNumber}_${nextOptionField}`
            } else if (
              track_options_layouts.art_list_tap === 'card' &&
              !isArtTog(selected_sub_item_id)
            ) {
              const nextOptionField = getNextOptionField(
                optionField,
                allOptionsArtListTap
              )
              newInput = `${selected_item_id}_AT_${optionNumber}_${nextOptionField}`
            } else if (
              track_options_layouts.art_list_tog === 'table' &&
              nextSubItemNumber > selectedItemArtCount - 1
            ) {
              newInput = `${selected_item_id}_AL_0_${optionField}`
            }
          }
          if (optionType === 'AL') {
            if (track_options_layouts.art_layers === 'card') {
              const nextOptionField = getNextOptionField(
                optionField,
                allOptionsArtLayers
              )
              newInput = `${selected_item_id}_AL_${optionNumber}_${nextOptionField}`
            } else if (
              track_options_layouts.art_layers === 'table' &&
              nextSubItemNumber > selectedItemLayerCount - 1
            ) {
              newInput = `${selected_item_id}_FL_0_${optionField}`
            }
          }
          if (optionType === 'FL') {
            if (track_options_layouts.fad_list === 'card') {
              const nextOptionField = getNextOptionField(
                optionField,
                allOptionsFadList
              )
              newInput = `${selected_item_id}_FL_${optionNumber}_${nextOptionField}`
            } else if (
              track_options_layouts.fad_list === 'table' &&
              nextSubItemNumber > selectedItemFadCount - 1
            ) {
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
