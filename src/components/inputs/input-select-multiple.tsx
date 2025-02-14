import React, {
  type FC,
  type ChangeEvent,
  useState,
  useLayoutEffect,
  useCallback
} from 'react'
import { type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'
import { useSelectArraysContext, type SelectValuesKeys } from '../context'

export const InputSelectMultiple: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction,
  options,
  isSelectedSubItem
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [open, setOpen] = useState(false)

  const [possibleValues, setPossibleValues] = useState<string[]>([])
  const [buttonList, setButtonList] = useState<React.JSX.Element | undefined>(
    undefined
  )

  const { selectValues } = useSelectArraysContext()
  const [activeValues, setActiveValues] = useState<Set<string>>(new Set())

  const valChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (codeFullLocked) return

      const target = event.target as HTMLButtonElement
      const value = target.value

      setActiveValues((prev) => {
        const newSet = new Set(prev)

        if (options === 'artRngsArray') {
          if (newSet.has(value) && newSet.size > 1) {
            newSet.delete(value)
          } else if (newSet.has(value) && newSet.size === 1) {
            alert('Each Articulation must have one range!')
            return prev
          } else {
            newSet.add(value)
          }
        }

        if (options === 'artLayersArray') {
          if (newSet.has(value)) {
            newSet.delete(value)
          } else {
            newSet.add(value)
          }
        }

        const newValuesArray = Array.from(newSet).sort((a, b) => {
          const aParts = a.split('_')
          const bParts = b.split('_')

          const aNumber = parseInt(aParts[3]!)
          const bNumber = parseInt(bParts[3]!)

          return aNumber - bNumber
        })
        const jsonValue = JSON.stringify(newValuesArray)

        const syntheticEvent = {
          ...event,
          target: { ...event.target, value: jsonValue }
        } as unknown as ChangeEvent<HTMLInputElement>

        onChangeFunction(syntheticEvent)
        return newSet
      })
    },
    [options, setActiveValues, onChangeFunction, codeFullLocked]
  )

  const shortenedSubItemId = (initialId: string) => {
    return `${initialId.split('_')[2]}_${parseInt(initialId.split('_')[3]!)}`
  }

  const getSelectList = useCallback(
    (name: SelectValuesKeys) => {
      const values = selectValues[name]
      setPossibleValues(values as string[])

      const useShortId = name === 'artLayersArray' || name === 'artRngsArray'

      return (
        <>
          {values.map((value, index) => {
            return (
              <div
                key={`${value}_${index}`}
                className='w-1/3 max-w-1/3 grow-1 p-0.5'>
                <button
                  type='button'
                  tabIndex={0}
                  title={value.toString()}
                  id={id + 'rangeLayerPicker' + value.toString()}
                  className={twMerge(
                    activeValues.has(value.toString()) ? 'bg-indigo-200' : '',
                    'w-full cursor-pointer rounded-sm p-1 text-left text-black shadow-sm shadow-black',
                    'focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                  )}
                  onClick={valChange}
                  onKeyDown={(e) => {
                    if (e.shiftKey && e.key === 'Tab' && value === values[0]) {
                      setOpen(false)
                    }
                  }}
                  value={value.toString()}>
                  {useShortId ? shortenedSubItemId(value.toString()) : value}
                </button>
              </div>
            )
          })}
        </>
      )
    },
    [selectValues, setPossibleValues, activeValues, id, valChange]
  )

  useLayoutEffect(() => {
    if (!defaultValue) return

    try {
      const fixedJson = defaultValue.toString().replace(/'/g, '"')
      const parsedArray = JSON.parse(fixedJson) as string[]
      setActiveValues(new Set(parsedArray))
    } catch (error) {
      console.error(
        'Error parsing defaultValue:',
        error,
        'Raw Value:',
        defaultValue
      )
    }
  }, [defaultValue])

  useLayoutEffect(() => {
    const list = getSelectList(options ?? 'valNoneList')
    setButtonList(list)
  }, [options, getSelectList])

  const isOnlyEmpty = activeValues.size === 1 && activeValues.has('')
  const activeMinusEmpty =
    activeValues.size > 1 && activeValues.has('')
      ? activeValues.size - 1
      : activeValues.size

  return (
    <div className={twMerge('relative h-6 w-full')}>
      <div
        id='colorPicker'
        className={twMerge(
          open && isSelectedSubItem
            ? 'absolute right-[2px] bottom-[27px] z-100 block max-h-60 w-40 rounded-sm bg-zinc-300 p-2 dark:bg-zinc-200'
            : 'hidden'
        )}>
        <div className='flex h-full flex-wrap'>{buttonList}</div>
      </div>
      <label
        htmlFor={id}
        title={id + '_currentValue: ' + `${defaultValue}`}
        className={twMerge(
          'absolute flex h-full w-full items-center rounded-xs transition-all duration-200',
          codeFullLocked ? 'cursor-not-allowed' : 'cursor-pointer',
          isFocused
            ? 'bg-white text-black ring-4 ring-indigo-600 outline-hidden'
            : ''
        )}>
        {activeValues.size > 0 && !isOnlyEmpty
          ? `(x${activeMinusEmpty})`
          : shortenedSubItemId(possibleValues[0] ?? '')}

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
            } else if (e.shiftKey && e.key === 'Tab' && open) {
              e.preventDefault()
              const rangeLayerPicker = document.getElementById(
                id +
                  'rangeLayerPicker' +
                  possibleValues[possibleValues.length - 1]
              )
              rangeLayerPicker?.focus()
            } else if (!e.shiftKey && e.key === 'Tab' && open) {
              setOpen(false)
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
