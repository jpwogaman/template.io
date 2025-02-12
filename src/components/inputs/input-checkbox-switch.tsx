import { type FC, type ChangeEvent } from 'react'
import { type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'

export const InputCheckBoxSwitch: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  codeDisabled,
  defaultValue,
  onChangeFunction
}) => {
  const valChange = (
    event: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => {
    if (codeFullLocked || codeDisabled) return
    onChangeFunction(event as ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className='flex items-center justify-evenly'>
      <label //NOSONAR
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
          autoComplete='off'
          checked={defaultValue === 'Value 2'}
          disabled={codeFullLocked}
          value={defaultValue === 'Value 2' ? 'Value 1' : 'Value 2'} // this needs to be opposite
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            valChange(e)
          }}
          onChange={(e) => valChange(e)}
          className='peer sr-only'
        />
        <div
          className={twMerge(
            // background, main
            'h-4 w-8 rounded-full transition-all duration-200 peer-focus-visible:outline-hidden',
            'bg-blue-600 dark:bg-blue-800',
            'peer-focus-visible:bg-blue-400 dark:peer-focus-visible:bg-blue-300',
            'peer-checked:bg-green-600 dark:peer-checked:bg-green-800',
            'peer-checked:peer-focus-within:bg-green-400 dark:peer-checked:peer-focus-visible:bg-green-600',
            'peer-focus-visible:ring-3 peer-focus-visible:ring-indigo-600',

            // switch circle, main
            "after:absolute after:top-[0px] after:left-[0px] after:h-4 after:w-4 after:rounded-full after:border after:transition-all after:content-['']",
            'peer-checked:after:translate-x-full peer-checked:after:border-white',
            'peer-focus-visible:after:border-gray-100 peer-focus-visible:after:bg-gray-100',

            //
            codeFullLocked
              ? 'cursor-not-allowed after:border-gray-400 after:bg-gray-400'
              : 'cursor-pointer after:border-white after:bg-white'
          )}
        />
      </label>
    </div>
  )
}
