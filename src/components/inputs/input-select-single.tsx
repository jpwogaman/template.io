import { type FC, type ChangeEvent, useState } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputSelectSingle: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  defaultValue,
  options,
  onChangeFunction
}) => {
  const [value, setVal] = useState<string | number>(
    (defaultValue as unknown as string | number) ?? ''
  )

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

    if (onChangeFunction) {
      onChangeFunction(event)
    }
  }

  return (
    <select
      id={id}
      disabled={codeDisabled}
      title={id + '_currentValue: ' + value}
      value={!codeDisabled ? value : undefined}
      onChange={valChange}
      className={tw(
        'w-full overflow-scroll bg-inherit outline-offset-4 outline-green-600 focus:bg-white focus:text-zinc-900 dark:outline-green-800',
        codeDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}>
      {inputSelectOptionElements}
    </select>
  )
}
