import { type FC, type ChangeEvent, useEffect, useState } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/components/utils/tw'
import { useMutations } from '../context'
import { itemInitKeyBoolean } from './item-init-helpers'

export const InputCheckBox: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction
}) => {
  const [isChecked, setIsChecked] = useState(defaultValue as boolean)

  const valChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (codeFullLocked) return
    onChangeFunction(event)
    setIsChecked((prev) => !prev)
  }

  ////////
  const { clearState, setClearState } = useMutations()

  useEffect(() => {
    if (typeof clearState !== 'string') return

    if (id.includes(clearState + '_')) {
      itemInitKeyBoolean({
        id,
        clearState,
        setValue: setIsChecked
      })
    }

    return () => {
      setClearState(null)
    }
  }, [clearState])
  ///////

  return (
    <label
      htmlFor={id}
      title={id + '_currentValue: ' + `${isChecked}`}
      className='relative items-center'>
      <input
        id={id}
        type='checkbox'
        checked={isChecked}
        disabled={codeFullLocked}
        value={isChecked ? 'false' : 'true'}
        onChange={(event) => valChange(event)}
        className={tw(
          'w-full p-1 text-zinc-900',
          codeFullLocked ? 'cursor-not-allowed bg-zinc-300' : 'cursor-pointer'
        )}
      />
    </label>
  )
}
