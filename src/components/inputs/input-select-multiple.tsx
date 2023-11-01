import { type FC, type ChangeEvent, useState } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputSelectMultiple: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  defaultValue,
  options,
  onChangeFunction
}) => {
  const [value, setValue] = useState<string[]>(
    JSON.parse(defaultValue as unknown as string) ?? []
  )

  const shortenedSubComponentId = (initialId: string) => {
    return `${initialId.split('_')[2]}_${
      parseInt(initialId.split('_')[3] as string) + 1
    }`
  }

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

      if (onChangeFunction) {
        onChangeFunction({
          ...event,
          target: { ...event.target, value: JSON.stringify(newValueFiltered) }
        })
      }
    } else {
      setValue([...value, event.target.value])
      if (onChangeFunction) {
        onChangeFunction({
          ...event,
          target: {
            ...event.target,
            value: JSON.stringify([...value, event.target.value])
          }
        })
      }
    }
  }

  inputSelectOptionElements = (
    <>
      {JSON.parse(options as string).map((name: string) => (
        <li
          key={name}
          title={
            id + '_' + name + '_currentlySelected: ' + value.includes(name)
          }
          className={tw(
            value.includes(name) && !codeDisabled
              ? 'font-bold text-red-700'
              : '',
            value.includes(name) && codeDisabled ? 'font-bold text-red-800' : ''
          )}
          onKeyDown={() => console.log('keydown')}
          onClick={(event) =>
            valChange({
              ...event,
              target: { ...event.target, value: name }
            } as unknown as ChangeEvent<HTMLSelectElement>)
          }>
          {shortenedSubComponentId(name)}
        </li>
      ))}
    </>
  )

  return (
    <ul
      id={id}
      className={tw(
        'w-full overflow-x-hidden overflow-y-scroll bg-inherit p-[4.5px]  outline-offset-4 outline-green-600 focus:bg-white focus:text-zinc-900 dark:outline-green-800',
        codeDisabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'
      )}>
      {inputSelectOptionElements}
    </ul>
  )
}
