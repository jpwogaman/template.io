import { type FC, type ChangeEvent, useState, useEffect } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/components/utils/tw'
import { useMutations } from '../context'
import { itemInitKeyBoolean } from './item-init-helpers'

export const InputCheckBoxSwitch: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction
}) => {
  const [isChecked, setIsChecked] = useState(defaultValue === 'Value 2')

  const valChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (codeFullLocked) return
    onChangeFunction(event)
    setIsChecked(!isChecked)
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
    <div className='flex items-center justify-evenly'>
      <label
        htmlFor={id}
        title={id + '_currentValue: ' + (isChecked ? 'Value 2' : 'Value 1')}
        className='relative inline-flex items-center'>
        <input
          id={id}
          type='checkbox'
          checked={isChecked}
          disabled={codeFullLocked}
          value={isChecked ? 'Value 2' : 'Value 1'}
          onChange={(event) => valChange(event)}
          className='peer sr-only'
        />
        <div
          className={tw(
            'h-4 w-8 rounded-full bg-blue-600 dark:bg-blue-800',
            "after:absolute after:left-[0px] after:top-[0px] after:h-4 after:w-4 after:rounded-full after:border after:transition-all after:content-['']",
            codeFullLocked
              ? 'cursor-not-allowed after:border-gray-400 after:bg-gray-400'
              : 'cursor-pointer after:border-white after:bg-white',
            'peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:peer-checked:bg-green-800'
          )}
        />
      </label>
    </div>
  )
}
