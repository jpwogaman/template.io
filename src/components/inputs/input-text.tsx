import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import tw from '@/utils/tw'

interface InputTextProps {
  id: string | undefined
  title?: string
  placeholder?: string | number
  codeDisabled?: boolean
  children?: ReactNode
  defaultValue?: string | number
  onChangeFunction?: (event: ChangeEvent<HTMLInputElement>) => void | undefined
  onReceive?: string | number
  td?: boolean
  valueType?: string
}

export const InputText: FC<InputTextProps> = ({
  valueType,
  td,
  onReceive,
  onChangeFunction,
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

    if (onChangeFunction) {
      onChangeFunction(event)
    }
  }

  return (
    <input
      id={id}
      type='text'
      disabled={codeDisabled}
      value={onReceive ?? valueName}
      title={id + '_currentValue: ' + valueName}
      placeholder={placeholder as string}
      onChange={nameChange}
      className={tw(
        codeDisabled
          ? 'hover:cursor-text hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-pointer hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        //td ? 'w-full' : 'w-10',
        'w-full border border-transparent bg-inherit pl-1 placeholder-zinc-400 outline-offset-4 outline-green-600 focus:cursor-text focus:bg-white focus:text-zinc-900 focus:placeholder-zinc-500 dark:placeholder-zinc-500 dark:outline-green-800'
      )}
    />
  )
}
