import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import { selectArrays } from '@/components/input-arrays'

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

export const InputSelect: FC<InputSelectProps> = ({
  onChangeInputSwitch: onSelect,
  codeDisabled,
  id,
  options,
  defaultValue
}) => {
  const [val, setVal] = useState<string | number>(defaultValue ?? '')

  let optionElements: React.JSX.Element | string[] | number[] | undefined =
    selectArrays.valNoneList?.array

  if (!codeDisabled) {
    for (const array in selectArrays) {
      if (options === selectArrays[array]?.name) {
        optionElements = selectArrays[array]?.array
      }
    }
  }

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setVal(event.target.value)

    if (onSelect) {
      onSelect(event)
    } else return
  }

  return (
    <select
      className='        
              w-full                                 
              cursor-pointer 
              overflow-scroll 
              bg-inherit  
              outline-offset-4 outline-green-600
              focus:bg-white
              focus:text-zinc-900
              dark:outline-green-800'
      value={!codeDisabled ? val : undefined}
      disabled={codeDisabled}
      id={id}
      onChange={valChange}>
      {optionElements}
    </select>
  )
}
