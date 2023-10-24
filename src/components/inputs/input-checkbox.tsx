import { type FC, type ChangeEvent, type ReactNode, useState } from 'react'
import tw from '@/utils/tw'

interface InputCheckBoxProps {
  id: string | undefined
  title?: string
  defaultValue?: string
  artFad?: boolean
  toggle?: boolean
  showVals?: boolean
  codeDisabled?: boolean
  children?: ReactNode
  onChangeFunction?: (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void | undefined
}

export const InputCheckBox: FC<InputCheckBoxProps> = ({
  onChangeFunction,
  title,
  defaultValue,
  id,
  codeDisabled
}) => {
  const [isChecked, setChecked] = useState<boolean>(defaultValue === 'false')

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (!codeDisabled) {
      if (onChangeFunction) {
        onChangeFunction(event)
      }

      setChecked(!isChecked)
    }
  }
  return (
    <label
      htmlFor={id}
      title={id + '_currentValue: ' + `${isChecked}`}
      className='relative items-center'>
      <input
        id={id}
        type='checkbox'
        disabled={codeDisabled}
        value={isChecked ? 'false' : 'true'}
        onChange={(event) => valChange(event)}
        className={tw(
          'w-full p-1 text-zinc-900',
          codeDisabled ? 'cursor-not-allowed bg-zinc-300' : 'cursor-pointer'
        )}
      />
    </label>
  )
}
