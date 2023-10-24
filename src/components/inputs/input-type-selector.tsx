import { type ChangeEvent, type FC } from 'react'
import {
  InputText,
  InputSelectSingle,
  InputSelectMultiple,
  InputCheckBox,
  InputCheckBoxSwitch
} from './index'

import {
  type FileItems,
  type ItemsArtListSwitch,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'

import TrackOptionsTableKeys from '../trackOptionsTableKeys'
import TrackListTableKeys from '../trackListTableKeys'

export type OnChangeHelperArgsType = {
  newValue?: string | number | boolean
  layoutDataSingleId: string
  key: string
  label?: string
}

export type SelectedItemType = FileItems & { fullRange: ItemsFullRanges[] } & {
  artListSwitch: ItemsArtListSwitch[]
} & { artListTog: ItemsArtListTog[] } & { fadList: ItemsFadList[] }

type InputTypeSelectorProps = {
  keySingle:
    | (typeof TrackOptionsTableKeys)[number]['keys'][number]
    | (typeof TrackListTableKeys)['keys'][number]
  layoutConfigLabel?: string
  layoutDataSingle?:
    | ItemsArtListSwitch
    | ItemsArtListTog
    | ItemsFadList
    | ItemsFullRanges
  onChangeHelper: ({
    newValue,
    layoutDataSingleId,
    key,
    label
  }: OnChangeHelperArgsType) => void | undefined
  selectedItem?: SelectedItemType
}

export const InputTypeSelector: FC<InputTypeSelectorProps> = ({
  keySingle,
  layoutConfigLabel,
  layoutDataSingle,
  onChangeHelper,
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
            className='cursor-default overflow-hidden p-1'>
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
      layoutConfigLabel === 'artListSwitch' ||
      layoutConfigLabel === 'artListTog'
    const rangeOptions = key === 'ranges' && artRangeOptions
    const stringListOfFullRangeIds = JSON.stringify(
      selectedItem?.fullRange.map((fullRange: ItemsFullRanges) =>
        shortenedSubComponentId(fullRange.id)
      )
    )

    const inputPropsHelper = {
      id: `${layoutDataSingle.id}_${key}`,
      codeDisabled: selectedItem?.locked,
      defaultValue: layoutDataSingle[key as 'id'],
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
