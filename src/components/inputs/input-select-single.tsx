import { type FC, type ChangeEvent, useState } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputSelectSingle: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
  defaultValue,
  options,
  onChangeFunction
}) => {
  const [value, setValue] = useState<string | number>(
    (defaultValue as unknown as string | number) ?? ''
  )

  let inputSelectOptionElements:
    | React.JSX.Element
    | string[]
    | number[]
    | undefined = selectArrays.valNoneList?.array

  //if (!codeDisabled) {
  for (const array in selectArrays) {
    if (options === selectArrays[array]?.name) {
      inputSelectOptionElements = selectArrays[array]?.array
    }
  }
  //}

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setValue(event.target.value)

    if (onChangeFunction) {
      onChangeFunction(event)
    }
  }

  return (
    <select
      id={id}
      disabled={codeFullLocked ?? codeDisabled}
      title={id + '_currentValue: ' + value}
      value={codeFullLocked ?? codeDisabled ? undefined : value}
      onChange={valChange}
      className={tw(
        'w-full overflow-scroll rounded-sm bg-inherit p-1',
        'focus-visible:cursor-text focus-visible:bg-white focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600',
        codeFullLocked || codeDisabled //NOSONAR
          ? 'cursor-not-allowed text-gray-400'
          : 'cursor-pointer'
      )}>
      {inputSelectOptionElements}
    </select>
  )
}
