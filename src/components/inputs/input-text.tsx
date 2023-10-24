import React, {
  type FC,
  type ChangeEvent,
  type ReactNode,
  useState,
  useEffect
} from 'react'
import tw from '@/utils/tw'
import { on } from 'events'
import { event } from '@tauri-apps/api'

interface InputTextProps {
  id: string | undefined
  title?: string
  placeholder?: string | number
  codeDisabled?: boolean
  children?: ReactNode
  defaultValue?: string | number
  onChangeFunction: (event: ChangeEvent<HTMLInputElement>) => void | undefined
  onReceive?: string | number
  td?: boolean
  textTypeValidator?: string
}

export const InputText: FC<InputTextProps> = ({
  textTypeValidator: valueType,
  td,
  onReceive,
  onChangeFunction,
  defaultValue,
  id,
  placeholder,
  title,
  codeDisabled
}) => {
  const [value, setValue] = useState<string | number>(defaultValue ?? '')
  const [mounted, setMounted] = useState(false)

  const [query, setQuery] = useState('')

  //useEffect(() => {
  //  setMounted(true)

  //  const timeOutId = setTimeout(() => {
  //    if (!mounted) return

  //    setValue(query)
  //    onChangeFunction(event as unknown as ChangeEvent<HTMLInputElement>)
  //  }, 500)

  //  return () => clearTimeout(timeOutId)
  //}, [query])

  //if (!mounted) {
  //  return null
  //}

  const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
    //if (valueType === 'number') {
    //  const regexPositiveNegativeNumber = /^-?\d*\.?\d*$/
    //  const validatePositiveNegativeNumber = regexPositiveNegativeNumber.test(
    //    event.target.value
    //  )
    //  if (validatePositiveNegativeNumber) {
    //    setValue(event.target.value)
    //    onChangeFunction(event)
    //    return
    //  }

    //  return alert('Please enter a valid number.')
    //}

    //if (valueType === 'string') {
    //  setValue(event.target.value)
    //  onChangeFunction(event)
    //}

    setValue(event.target.value)
    onChangeFunction(event)
  }

  return (
    <input
      id={id}
      type='text'
      disabled={codeDisabled}
      value={onReceive ?? value}
      title={id + '_currentValue: ' + value}
      placeholder={placeholder as string}
      //onChange={(event) => {
      //  setQuery(event.target.value)
      //}}
      onChange={nameChange}
      className={tw(
        codeDisabled
          ? 'hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
          : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
        //td ? 'w-full' : 'w-10',
        'w-full border border-transparent bg-inherit pl-1 placeholder-zinc-400 outline-offset-4 outline-green-600 focus:cursor-text focus:bg-white focus:text-zinc-900 focus:placeholder-zinc-500 dark:placeholder-zinc-500 dark:outline-green-800'
      )}
    />
  )
}
