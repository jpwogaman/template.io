import { type FC, type ChangeEvent } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/components/utils/tw'

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
    <label
      htmlFor={id}
      title={id + '_currentValue: ' + `${defaultValue as boolean}`}
      className='relative items-center'>
      <input
        id={id}
        type='checkbox'
        checked={defaultValue as boolean}
        disabled={codeFullLocked}
        value={(defaultValue as boolean) ? 'false' : 'true'}
        onChange={(event) => valChange(event)}
        className={tw(
          'w-full p-1 text-zinc-900 transition-all duration-200',
          codeFullLocked ? 'cursor-not-allowed bg-zinc-300' : 'cursor-pointer'
        )}
      />
    </label>
  )
}
