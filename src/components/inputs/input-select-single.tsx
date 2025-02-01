import { type FC, type ChangeEvent, useState, useEffect } from 'react'
import { selectArrays, type InputComponentProps } from './index'
import tw from '@/components/utils/tw'
import { useMutations } from '../context'
import { itemInitKeyStringOrNumber } from './item-init-helpers'

export const InputSelectSingle: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
  defaultValue,
  options,
  onChangeFunction,
  textTypeValidator
}) => {
  const [value, setValue] = useState<string | number>(
    textTypeValidator === 'string'
      ? (defaultValue as string)
      : textTypeValidator === 'number'
        ? (defaultValue as number)
        : ''
  )

  let inputSelectOptionElements:
    | React.JSX.Element
    | string[]
    | number[]
    | undefined = selectArrays.valNoneList?.array

  for (const array in selectArrays) {
    if (options === selectArrays[array]?.name) {
      inputSelectOptionElements = selectArrays[array]?.array
    }
  }

  const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (textTypeValidator === 'string') {
      setValue(event.target.value)
    } else {
      setValue(parseInt(event.target.value))
    }

    onChangeFunction(event)
  }
  ////////
  const { clearState, setClearState } = useMutations()

  useEffect(() => {
    if (typeof clearState !== 'string') return

    if (id.includes(clearState + '_')) {
      itemInitKeyStringOrNumber({
        id,
        clearState,
        setValue
      })
    }

    return () => {
      setClearState(null)
    }
  }, [clearState])
  ///////

  return (
    <select
      id={id}
      disabled={codeFullLocked ?? codeDisabled}
      title={id + '_currentValue: ' + value}
      value={(codeFullLocked ?? codeDisabled) ? undefined : value}
      onChange={valChange}
      className={tw(
        'w-full overflow-scroll rounded-sm bg-inherit p-1',
        'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600',
        codeFullLocked || codeDisabled //NOSONAR
          ? 'cursor-not-allowed text-gray-400'
          : 'cursor-pointer'
      )}>
      {inputSelectOptionElements}
    </select>
  )
}
