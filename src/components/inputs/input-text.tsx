import React, { type FC, type ChangeEvent, useState } from 'react'
import tw from '@/utils/tw'
import { type InputComponentProps } from './index'

export const InputText: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
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
      disabled={codeFullLocked ?? codeDisabled}
      value={value}
      title={id + '_currentValue: ' + value}
      placeholder={placeholder as string}
      //onChange={(event) => {
      //  setQuery(event.target.value)
      //}}
      onChange={nameChange}
      className={tw(
        codeFullLocked ?? codeDisabled
          ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        'w-full rounded-sm bg-inherit p-1 placeholder-zinc-400 outline-none transition-all duration-200 dark:placeholder-zinc-500',
        'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600'
      )}
    />
  )
}
