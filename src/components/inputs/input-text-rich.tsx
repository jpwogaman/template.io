import React, { type FC, type ChangeEvent, useState, useEffect } from 'react'
import tw from '@/components/utils/tw'
import { type InputComponentProps } from './index'
import { useMutations } from '../context'
import { itemInitKeyStringOrNumber } from './item-init-helpers'

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

  // need to get rid of this, currently necessary to update the notes field when changing tracks
  useEffect(() => {
    setValue(defaultValue as string)
  }, [defaultValue])

  ////////
  const { clearState, setClearState } = useMutations()

  useEffect(() => {
    if (typeof clearState !== 'string') return

    if (id.includes(clearState + '_')) {
      itemInitKeyStringOrNumber({
        id,
        clearState,
        setValue
      })
    }

    return () => {
      setClearState(null)
    }
  }, [clearState])
  ///////

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
      onChange={valChange}
      className={tw(
        (codeFullLocked ?? codeDisabled)
          ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        'w-full rounded-sm border-2 border-zinc-300 bg-inherit p-1 text-xs placeholder-zinc-400 outline-none transition-all duration-200 dark:border-white dark:placeholder-zinc-500',
        'max-h-72 min-h-12 focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600'
      )}
    />
  )
}
