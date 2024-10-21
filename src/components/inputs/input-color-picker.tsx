import { type FC, type ChangeEvent, useState } from 'react'
import { type InputComponentProps } from './index'
import tw from '@/utils/tw'

export const InputColorPicker: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  defaultValue,
  onChangeFunction
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const valChange = (
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    if (codeDisabled) return
    if (!onChangeFunction) return
    onChangeFunction(event)
  }

  const defaultValueToRgb = (defaultValue: string) => {
    const hex = defaultValue.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return `rgba(${r},${g},${b}, 0.75)`
  }

  const handleOpen = () => {
    setOpen(!open)
    if (!open) {
      console.log('close')
    } else {
      console.log('open')
    }
  }

  return (
    <div
      style={{
        backgroundColor: isFocused
          ? defaultValueToRgb(defaultValue as string)
          : codeDisabled
            ? defaultValueToRgb(defaultValue as string)
            : (defaultValue as string)
      }}
      className='relative h-full w-full items-center'>
      <label
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue}`}
        className='relative flex h-full items-center'>
        <div
          className={tw(
            'h-[22px] w-full rounded-sm transition-all duration-200',
            codeDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
            isFocused
              ? 'outline-none ring-4 ring-indigo-600'
              : 'ring-4 ring-transparent'
          )}
        />
        <input
          id={id}
          type='color'
          disabled={codeDisabled}
          defaultValue={defaultValue as string}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              handleOpen()
            }
          }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleOpen()
          }}
          className={tw('sr-only h-full w-full')}
          onChange={valChange}
        />
      </label>
    </div>
  )
}
