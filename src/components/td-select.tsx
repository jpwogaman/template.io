import React, {
  type FC,
  useState,
  type ChangeEvent,
  type ReactNode
} from 'react'
import { selectArrays } from './select-arrays'

interface TdSelectProps {
  id: string | undefined
  options: string | number
  codeDisabled?: boolean
  onSelect?: (event: ChangeEvent<HTMLSelectElement>) => void | undefined
  children?: ReactNode
}

export const TdSelect: FC<TdSelectProps> = ({
  onSelect,
  codeDisabled,
  id,
  options
}) => {
  const [val, setVal] = useState<string>('')

  let optionElements: string | React.JSX.Element | undefined

  for (const array in selectArrays) {
    if (options === selectArrays[array]?.name) {
      optionElements = selectArrays[array]?.array
    }
  }

  const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
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
      {!codeDisabled ? optionElements : selectArrays.valNoneList?.array}
    </select>
  )
}
