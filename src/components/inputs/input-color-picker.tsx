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
import { HiOutlinePlus } from 'react-icons/hi2'
import { useSelectedItem } from '../context'

export const InputColorPicker: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction,
  isSelectedItem
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [open, setOpen] = useState(false)

  const { settings, updateSettings } = useSelectedItem()

  const valChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (codeFullLocked) return
    onChangeFunction(event as unknown as ChangeEvent<HTMLInputElement>)
  }

  const [defaultColors, setDefaultColors] = useState<string[]>([])
  const [colorAdd, setColorAdd] = useState<string | null>(null)

  useLayoutEffect(() => {
    setDefaultColors([...settings.default_colors])
  }, [settings.default_colors])

  const addColorToSettings = () => {
    if (!colorAdd || settings.default_colors.includes(colorAdd)) return
    const hexColorRegex = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/

    if (!hexColorRegex.test(colorAdd)) {
      alert('Colors must be valid hex code.')
      console.error('Colors must be valid hex code.')
      return
    }

    const formattedColor = colorAdd.startsWith('#') ? colorAdd : `#${colorAdd}`
    const newColors = [...settings.default_colors, formattedColor]
    void updateSettings({
      key: 'default_colors',
      value: newColors
    })

    setDefaultColors(newColors)
    setColorAdd(null)
  }

  return (
    <div
      style={{
        backgroundColor: defaultValue as string
      }}
      className={twMerge(
        (codeFullLocked || isFocused) && !open ? 'opacity-75' : '',
        'relative h-full w-full items-center'
      )}>
      <div
        id='colorPicker'
        className={twMerge(
          open && isSelectedItem
            ? 'absolute bottom-[34px] left-[22px] z-100 block max-h-60 min-h-32 w-40 rounded-sm bg-zinc-200 p-2'
            : 'hidden'
        )}>
        <div className='flex h-full flex-col justify-between gap-4'>
          <div className='flex flex-wrap gap-x-2 gap-y-1.5'>
            {defaultColors.map((color) => {
              return (
                <div
                  key={color}
                  className='flex flex-col items-center gap-0.75'>
                  <button
                    type='button'
                    tabIndex={0}
                    title={color}
                    id={'colorPicker_' + color}
                    className={twMerge(
                      defaultValue === color
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer',
                      'h-4 w-4 rounded-sm shadow-sm shadow-black',
                      'focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                    )}
                    style={{
                      backgroundColor: color.startsWith('#')
                        ? color
                        : `#${color}`
                    }}
                    onClick={valChange}
                    value={color}
                  />

                  <hr
                    className={twMerge(
                      'h-1 w-full',
                      defaultValue === color ? 'bg-black' : ''
                    )}
                  />
                </div>
              )
            })}
          </div>
          <div className='mt-[15%] flex justify-between text-black'>
            <input
              type='text'
              id={id + 'colorPickerInput'}
              placeholder={colorAdd ?? ''}
              className={twMerge(
                codeFullLocked
                  ? 'text-gray-400 hover:cursor-not-allowed hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500'
                  : 'hover:cursor-text hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600',
                'h-full w-3/4 rounded-xs bg-inherit p-1 placeholder-zinc-400 outline-hidden transition-all duration-200 dark:placeholder-zinc-500',
                'bg-white focus-visible:cursor-text focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addColorToSettings()
                }
              }}
              onChange={(e) => {
                setColorAdd(e.target.value)
              }}
            />
            <button
              type='button'
              className='flex w-6 cursor-pointer items-center justify-center rounded-sm border-2 outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
              onClick={addColorToSettings}>
              <HiOutlinePlus className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
      <label //NOSONAR
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue}`}
        className='relative flex h-full w-full items-center'>
        <div
          className={twMerge(
            'h-[75%] w-full rounded-xs transition-all duration-200',
            codeFullLocked ? 'cursor-not-allowed' : 'cursor-pointer',
            isFocused ? 'ring-4 ring-indigo-600 outline-hidden' : ''
          )}
        />
        <input
          id={id}
          type='checkbox'
          autoComplete='off'
          checked={open}
          disabled={codeFullLocked}
          className='sr-only'
          onChange={() => setOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setOpen((prev) => !prev)
            } else if (e.key === 'ArrowDown') {
              setOpen(false)
            } else if (e.key === 'ArrowUp') {
              setOpen(false)
            } else if (e.key === 'Tab' && open) {
              e.preventDefault()
              const colorPickerInput = document.getElementById(
                id + 'colorPickerInput'
              )
              colorPickerInput?.focus()
            } else {
              return
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </label>
    </div>
  )
}
