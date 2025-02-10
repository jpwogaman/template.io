import { type FC, type ChangeEvent } from 'react'
import { type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'

export const InputCheckBox: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  codeDisabled,
  defaultValue,
  onChangeFunction
}) => {
  const valChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (codeFullLocked || codeDisabled) return
    onChangeFunction(event)
  }

  return (
    <div className='flex items-center justify-center'>
      <label //NOSONAR
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue as boolean}`}
        className='relative flex items-center'>
        <input
          type='checkbox'
          id={id}
          checked={defaultValue as boolean}
          disabled={codeFullLocked}
          value={(defaultValue as boolean) ? 'false' : 'true'}
          onChange={(event) => valChange(event)}
          className={twMerge(
            codeFullLocked
              ? 'cursor-not-allowed bg-zinc-700 checked:bg-zinc-500'
              : 'cursor-pointer bg-zinc-700 checked:bg-zinc-300',
            'border-zinc-500 checked:border-none',
            'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden',
            'peer h-4 w-4 appearance-none rounded-xs border transition-all duration-200 hover:shadow-md'
          )}
        />
        <span className='pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-zinc-600 opacity-0 peer-checked:opacity-100'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-3 w-3'
            viewBox='0 0 20 20'
            fill='currentColor'
            stroke='currentColor'
            strokeWidth='1'>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'></path>
          </svg>
        </span>
      </label>
    </div>
  )
}