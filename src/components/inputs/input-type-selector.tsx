import { type ReactNode, type ChangeEvent, type FC } from 'react'
import {
  InputText,
  InputSelectSingle,
  InputSelectMultiple,
  InputCheckBox,
  InputCheckBoxSwitch
} from './index'

import { type TrackOptionsTableKeys } from '../utils/trackOptionsTableKeys'
import { type TrackListTableKeys } from '../utils/trackListTableKeys'
import tw from '@/utils/tw'
import { InputColorPicker } from './input-color-picker'
import { InputTextRich } from './input-text-rich'

import {
  type FullTrackForExport,
  type ItemsFullRanges,
  type ItemsArtLayers,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList
} from '../backendCommands/backendCommands'

export type OnChangeHelperArgsType = {
  newValue?: string | number | boolean
  layoutDataSingleId?: string
  key: string
  label?: TrackOptionsTableKeys[number]['label']
}

type InputTypeSelectorProps = {
  keySingle:
    | TrackOptionsTableKeys[number]['keys'][number]
    | TrackListTableKeys['keys'][number]
  layoutConfigLabel?: TrackOptionsTableKeys[number]['label']
  layoutDataSingle?:
    | ItemsFullRanges
    | ItemsArtListTog
    | ItemsArtListTap
    | ItemsArtLayers
    | ItemsFadList
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
    on: boolean
  }[]
  artLayerIndividualComponentLocked?: {
    id: string
    code: boolean
  }[]
  fadIndividualComponentLocked?: {
    id: string
    code: boolean
  }[]
  artTapOneDefaultOnly?: {
    id: string
    default: boolean
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
  options?: string
  children?: ReactNode
  textTypeValidator?: string
  onChangeFunction: (event: ChangeEventHelper) => void | undefined
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
  artTapOneDefaultOnly,
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
      //defaultValue: localStorage.getItem(key) ?? '',
      onChangeFunction: (event: ChangeEventHelper) =>
        onChangeHelper({
          newValue: event.target.value,
          key
        })
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
      defaultValue: selectedItem[key as 'id'],
      options: selectArray ?? '',
      textTypeValidator: typeof selectedItem[key as 'id'],
      onChangeFunction: (event: ChangeEventHelper) =>
        onChangeHelper({
          newValue: event.target.value,
          layoutDataSingleId: selectedItem.id,
          key
        })
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
                  `${selectedItem[key as 'id']}`
            }
            className={tw(
              'cursor-default overflow-hidden p-1',
              selectedItem?.locked && key != 'id' ? 'text-gray-400' : ''
            )}>
            {selectedItem[key as 'id']}
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
      selectedItem?.art_layers.map((artLayer: ItemsArtLayers) => artLayer.id) ??
        ''
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
    const thisArtTapDefault = artTapOneDefaultOnly?.find(
      (artTapOneDefaultOnly) => artTapOneDefaultOnly.id === layoutDataSingle.id
    )

    const thisFad = fadIndividualComponentLocked?.find(
      (fadIndividualComponentLocked) =>
        fadIndividualComponentLocked.id === layoutDataSingle.id
    )

    const artTogLockedHelper =
      layoutConfigLabel === 'art_list_tog' &&
      key === 'code' &&
      thisArtTog?.code === true

    const artTapLockedHelper =
      layoutConfigLabel === 'art_list_tap' &&
      key === 'on' &&
      thisArtTap?.on === true

    const artLayerLockedHelper =
      layoutConfigLabel === 'art_layers' &&
      key === 'code' &&
      thisArtLayer?.code === true

    const fadLockedHelper =
      layoutConfigLabel === 'fad_list' &&
      key === 'code' &&
      thisFad?.code === true

    const artTapDefaultHelper =
      layoutConfigLabel === 'art_list_tap' && key === 'default'

    const checkBoxSwitchValueHelper = () => {
      if (layoutDataSingle[key as 'id'] === 'Value 2') {
        return 'b'
      }
      return 'a'
    }

    const inputPropsHelper = {
      id: `${layoutDataSingle.id}_${key}`,
      codeFullLocked: selectedItem?.locked,
      codeDisabled:
        artTogLockedHelper || //NOSONAR
        artTapLockedHelper || //NOSONAR
        artLayerLockedHelper || //NOSONAR
        fadLockedHelper,
      defaultValue: inputCheckBoxSwitch
        ? checkBoxSwitchValueHelper()
        : artTapDefaultHelper
          ? thisArtTapDefault?.default
          : layoutDataSingle[key as 'id'],
      options: rangeOptions
        ? stringListOfFullRangeIds
        : layersOptions
          ? stringListFullArtLayerIds
          : (selectArray ?? ''),
      textTypeValidator: typeof layoutDataSingle[key as 'id'],
      onChangeFunction: (event: ChangeEventHelper) =>
        onChangeHelper({
          newValue: event.target.value,
          layoutDataSingleId: layoutDataSingle.id,
          key,
          label: layoutConfigLabel
        })
    }
    const inputComponent = (
      <>
        {!input && (
          <p
            id={`${layoutDataSingle.id}_${key}`}
            title={layoutDataSingle.id}
            className='cursor-default p-1'>
            {shortenedSubComponentId(layoutDataSingle[key as 'id'])}
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
