import { type FC, type ChangeEvent } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputCheckBox: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction
}) => {
  const isChecked =
    typeof defaultValue === 'boolean' ? defaultValue : defaultValue === 'true'

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (codeFullLocked) return
    if (!onChangeFunction) return
    onChangeFunction(event)
  }
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
