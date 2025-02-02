import { type ReactNode, type ChangeEvent, type FC } from 'react'
import {
  InputText,
  InputSelectSingle,
  InputSelectMultiple,
  InputCheckBox,
  InputCheckBoxSwitch,
  type selectArray
} from './index'

import { type TrackOptionsTableKeys } from '../utils/trackOptionsTableKeys'
import { type TrackListTableKeys } from '../utils/trackListTableKeys'
import tw from '@/components/utils/tw'
import { InputColorPicker } from './input-color-picker'
import { InputTextRich } from './input-text-rich'

import {
  type FullTrackForExport,
  type FullTrackCounts,
  type ItemsFullRanges,
  type ItemsArtLayers,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type FileItem
} from '../backendCommands/backendCommands'

import { type FileItemId, SubItemId } from '../context'

function safeGet<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  if (key in obj) {
    return obj[key]
  }
  return undefined as any
}
function isItemsFullRanges(obj: any): obj is ItemsFullRanges {
  return obj && obj.hasOwnProperty('id')
}
function isItemsArtListTog(obj: any): obj is ItemsArtListTog {
  return obj && obj.hasOwnProperty('id')
}
function isItemsArtListTap(obj: any): obj is ItemsArtListTap {
  return obj && obj.hasOwnProperty('id')
}
function isItemsArtLayers(obj: any): obj is ItemsArtLayers {
  return obj && obj.hasOwnProperty('id')
}
function isItemsFadList(obj: any): obj is ItemsFadList {
  return obj && obj.hasOwnProperty('id')
}

function getLayoutData<T extends keyof FullTrackCounts>(
  layoutDataSingle: layoutDataSingle,
  key: LayoutDataSingleHelper<T>
) {
  if (isItemsFullRanges(layoutDataSingle)) {
    return safeGet(layoutDataSingle, key as keyof ItemsFullRanges)
  } else if (isItemsArtListTog(layoutDataSingle)) {
    return safeGet(layoutDataSingle, key as keyof ItemsArtListTog)
  } else if (isItemsArtListTap(layoutDataSingle)) {
    return safeGet(layoutDataSingle, key as keyof ItemsArtListTap)
  } else if (isItemsArtLayers(layoutDataSingle)) {
    return safeGet(layoutDataSingle, key as keyof ItemsArtLayers)
  } else if (isItemsFadList(layoutDataSingle)) {
    return safeGet(layoutDataSingle, key as keyof ItemsFadList)
  }
}
type layoutDataSingle =
  | ItemsFullRanges
  | ItemsArtListTog
  | ItemsArtListTap
  | ItemsArtLayers
  | ItemsFadList

export type LayoutDataSingleHelper<T extends keyof FullTrackCounts> =
  T extends keyof FullTrackForExport
    ? FullTrackForExport[T] extends Array<infer U>
      ? keyof U
      : keyof FullTrackForExport[T]
    : never

export type layoutDataSingleKeys =
  | keyof ItemsFullRanges
  | keyof ItemsArtLayers
  | keyof ItemsArtListTap
  | keyof ItemsArtListTog
  | keyof ItemsFadList

export type OnChangeHelperArgsType = {
  newValue?: string | number | boolean
  layoutDataSingleId?: FileItemId | SubItemId
  key: layoutDataSingleKeys | keyof FileItem
  label?: keyof FullTrackCounts
}

export type InputTypeSelectorProps = {
  keySingle:
    | TrackOptionsTableKeys<keyof FullTrackCounts>[number]['keys'][number]
    | TrackListTableKeys['keys'][number]

  layoutConfigLabel?: keyof FullTrackCounts

  layoutDataSingle?: layoutDataSingle

  onChangeHelper: ({
    newValue,
    layoutDataSingleId,
    key,
    label
  }: OnChangeHelperArgsType) => void | undefined

  artTogIndividualComponentLocked?: {
    id: string
    code: boolean
  }[]

  artTapIndividualComponentLocked?: {
    id: string
    code: boolean
    on: boolean
    default: boolean
  }[]

  artLayerIndividualComponentLocked?: {
    id: string
    code: boolean
  }[]

  fadIndividualComponentLocked?: {
    id: string
    code: boolean
  }[]

  selectedItem?: FullTrackForExport

  settingsModal?: boolean
}

type ChangeEventHelper = ChangeEvent<
  HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
>

export type InputComponentProps = {
  id: string
  toggle?: boolean
  codeDisabled?: boolean
  codeFullLocked?: boolean
  defaultValue?: string | number | boolean
  placeholder?: string | number
  options?: keyof selectArray
  children?: ReactNode
  textTypeValidator?: string
  onChangeFunction: (event: ChangeEventHelper) => void
}

export const InputTypeSelector: FC<InputTypeSelectorProps> = ({
  keySingle,
  layoutConfigLabel,
  layoutDataSingle,
  onChangeHelper,
  artTogIndividualComponentLocked,
  artTapIndividualComponentLocked,
  artLayerIndividualComponentLocked,
  fadIndividualComponentLocked,
  selectedItem,
  settingsModal
}) => {
  const { input, selectArray, key } = keySingle

  const inputSelectMultiple = input === 'select-multiple'
  const inputSelectSingle = input === 'select'
  const inputCheckBoxSwitch = input === 'checkbox-switch'
  const inputCheckBox = input === 'checkbox'
  const inputColorPicker = input === 'color-picker'
  const inputText = input === 'text'
  const inputTextRich = input === 'text-rich'

  const MainComponentLevel =
    typeof layoutDataSingle === 'undefined' &&
    typeof layoutConfigLabel === 'undefined' &&
    selectedItem

  const SubComponentLevel =
    typeof layoutDataSingle !== 'undefined' &&
    typeof layoutConfigLabel !== 'undefined'

  if (settingsModal) {
    const inputPropsHelper = {
      id: `${key}`,
      onChangeFunction: (event: ChangeEventHelper) => {
        let typedValue: string | number | boolean = event.target.value

        if (typeof key === 'string') {
          typedValue = event.target.value
        } else if (typeof key === 'number') {
          typedValue = parseInt(event.target.value)
        } else if (typeof key === 'boolean') {
          typedValue = event.target.value === 'true'
        }

        onChangeHelper({
          newValue: typedValue,
          key
        })
      }
    }
    const inputComponent = (
      <>
        {inputSelectSingle && <InputSelectSingle {...inputPropsHelper} />}
        {inputSelectMultiple && <InputSelectMultiple {...inputPropsHelper} />}
        {inputText && <InputText {...inputPropsHelper} />}
        {inputCheckBox && <InputCheckBox {...inputPropsHelper} />}
        {inputCheckBoxSwitch && <InputCheckBoxSwitch {...inputPropsHelper} />}
        {inputTextRich && <InputTextRich {...inputPropsHelper} />}
      </>
    )
    return inputComponent
  }

  if (MainComponentLevel) {
    const inputPropsHelper = {
      id: `${selectedItem.id}_${key}`,
      codeDisabled: selectedItem?.locked,
      defaultValue: selectedItem[key as keyof FileItem],
      options: selectArray,
      textTypeValidator: typeof selectedItem[key as keyof FileItem],
      onChangeFunction: (event: ChangeEventHelper) => {
        let typedValue: string | number | boolean = event.target.value

        if (typeof selectedItem[key as keyof FileItem] === 'string') {
          typedValue = event.target.value
        } else if (typeof selectedItem[key as keyof FileItem] === 'number') {
          typedValue = parseInt(event.target.value)
        } else if (typeof selectedItem[key as keyof FileItem] === 'boolean') {
          typedValue = event.target.value === 'true'
        }
        onChangeHelper({
          newValue: typedValue,
          layoutDataSingleId: selectedItem.id,
          key
        })
      }
    }
    const inputComponent = (
      <>
        {!input && (
          <p
            id={`${selectedItem.id}_${key}`}
            title={
              key === 'id'
                ? selectedItem.id
                : selectedItem.id +
                  '_' +
                  key +
                  '_currentValue: ' +
                  `${selectedItem[key as keyof FileItem]}`
            }
            className={tw(
              'cursor-default overflow-hidden p-1',
              selectedItem?.locked && key != 'id' ? 'text-gray-400' : ''
            )}>
            {selectedItem[key as keyof FileItem]}
          </p>
        )}
        {inputSelectSingle && <InputSelectSingle {...inputPropsHelper} />}
        {inputSelectMultiple && <InputSelectMultiple {...inputPropsHelper} />}
        {inputText && <InputText {...inputPropsHelper} />}
        {inputCheckBox && <InputCheckBox {...inputPropsHelper} />}
        {inputCheckBoxSwitch && <InputCheckBoxSwitch {...inputPropsHelper} />}
        {inputColorPicker && <InputColorPicker {...inputPropsHelper} />}
        {inputTextRich && <InputTextRich {...inputPropsHelper} />}
      </>
    )
    return inputComponent
  }

  if (SubComponentLevel) {
    const shortenedSubComponentId = (initialId: string) => {
      return `${initialId.split('_')[2]}_${parseInt(initialId.split('_')[3]!)}`
    }

    const artLayerOptions =
      layoutConfigLabel === 'art_list_tap' ||
      layoutConfigLabel === 'art_list_tog'

    const layersOptions = key === 'art_layers' && artLayerOptions

    const stringListFullArtLayerIds = JSON.stringify(
      selectedItem?.art_layers.map((artLayer: ItemsArtLayers) => artLayer.id)
    )

    const artRangeOptions =
      layoutConfigLabel === 'art_list_tap' ||
      layoutConfigLabel === 'art_list_tog'
    const rangeOptions = key === 'ranges' && artRangeOptions

    const stringListOfFullRangeIds = JSON.stringify(
      selectedItem?.full_ranges.map(
        (fullRange: ItemsFullRanges) => fullRange.id
      )
    )

    const thisArtTog = artTogIndividualComponentLocked?.find(
      (artTogIndividualComponentLocked) =>
        artTogIndividualComponentLocked.id === layoutDataSingle.id
    )

    const thisArtTap = artTapIndividualComponentLocked?.find(
      (artTapIndividualComponentLocked) =>
        artTapIndividualComponentLocked.id === layoutDataSingle.id
    )

    const thisArtLayer = artLayerIndividualComponentLocked?.find(
      (artLayerIndividualComponentLocked) =>
        artLayerIndividualComponentLocked.id === layoutDataSingle.id
    )

    const thisFad = fadIndividualComponentLocked?.find(
      (fadIndividualComponentLocked) =>
        fadIndividualComponentLocked.id === layoutDataSingle.id
    )

    const artTogLockedHelper =
      layoutConfigLabel === 'art_list_tog' && key === 'code' && thisArtTog?.code

    const artTapLockedHelper =
      layoutConfigLabel === 'art_list_tap' &&
      ((key === 'on' && thisArtTap?.on) ||
        (key === 'default' && thisArtTap?.default))

    const artLayerLockedHelper =
      layoutConfigLabel === 'art_layers' && key === 'code' && thisArtLayer?.code

    const fadLockedHelper =
      layoutConfigLabel === 'fad_list' && key === 'code' && thisFad?.code

    const safeValue = getLayoutData(
      layoutDataSingle,
      key as LayoutDataSingleHelper<typeof layoutConfigLabel>
    )

    const inputPropsHelper = {
      id: `${layoutDataSingle.id}_${key}`,
      codeFullLocked: selectedItem?.locked,
      codeDisabled:
        artTogLockedHelper ||
        artTapLockedHelper ||
        artLayerLockedHelper ||
        fadLockedHelper,
      defaultValue: safeValue,
      options: selectArray,
      textTypeValidator: typeof safeValue,
      onChangeFunction: (event: ChangeEventHelper) => {
        let typedValue: string | number | boolean = event.target.value

        if (typeof safeValue === 'string') {
          typedValue = event.target.value
        } else if (typeof safeValue === 'number') {
          typedValue = parseInt(event.target.value)
        } else if (typeof safeValue === 'boolean') {
          typedValue = event.target.value === 'true'
        }

        onChangeHelper({
          newValue: typedValue,
          layoutDataSingleId: layoutDataSingle.id,
          key,
          label: layoutConfigLabel
        })
      }
    }
    const inputComponent = (
      <>
        {!input && key === 'id' && (
          <p
            id={`${layoutDataSingle.id}_${key}`}
            title={layoutDataSingle.id}
            className='cursor-default p-1'>
            {shortenedSubComponentId(layoutDataSingle.id)}
          </p>
        )}

        {inputSelectSingle && <InputSelectSingle {...inputPropsHelper} />}
        {inputSelectMultiple && <InputSelectMultiple {...inputPropsHelper} />}
        {inputText && <InputText {...inputPropsHelper} />}
        {inputCheckBox && <InputCheckBox {...inputPropsHelper} />}
        {inputCheckBoxSwitch && <InputCheckBoxSwitch {...inputPropsHelper} />}
      </>
    )

    return inputComponent
  }
}
