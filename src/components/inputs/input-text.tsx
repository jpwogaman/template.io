import React, { type FC, type ChangeEvent, useState, useEffect } from 'react'
import tw from '@/components/utils/tw'
import { type InputComponentProps } from './index'
import { useMutations } from '../context'
import { itemInitKeyStringOrNumber } from './item-init-helpers'

export const InputText: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
  defaultValue,
  placeholder,
  onChangeFunction
}) => {
  const [value, setValue] = useState(defaultValue as string)

  const valChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    onChangeFunction(event)
  }
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
    <input
      id={id}
      type='text'
      disabled={codeFullLocked || codeDisabled}
      value={value}
      title={id + '_currentValue: ' + value}
      placeholder={placeholder as string}
      onChange={valChange}
      className={tw(
        codeFullLocked || codeDisabled
          ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        'w-full rounded-sm bg-inherit p-1 placeholder-zinc-400 outline-none transition-all duration-200 dark:placeholder-zinc-500',
        'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600'
      )}
    />
  )
}
