import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import { selectArrays } from './index'
import tw from '@/utils/tw'

interface InputSelectMultipleProps {
  id: string | undefined
  options: string | number
  codeDisabled?: boolean
  onChangeInputSwitch?: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    //| React.MouseEvent<HTMLOptionElement, MouseEvent>
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
  const [value, setValue] = useState<string[]>(JSON.parse(defaultValue) ?? [])

  let inputSelectOptionElements:
    | React.JSX.Element
    | string[]
    | number[]
    | undefined = selectArrays.valNoneList?.array

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const newValueIsAlreadySelected = value.includes(event.target.value)
    const newValueFiltered = value.filter((val) => val !== event.target.value)

    if (newValueIsAlreadySelected) {
      setValue(newValueFiltered)

      if (onSelect) {
        onSelect({
          ...event,
          target: { ...event.target, value: JSON.stringify(newValueFiltered) }
        })
      }
    } else {
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

  if (!codeDisabled) {
    inputSelectOptionElements = (
      <>
        {JSON.parse(options as string).map((name: string) => (
          <li
            key={name}
            title={
              id + '_' + name + '_currentlySelected: ' + value.includes(name)
            }
            className={tw(value.includes(name) ? 'font-bold text-red-700' : '')}
            onClick={(event) =>
              valChange({
                ...event,
                target: { ...event.target, value: name }
              } as unknown as ChangeEvent<HTMLSelectElement>)
            }>
            {name}
          </li>
        ))}
      </>
    )
  }

  return (
    <ul
      className={tw(
        'w-full overflow-x-hidden overflow-y-scroll bg-inherit p-[4.5px] text-zinc-900 outline-offset-4 outline-green-600 focus:bg-white focus:text-zinc-900 dark:outline-green-800',
        codeDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      )}
      onChange={() => {}}
      id={id}>
      {inputSelectOptionElements}
    </ul>
  )
}
