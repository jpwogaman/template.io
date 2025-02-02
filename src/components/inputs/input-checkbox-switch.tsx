import { type FC, type ChangeEvent } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/components/utils/tw'

export const InputCheckBoxSwitch: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction
}) => {
  const valChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (codeFullLocked) return
    onChangeFunction(event)
  }

  return (
    <div className='flex items-center justify-evenly'>
      <label
        htmlFor={id}
        title={
          id +
          '_currentValue: ' +
          (defaultValue === 'Value 2' ? 'Value 2' : 'Value 1')
        }
        className='relative inline-flex items-center'>
        <input
          id={id}
          type='checkbox'
          checked={defaultValue === 'Value 2'}
          disabled={codeFullLocked}
          value={defaultValue === 'Value 2' ? 'Value 1' : 'Value 2'} // this needs to be opposite
          onChange={(event) => valChange(event)}
          className='peer sr-only'
        />
        <div
          className={tw(
            'h-4 w-8 rounded-full bg-blue-600 transition-all duration-200 dark:bg-blue-800',
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
