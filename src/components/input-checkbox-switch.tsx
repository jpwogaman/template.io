import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import { selectArrays } from './input-arrays'
import tw from '@/utils/tw'

interface InputCheckBoxSwitchProps {
  id: string | undefined
  title?: string
  defaultValue?: string
  codeDisabled?: boolean
  options?: string | number
  artFad?: boolean
  toggle?: boolean
  showVals?: boolean
  children?: ReactNode
  onChangeInputSwitch?: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void | undefined
}

export const InputCheckBoxSwitch: FC<InputCheckBoxSwitchProps> = ({
  onChangeInputSwitch: onSwitch,
  artFad,
  toggle,
  showVals,
  options,
  title,
  defaultValue,
  codeDisabled,
  id
}) => {
  const [isChecked, setChecked] = useState<boolean>(defaultValue === 'b')

  let inputSelectOptionElements: string[] = ['a', 'b']

  for (const array in selectArrays) {
    if (options === selectArrays[array]?.name) {
      inputSelectOptionElements = selectArrays[array]?.array as string[]
    }
  }

  const a = inputSelectOptionElements[0]
  const b = inputSelectOptionElements[1]

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (!codeDisabled) {
      if (onSwitch) {
        onSwitch(event)
      }

      setChecked(!isChecked)
    }
  }

  let val1SpanTitle =
    'the DEFAULT value relates to the CODE itself (i.e. DEFAULT = CC11)'
  let val2SpanTitle =
    "the DEFAULT value relates to the CODE's second Value (i.e. CODE = C#3, DEFAULT = Velocity 20)"

  if (artFad && toggle) {
    val1SpanTitle =
      'the ON and OFF values relate to the CODE itself (i.e. ON = CC18, OFF = CC35)'
    val2SpanTitle =
      "the ON and OFF values relate to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20, OFF = Velocity 21)"
  }

  if (artFad && !toggle) {
    val1SpanTitle = 'the ON value relates to the CODE itself (i.e. ON = CC18)'
    val2SpanTitle =
      "the ON value relates to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20)"
  }

  const valSpan1 = (
    <span
      title={val1SpanTitle}
      className={
        isChecked
          ? 'cursor-default text-zinc-400 transition-colors dark:text-zinc-500'
          : 'cursor-default transition-colors'
      }>
      {a}
    </span>
  )

  const valSpan2 = (
    <span
      title={val2SpanTitle}
      className={
        !isChecked
          ? 'cursor-default  text-zinc-400 transition-colors dark:text-zinc-500'
          : 'cursor-default transition-colors'
      }>
      {b}
    </span>
  )

  return (
    <div className='flex items-center justify-evenly'>
      {showVals ? valSpan1 : null}
      <label
        htmlFor={id}
        title={title}
        className='relative inline-flex cursor-pointer items-center'>
        <input
          type='checkbox'
          value={isChecked ? b : a}
          id={id}
          disabled={codeDisabled}
          className='peer sr-only'
          checked={isChecked}
          onChange={(event) => valChange(event)}
        />
        <div
          className={tw(
            `
                    h-4 
                    w-8
                    rounded-full bg-blue-600
                    after:absolute                    
                    after:left-[0px]                                             
                    after:top-[0px] 
                    after:h-4 
                    after:w-4 
                    after:rounded-full 
                    after:border 
                    after:border-white 
                    after:bg-white 
                    after:transition-all                 
                    after:content-[''] 
                    peer-checked:bg-green-600 
                    peer-checked:after:translate-x-full 
                    peer-checked:after:border-white
                    peer-focus:outline-none 
                    dark:bg-blue-800 dark:peer-checked:bg-green-800`
          )}
        />
      </label>
      {showVals ? valSpan2 : null}
    </div>
  )
}
