import { type FC, type ChangeEvent, useState } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputCheckBoxSwitch: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  options,
  onChangeFunction
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue === 'b')
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
    if (!codeFullLocked) {
      if (onChangeFunction) {
        onChangeFunction(event)
      }

      setIsChecked(!isChecked)
    }
  }

  return (
    <div className='flex items-center justify-evenly'>
      <label
        htmlFor={id}
        title={id + '_currentValue: ' + (isChecked ? b : a)}
        className='relative inline-flex items-center'>
        <input
          id={id}
          type='checkbox'
          disabled={codeFullLocked}
          checked={isChecked}
          value={isChecked ? a : b}
          onChange={(event) => valChange(event)}
          className='peer sr-only'
        />
        <div
          className={tw(
            'h-4 w-8 rounded-full bg-blue-600 dark:bg-blue-800',
            "after:absolute after:left-[0px] after:top-[0px] after:h-4 after:w-4 after:rounded-full after:border after:transition-all after:content-['']",
            codeFullLocked
              ? 'cursor-not-allowed after:border-gray-400 after:bg-gray-400'
              : 'cursor-pointer after:border-white after:bg-white',
            'peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:peer-checked:bg-green-800'
          )}
        />
      </label>
    </div>
  )
}
