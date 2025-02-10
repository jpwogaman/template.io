import { type FC, type ChangeEvent, useState, useLayoutEffect } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'

export const InputSelectSingle: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
  defaultValue,
  options,
  onChangeFunction
}) => {
  const [value, setValue] = useState(defaultValue as string)

  const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value)
    onChangeFunction(event)
  }

  useLayoutEffect(() => {
    setValue(defaultValue as string)
  }, [defaultValue])

  return (
    <select
      id={id}
      autoComplete='off'
      disabled={codeFullLocked ? true : codeDisabled}
      title={id + '_currentValue: ' + value}
      value={value}
      onChange={valChange}
      className={twMerge(
        'w-full overflow-scroll rounded-xs bg-inherit p-1 transition-all duration-200',
        'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden',
        codeFullLocked || codeDisabled
          ? 'cursor-not-allowed text-gray-400'
          : 'cursor-pointer'
      )}>
      {codeDisabled
        ? selectArrays.valNoneList
        : options && selectArrays[options]}
    </select>
  )
}
