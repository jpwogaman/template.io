import { type FC, type ChangeEvent } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputSelectMultiple: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  defaultValue,
  options,
  onChangeFunction
}) => {
  //defaultValue and options for this select will be either ranges or art_layers
  //ranges: "[\"T_{}_FR_0\"]"
  //art_layers: "[\"\"]"

  const value =
    typeof defaultValue === 'string'
      ? (JSON.parse(defaultValue) as string[])
      : []

  const shortenedSubComponentId = (initialId: string) => {
    return `${
      //initialId.split('_')[2]}_${
      parseInt(initialId.split('_')[3]!)
    }`
  }

  let inputSelectOptionElements:
    | React.JSX.Element
    | React.JSX.Element[]
    | string[]
    | number[]
    | undefined = selectArrays.valNoneList?.array

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const newValueIsAlreadySelected = value.includes(event.target.value)
    const newValueFiltered = value.filter(
      (val: string) => val !== event.target.value
    )

    if (!onChangeFunction) return
    if (newValueIsAlreadySelected) {
      onChangeFunction({
        ...event,
        target: { ...event.target, value: JSON.stringify(newValueFiltered) }
      })
    } else {
      onChangeFunction({
        ...event,
        target: {
          ...event.target,
          value: JSON.stringify([...value, event.target.value])
        }
      })
    }
  }

  //const parsedOptions = JSON.parse(options!) as string[]

  //inputSelectOptionElements = parsedOptions.map((name: string) => (
  //  // this should be a <li> element, but SONARLINT doesn't like it
  //  <button
  //    key={name}
  //    title={id + '_' + name + '_currentlySelected: ' + value.includes(name)}
  //    className={tw(
  //      value.includes(name) && !codeDisabled ? 'font-bold text-red-700' : '',
  //      value.includes(name) && codeDisabled ? 'font-bold text-red-800' : ''
  //    )}
  //    onKeyDown={(e) => {
  //      e.preventDefault()
  //      console.log('keydown')
  //    }}
  //    onClick={(event) => {
  //      event.preventDefault()
  //      valChange({
  //        ...event,
  //        target: { ...event.target, value: name }
  //      } as unknown as ChangeEvent<HTMLSelectElement>)
  //    }}>
  //    {shortenedSubComponentId(name)}
  //  </button>
  //))

  return (
    <ul
      id={id}
      className={tw(
        'max-h-[32px] w-full overflow-x-hidden overflow-y-scroll bg-inherit p-[4.5px] outline-offset-4 outline-green-600 focus:bg-white focus:text-zinc-900 dark:outline-green-800',
        codeDisabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer',
        'flex flex-wrap gap-2'
      )}>
      {/*{inputSelectOptionElements}*/}
    </ul>
  )
}
