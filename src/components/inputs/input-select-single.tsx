import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import { selectArrays } from './index'
import tw from '@/utils/tw'

interface InputSelectProps {
  id: string | undefined
  options: string | number
  codeDisabled?: boolean
  onChangeInputSwitch?: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void | undefined
  children?: ReactNode
  defaultValue?: string
}

export const InputSelectSingle: FC<InputSelectProps> = ({
  onChangeInputSwitch: onSelect,
  codeDisabled,
  id,
  options,
  defaultValue
}) => {
  const [value, setVal] = useState<string | number>(defaultValue ?? '')

  let inputSelectOptionElements:
    | React.JSX.Element
    | string[]
    | number[]
    | undefined = selectArrays.valNoneList?.array

  if (!codeDisabled) {
    for (const array in selectArrays) {
      if (options === selectArrays[array]?.name) {
        inputSelectOptionElements = selectArrays[array]?.array
      }
    }
  }

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setVal(event.target.value)

    if (onSelect) {
      onSelect(event)
    }
  }

  return (
    <select
      title={id + '_currentValue: ' + value}
      className='        
              w-full                                 
              cursor-pointer 
              overflow-scroll 
              bg-inherit  
              outline-offset-4 outline-green-600
              focus:bg-white
              focus:text-zinc-900
              dark:outline-green-800'
      value={!codeDisabled ? value : undefined}
      disabled={codeDisabled}
      id={id}
      onChange={valChange}>
      {inputSelectOptionElements}
    </select>
  )
}
