import { type ReactNode, type ChangeEvent, type FC } from 'react'
import {
  InputText,
  InputSelectSingle,
  InputSelectMultiple,
  InputCheckBox,
  InputCheckBoxSwitch
} from './index'

import SettingsTableKeys from '../utils/settingsTableKeys'
import tw from '@/utils/tw'
import { InputColorPicker } from './input-color-picker'
import { InputTextRich } from './input-text-rich'

export type OnChangeHelperArgsType = {
  newValue?: string | number | boolean
  layoutDataSingleId?: string
  key: string
  label?: string
}

type InputTypeSelectorProps = {
  keySingle:    
    | (typeof SettingsTableKeys)['keys'][number]
  onChangeHelper: ({
    newValue,
    layoutDataSingleId,
    key,
    label
  }: OnChangeHelperArgsType) => void | undefined
  settingsModal?: boolean
}

type ChangeEventHelper = 
  ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>

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
  onChangeHelper,  
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


  if (settingsModal) {
    const inputPropsHelper = {
      id: `${key}`,      
      defaultValue: localStorage.getItem(key) ?? '',
      options: selectArray ?? '',
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
        {inputColorPicker && <InputColorPicker {...inputPropsHelper} />}
        {inputCheckBox && <InputCheckBox {...inputPropsHelper} />}
        {inputCheckBoxSwitch && <InputCheckBoxSwitch {...inputPropsHelper} />}
        {inputTextRich && <InputTextRich {...inputPropsHelper} />}
      </>
    )
    return inputComponent
  }


}
