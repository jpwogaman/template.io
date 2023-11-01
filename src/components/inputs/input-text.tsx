import React, { type FC, type ChangeEvent, useState } from 'react'
import tw from '@/utils/tw'
import { type InputComponentProps } from './index'

export const InputText: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  defaultValue,
  placeholder,
  onChangeFunction
}) => {
  const [value, setValue] = useState<string | number>(
    (defaultValue as unknown as string | number) ?? ''
  )
  const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    onChangeFunction(event)
  }

  return (
    <input
      id={id}
      type='text'
      disabled={codeDisabled}
      value={value}
      title={id + '_currentValue: ' + value}
      placeholder={placeholder as string}
      //onChange={(event) => {
      //  setQuery(event.target.value)
      //}}
      onChange={nameChange}
      className={tw(
        codeDisabled
          ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        'w-full border border-transparent bg-inherit pl-1 placeholder-zinc-400 outline-offset-4 outline-green-600 focus:cursor-text focus:bg-white focus:text-zinc-900 focus:placeholder-zinc-500 dark:placeholder-zinc-500 dark:outline-green-800'
      )}
    />
  )
}
