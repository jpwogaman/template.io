import { type FC, type ChangeEvent, useState } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputColorPicker: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (codeFullLocked) return
    if (!onChangeFunction) return
    onChangeFunction(event)
  }
  return (
    <div
      style={{ backgroundColor: defaultValue as string }}
      className='relative h-full w-full items-center'>
      <div
        className={tw(
          'absolute top-0.5  h-full max-h-[26px] w-full rounded-sm transition-all duration-200',
          isFocused
            ? 'z-[50] outline-none ring-4 ring-indigo-600'
            : 'z-0 ring-4 ring-transparent'
        )}
      />
      <label
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue}`}
        className='relative h-full items-center'>
        <input
          type='color'
          disabled={codeFullLocked}
          defaultValue={defaultValue as string}
          onFocus={() => setIsFocused(true)}
          //onBlur={() => setIsFocused(false)}
          className={tw(
            codeFullLocked ? 'cursor-not-allowed' : 'cursor-pointer',
            'h-full w-full opacity-0'
          )}
          onChange={valChange}
        />
      </label>
    </div>
  )
}
