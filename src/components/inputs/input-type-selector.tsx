import {
  ReactNode,
  type ChangeEvent,
  type FC,
  Dispatch,
  SetStateAction
} from 'react'
import {
  InputText,
  InputSelectSingle,
  InputSelectMultiple,
  InputCheckBox,
  InputCheckBoxSwitch
} from './index'

import {
  type FileItems,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'

import TrackOptionsTableKeys from '../trackOptionsTableKeys'
import TrackListTableKeys from '../trackListTableKeys'
import tw from '@/utils/tw'

export type OnChangeHelperArgsType = {
  newValue?: string | number | boolean
  layoutDataSingleId: string
  key: string
  label?: string
}

export type SelectedItemType = FileItems & { fullRange: ItemsFullRanges[] } & {
  artListTap: ItemsArtListTap[]
} & { artListTog: ItemsArtListTog[] } & { fadList: ItemsFadList[] }

type InputTypeSelectorProps = {
  keySingle:
    | (typeof TrackOptionsTableKeys)[number]['keys'][number]
    | (typeof TrackListTableKeys)['keys'][number]
  layoutConfigLabel?: string
  layoutDataSingle?:
    | ItemsFullRanges
    | ItemsArtListTap
    | ItemsArtListTog
    | ItemsFadList
  onChangeHelper: ({
    newValue,
    layoutDataSingleId,
    key,
    label
  }: OnChangeHelperArgsType) => void | undefined
  artTapIndividualComponentLocked?: {
    id: string
    on: boolean
  }[]
  fadIndividualComponentLocked?: {
    id: string
    code: boolean
  }[]
  artTapOneDefaultOnly?: {
    id: string
    default: boolean
  }[]
  selectedItem?: SelectedItemType
}

export type InputComponentProps = {
  id: string
  toggle?: boolean
  codeDisabled?: boolean
  codeFullLocked?: boolean
  defaultValue?: string | number | boolean
  placeholder?: string | number
  options?: string
  children?: ReactNode
  textTypeValidator: string
  onChangeFunction: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void | undefined
}

export const InputTypeSelector: FC<InputTypeSelectorProps> = ({
  keySingle,
  layoutConfigLabel,
  layoutDataSingle,
  onChangeHelper,
  artTapIndividualComponentLocked,
  fadIndividualComponentLocked,
  artTapOneDefaultOnly,
  selectedItem
}) => {
  const { input, selectArray, key } = keySingle

  const inputSelectMultiple = input === 'select-multiple'
  const inputSelectSingle = input === 'select'
  const inputCheckBoxSwitch = input === 'checkbox-switch'
  const inputCheckBox = input === 'checkbox'
  const inputText = input === 'text'

  const MainComponentLevel =
    typeof layoutDataSingle === 'undefined' &&
    typeof layoutConfigLabel === 'undefined' &&
    selectedItem

  const SubComponentLevel =
    typeof layoutDataSingle !== 'undefined' &&
    typeof layoutConfigLabel !== 'undefined'

  if (MainComponentLevel) {
    const inputPropsHelper = {
      id: `${selectedItem.id}_${key}`,
      codeDisabled: selectedItem?.locked,
      defaultValue: selectedItem[key as 'id'],
      options: selectArray ?? '',
      textTypeValidator: typeof selectedItem[key as 'id'],
      onChangeFunction: (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
      ) =>
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
            title={
              selectedItem.id +
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
      </>
    )
    return inputComponent
  }

  if (SubComponentLevel) {
    const shortenedSubComponentId = (initialId: string) => {
      return `${initialId.split('_')[2]}_${
        parseInt(initialId.split('_')[3] as string) + 1
      }`
    }

    const artRangeOptions =
      layoutConfigLabel === 'artListTap' || layoutConfigLabel === 'artListTog'
    const rangeOptions = key === 'ranges' && artRangeOptions
    const stringListOfFullRangeIds = JSON.stringify(
      selectedItem?.fullRange.map((fullRange: ItemsFullRanges) =>
        shortenedSubComponentId(fullRange.id)
      )
    )

    const thisArtTap = artTapIndividualComponentLocked?.find(
      (artTapIndividualComponentLocked) =>
        artTapIndividualComponentLocked.id === layoutDataSingle.id
    )

    const thisArtTapDefault = artTapOneDefaultOnly?.find(
      (artTapOneDefaultOnly) => artTapOneDefaultOnly.id === layoutDataSingle.id
    )

    const thisFad = fadIndividualComponentLocked?.find(
      (fadIndividualComponentLocked) =>
        fadIndividualComponentLocked.id === layoutDataSingle.id
    )

    const artTapLockedHelper =
      layoutConfigLabel === 'artListTap' &&
      key === 'on' &&
      thisArtTap?.on === true

    const fadLockedHelper =
      layoutConfigLabel === 'fadList' &&
      key === 'code' &&
      thisFad?.code === true

    const artTapDefaultHelper =
      layoutConfigLabel === 'artListTap' && key === 'default'

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
        artTapLockedHelper || //NOSONAR
        fadLockedHelper,
      defaultValue: inputCheckBoxSwitch
        ? checkBoxSwitchValueHelper()
        : artTapDefaultHelper
        ? thisArtTapDefault?.default
        : layoutDataSingle[key as 'id'],
      options: rangeOptions ? stringListOfFullRangeIds : selectArray ?? '',
      textTypeValidator: typeof layoutDataSingle[key as 'id'],
      onChangeFunction: (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
      ) =>
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
            title={
              layoutDataSingle.id +
              '_currentValue: ' +
              `${shortenedSubComponentId(layoutDataSingle[key as 'id'])}`
            }
            className='cursor-default overflow-hidden p-1'>
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
