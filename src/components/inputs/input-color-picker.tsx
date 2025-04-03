import React, {
  type FC,
  type ChangeEvent,
  useState,
  useLayoutEffect,
  useCallback
} from 'react'
import { type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'
import { HiOutlinePlus, HiXMark } from 'react-icons/hi2'
import { useKeyboard, useSelectedItem } from '@/components/context'

export const InputColorPicker: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction,
  isSelectedItem
}) => {
  const [colorPickerCellIsFocused, setColorPickerCellIsFocused] =
    useState(false)
  const [defaultColors, setDefaultColors] = useState<string[]>([])

  const [colorPickerPopUpOpen, setColorPickerPopUpOpen] = useState(false)
  const [colorDeletePopUpOpen, setColorDeletePopUpOpen] = useState(false)
  const [colorAddId, setColorAddId] = useState<string | null>(null)
  const [colorDeleteId, setColorDeleteId] = useState<string | null>(null)

  const { settings, updateSettings } = useSelectedItem()
  const { isCtrlPressed } = useKeyboard()

  const valChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (codeFullLocked) return
    onChangeFunction(event as unknown as ChangeEvent<HTMLInputElement>)
  }

  useLayoutEffect(() => {
    setDefaultColors([...settings.default_colors])
  }, [settings.default_colors])

  const addColorToSettings = () => {
    if (!colorAddId) return

    const hexColorRegex = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
    const colorList = colorAddId.split(',').map((color) => color.trim())

    const invalidColors = colorList.filter(
      (color) => !hexColorRegex.test(color)
    )
    if (invalidColors.length > 0) {
      alert(`Invalid hex colors: ${invalidColors.join(', ')}`)
      console.error(`Invalid hex colors: ${invalidColors.join(', ')}`)
      return
    }

    const formattedColors = colorList.map((color) =>
      color.startsWith('#') ? color : `#${color}`
    )

    const newColors = [
      ...new Set([...settings.default_colors, ...formattedColors])
    ]

    if (newColors.length > 100) {
      alert('Template.io only supports up to 100 colors.')
      console.error('Template.io only supports up to 100 colors.')
    }

    void updateSettings({
      key: 'default_colors',
      value: newColors.slice(0, 100)
    })

    setDefaultColors(newColors.slice(0, 100))
    setColorAddId(null)
  }

  const deleteColorFromSettings = (colorManual?: string) => {
    if (!colorDeleteId && !colorManual) return

    let newColors: string[] = []

    if (colorManual) {
      newColors = settings.default_colors.filter(
        (color) => color !== colorManual
      )
    } else if (colorDeleteId) {
      newColors = settings.default_colors.filter(
        (color) => color !== colorDeleteId
      )
    }

    void updateSettings({
      key: 'default_colors',
      value: newColors
    })

    setDefaultColors(newColors)
    setColorDeleteId(null)
  }

  const getSelectedItemDistanceFromTrackListHead = useCallback(() => {
    const selectedItem = document.getElementById(id)
    const trackListHead = document.getElementById('trackListHead')
    const trackListHeadBottom =
      trackListHead?.getBoundingClientRect().bottom ?? 0
    const selectedItemTop = selectedItem?.getBoundingClientRect().top ?? 0
    const selectedItemHeight = selectedItem?.getBoundingClientRect().height ?? 0

    const selectedItemDistanceFromTrackListHead =
      selectedItemTop - trackListHeadBottom + selectedItemHeight

    return selectedItemDistanceFromTrackListHead
  }, [id])

  return (
    <div
      style={{
        backgroundColor: defaultValue as string
      }}
      className={twMerge(
        (codeFullLocked || colorPickerCellIsFocused) && !colorPickerPopUpOpen
          ? 'opacity-75'
          : '',
        'relative h-full w-full items-center'
      )}>
      {colorPickerPopUpOpen && isSelectedItem && (
        <div
          id='colorPickerPopUp'
          className={twMerge(
            getSelectedItemDistanceFromTrackListHead() < 160
              ? 'top-[34px]'
              : 'bottom-[34px]',
            'absolute left-[22px] z-49 block max-h-112 min-h-32 w-40 rounded-sm bg-zinc-300 p-2 dark:bg-zinc-200'
          )}
          onClick={(e) => {
            const colorDeletePopUp = document.getElementById('colorDeletePopUp')

            if (colorDeletePopUp?.contains(e.target as Node)) {
              return
            }

            setColorDeletePopUpOpen(false)
          }}>
          <div className='flex h-full flex-col justify-between gap-4'>
            <div className='flex flex-wrap gap-x-2 gap-y-1.5'>
              {defaultColors.map((color) => {
                return (
                  <div
                    key={color}
                    className='relative flex flex-col items-center gap-0.75'>
                    {colorDeletePopUpOpen &&
                      colorDeleteId === color &&
                      colorDeleteId !== defaultValue && (
                        <button
                          id='colorDeletePopUp'
                          onClick={() => {
                            deleteColorFromSettings()
                            setColorDeletePopUpOpen(false)
                          }}
                          className='absolute bottom-[25px] cursor-pointer rounded-sm border border-black bg-zinc-300 text-black'>
                          <HiXMark className='h-4 w-4' />
                        </button>
                      )}
                    <button
                      type='button'
                      tabIndex={0}
                      title={color}
                      id={'colorPicker_' + color}
                      value={color}
                      onContextMenu={() => {
                        setColorDeletePopUpOpen(true)
                        setColorDeleteId(color)
                      }}
                      onClick={(e) => {
                        if (e.ctrlKey) {
                          deleteColorFromSettings(color)
                        } else {
                          valChange(e)
                        }
                      }}
                      style={{
                        backgroundColor: color.startsWith('#')
                          ? color
                          : `#${color}`,
                        cursor:
                          defaultValue === color
                            ? 'not-allowed'
                            : isCtrlPressed
                              ? "url('/close-stroke.svg') 8 8, auto"
                              : 'pointer'
                      }}
                      className={twMerge(
                        'h-4 w-4 rounded-sm shadow-sm shadow-black',
                        'focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                      )}
                    />

                    <hr
                      className={twMerge(
                        'h-0.75 w-full border-none',
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
                value={colorAddId ?? ''}
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
                  setColorAddId(e.target.value)
                }}
              />
              <button
                id='addColorButton'
                type='button'
                className='flex w-6 cursor-pointer items-center justify-center rounded-sm border-2 outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                onClick={addColorToSettings}>
                <HiOutlinePlus className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      )}
      <label //NOSONAR
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue as string}`}
        className='relative flex h-full w-full items-center'>
        <div
          className={twMerge(
            'h-[75%] w-full rounded-xs transition-all duration-200',
            codeFullLocked ? 'cursor-not-allowed' : 'cursor-pointer',
            colorPickerCellIsFocused
              ? 'ring-4 ring-indigo-600 outline-hidden'
              : ''
          )}
        />
        <input
          id={id}
          type='checkbox'
          autoComplete='off'
          checked={colorPickerPopUpOpen}
          disabled={codeFullLocked}
          className='sr-only'
          onChange={() => setColorPickerPopUpOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setColorPickerPopUpOpen((prev) => !prev)
            } else if (e.key === 'ArrowDown') {
              setColorPickerPopUpOpen(false)
            } else if (e.key === 'ArrowUp') {
              setColorPickerPopUpOpen(false)
            } else if (e.key === 'Tab' && colorPickerPopUpOpen) {
              e.preventDefault()
              const colorPickerInput = document.getElementById(
                id + 'colorPickerInput'
              )
              colorPickerInput?.focus()
            } else {
              return
            }
          }}
          onFocus={() => setColorPickerCellIsFocused(true)}
          onBlur={() => setColorPickerCellIsFocused(false)}
        />
      </label>
    </div>
  )
}
