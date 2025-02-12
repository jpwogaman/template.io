import React, {
  type FC,
  type ChangeEvent,
  useState,
  useLayoutEffect,
  useEffect,
  Fragment
} from 'react'
import { type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'
import { div } from 'motion/react-m'
import { HiOutlinePlus } from 'react-icons/hi2'

export const InputColorPicker: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction,
  isSelectedItem
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [open, setOpen] = useState(false)

  const valChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (codeFullLocked) return
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
    setOpen((prev) => !prev)
    if (!open) {
      console.log('close')
    } else {
      console.log('open')
    }
  }

  useLayoutEffect(() => {
    //setValue(defaultValue as string)
  }, [defaultValue])

  const [defaultColors, setDefaultColors] = useState([
    '#fff',
    '#000',
    '#ff0000',
    defaultValue as string
  ])

  //useEffect(() => {
  //  if (open) return
  //  const handleLeftClick = (e: MouseEvent) => {
  //    const colorPicker = document.getElementById('colorPicker')
  //    if (colorPicker && !colorPicker.contains(e.target as Node)) {
  //      close()
  //    }
  //  }

  //  window.addEventListener('click', handleLeftClick)
  //  return () => {
  //    window.addEventListener('click', handleLeftClick)
  //  }
  //}, [close])

  return (
    <div
      style={{
        //backgroundColor: isFocused
        //  ? defaultValueToRgb(defaultValue as string)
        //  : codeFullLocked
        //    ? defaultValueToRgb(defaultValue as string)
        //    : (defaultValue as string)
        backgroundColor: defaultValue as string
      }}
      className={twMerge(
        codeFullLocked || isFocused ? 'opacity-75' : '',
        'relative h-full w-full items-center'
      )}>
      <div
        id='colorPicker'
        className={twMerge(
          open && isSelectedItem
            ? 'absolute bottom-[34px] left-[22px] z-100 block h-30 w-40 rounded-sm bg-zinc-200 p-2'
            : 'hidden'
        )}>
        <div className='flex h-full flex-col justify-between gap-4'>
          <div className='flex gap-2'>
            {defaultColors.map((color) => {
              return (
                <div
                  key={color}
                  className='flex flex-col items-center gap-0.75'>
                  <button
                    type='button'
                    className={twMerge(
                      defaultValue === color
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer',
                      'h-4 w-4 rounded-sm shadow-sm shadow-black'
                    )}
                    style={{
                      backgroundColor: color
                    }}
                  />
                  {defaultValue === color && (
                    <hr className='h-1 w-full bg-black' />
                  )}
                </div>
              )
            })}
          </div>
          <div className='flex justify-between text-black'>
            <input
              type='text'
              className={twMerge(
                codeFullLocked
                  ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
                  : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
                'w-3/4 rounded-xs bg-inherit p-1 placeholder-zinc-400 outline-hidden transition-all duration-200 dark:placeholder-zinc-500',
                'bg-white focus-visible:cursor-text focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
              )}
            />
            <button
              type='button'
              className='flex w-6 cursor-pointer items-center justify-center rounded-sm border-2'>
              <HiOutlinePlus className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
      <label //NOSONAR
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue}`}
        className='relative flex h-full items-center'>
        <div
          className={twMerge(
            'h-[22px] w-full rounded-xs transition-all duration-200',
            codeFullLocked ? 'cursor-not-allowed' : 'cursor-pointer',
            isFocused
              ? 'ring-4 ring-indigo-600 outline-hidden'
              : 'ring-4 ring-transparent'
          )}
        />

        <input
          id={id}
          type='checkbox'
          autoComplete='off'
          checked={open}
          disabled={codeFullLocked}
          onChange={handleOpen}
          className='sr-only'
        />

        {/*<input
          id={id}
          type='color'
          autoComplete='off'
          disabled={codeFullLocked}
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
            //e.preventDefault()
            //e.stopPropagation()
            //handleOpen()
          }}
          className={twMerge('sr-only h-full w-full')}
          onChange={valChange}
        />*/}
      </label>
    </div>
  )
}
