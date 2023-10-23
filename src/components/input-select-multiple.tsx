import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import { SelectList, selectArrays } from '@/components/input-arrays'
import tw from '@/utils/tw'

interface InputSelectMultipleProps {
  id: string | undefined
  options: string | number
  codeDisabled?: boolean
  onChangeInputSwitch?: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void | undefined
  children?: ReactNode
  defaultValue: string
}

export const InputSelectMultiple: FC<InputSelectMultipleProps> = ({
  onChangeInputSwitch: onSelect,
  codeDisabled,
  id,
  options,
  defaultValue
}) => {
  const [value, setValue] = useState<string[]>([])

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

    if (options === 'artRngsArray') {
      inputSelectOptionElements = (
        <SelectList rngName={JSON.parse(defaultValue)} />
      )
    }
  }

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const newValueIsAlreadySelected = value.includes(event.target.value)
    const newValueFiltered = value.filter((val) => val !== event.target.value)

    console.log('hi')

    if (newValueIsAlreadySelected) {
      setValue(newValueFiltered)
      if (onSelect) {
        onSelect({
          ...event,
          target: { ...event.target, value: JSON.stringify(newValueFiltered) }
        })
      }
    }

    if (!newValueIsAlreadySelected) {
      setValue([...value, event.target.value])
      if (onSelect) {
        onSelect({
          ...event,
          target: {
            ...event.target,
            value: JSON.stringify([...value, event.target.value])
          }
        })
      }
    }
  }

  return (
    <select
      className={tw(
        'w-full overflow-scroll bg-inherit p-[4.5px] text-zinc-900 outline-offset-4 outline-green-600 focus:bg-white focus:text-zinc-900 dark:outline-green-800',
        codeDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      value={!codeDisabled ? value : undefined}
      multiple
      disabled={codeDisabled}
      id={id}
      onChange={valChange}>
      {inputSelectOptionElements}
    </select>
  )
}
