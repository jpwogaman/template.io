import { type FC, type ChangeEvent, useState } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputCheckBoxSwitch: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  defaultValue,
  options,
  onChangeFunction
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
      if (onChangeFunction) {
        onChangeFunction(event)
      }

      setChecked(!isChecked)
    }
  }

  return (
    <div className='flex items-center justify-evenly'>
      <label
        htmlFor={id}
        title={id + '_currentValue: ' + (isChecked ? b : a)}
        className='relative inline-flex cursor-pointer items-center'>
        <input
          id={id}
          type='checkbox'
          disabled={codeDisabled}
          checked={isChecked}
          value={isChecked ? b : a}
          onChange={(event) => valChange(event)}
          className='peer sr-only'
        />
        <div
          className={tw(
            'h-4 w-8 rounded-full bg-blue-600 dark:bg-blue-800',
            "after:absolute after:left-[0px] after:top-[0px] after:h-4 after:w-4 after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-['']",
            'peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:peer-checked:bg-green-800'
          )}
        />
      </label>
    </div>
  )
}
