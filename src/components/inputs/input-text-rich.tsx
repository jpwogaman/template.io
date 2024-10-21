import React, { type FC, type ChangeEvent, useState, useEffect } from 'react'
import tw from '@/utils/tw'
import { type InputComponentProps } from './index'

export const InputTextRich: FC<InputComponentProps> = ({
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
  const nameChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    onChangeFunction(event)
  }

  useEffect(() => {
    setValue(defaultValue as string | number)
  }, [defaultValue])

  return (
    <textarea
      id={id}
      disabled={codeFullLocked ?? codeDisabled}
      readOnly={codeFullLocked ?? codeDisabled}
      value={value}    
      title={id + '_currentValue: ' + value}
      placeholder={placeholder as string}      
      maxLength={1000}
      wrap='soft'
      onChange={nameChange}
      className={tw(
        codeFullLocked ?? codeDisabled
          ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        'text-xs w-full border-2 dark:border-white border-zinc-300 rounded-sm bg-inherit p-1 placeholder-zinc-400 outline-none transition-all duration-200 dark:placeholder-zinc-500',
        'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600 min-h-12 max-h-72'
      )}
    />
  )
}
