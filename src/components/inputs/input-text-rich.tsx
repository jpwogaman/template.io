import React, {
  type FC,
  type ChangeEvent,
  useState,
  useLayoutEffect
} from 'react'
import { twMerge } from 'tailwind-merge'
import { type InputComponentProps } from './index'

export const InputTextRich: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
  defaultValue,
  placeholder,
  onChangeFunction
}) => {
  const [value, setValue] = useState(defaultValue as string)

  const valChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
    onChangeFunction(event)
  }

  useLayoutEffect(() => {
    setValue(defaultValue as string)
  }, [defaultValue])

  return (
    <textarea
      id={id}
      autoComplete='off'
      disabled={codeFullLocked ? true : codeDisabled}
      readOnly={codeFullLocked ? true : codeDisabled}
      value={value}
      title={id + '_currentValue: ' + value}
      placeholder={placeholder as string}
      maxLength={1000}
      wrap='soft'
      onChange={valChange}
      className={twMerge(
        codeFullLocked || codeDisabled
          ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        'w-full rounded-xs border-2 border-zinc-300 bg-inherit p-1 text-xs placeholder-zinc-400 outline-hidden transition-all duration-200 dark:border-white dark:placeholder-zinc-500',
        'max-h-72 min-h-12 focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
      )}
    />
  )
}
