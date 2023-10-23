import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import tw from '@/utils/tw'

interface InputTextProps {
  id: string | undefined
  title?: string
  placeholder?: string | number
  codeDisabled?: boolean
  children?: ReactNode
  defaultValue?: string | number
  onChangeInputSwitch?: (
    event: ChangeEvent<HTMLInputElement>
  ) => void | undefined
  onReceive?: string | number
  td?: boolean
  valueType?: string
}

export const InputText: FC<InputTextProps> = ({
  valueType,
  td,
  onReceive,
  onChangeInputSwitch: onInput,
  defaultValue,
  id,
  placeholder,
  title,
  codeDisabled
}) => {
  const [valueName, setName] = useState<string | number>(defaultValue ?? '')

  const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '' && valueType === 'number') {
      event.target.value = placeholder as string
    }

    setName(event.target.value)

    if (onInput) {
      onInput(event)
    } else return
  }

  return (
    <input
      type='text'
      className={`
            ${
              codeDisabled
                ? 'hover:cursor-text hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
                : 'hover:cursor-pointer hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600'
            }
            ${td ? 'w-full' : 'w-10'} 
            border border-transparent
            bg-inherit
            pl-1
            placeholder-zinc-400
            outline-offset-4 
            outline-green-600 
            focus:cursor-text
            focus:bg-white focus:text-zinc-900
            focus:placeholder-zinc-500
            dark:placeholder-zinc-500 
            dark:outline-green-800`}
      id={id}
      title={id + '_currentValue: ' + valueName}
      placeholder={placeholder as string}
      disabled={codeDisabled}
      value={onReceive ?? valueName}
      onChange={nameChange}></input>
  )
}
