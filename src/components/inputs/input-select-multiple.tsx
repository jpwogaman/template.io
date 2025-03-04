import React, {
  type FC,
  type ChangeEvent,
  useState,
  useLayoutEffect,
  useCallback,
  useEffect
} from 'react'
import { twMerge } from 'tailwind-merge'
import {
  useSelectArraysContext,
  type SelectValuesKeys
} from '@/components/context'
import { InputCheckBox, type InputComponentProps } from '@/components/inputs'
import { HiCheckCircle } from 'react-icons/hi2'

export const InputSelectMultiple: FC<InputComponentProps> = ({
  id,
  codeFullLocked,
  defaultValue,
  onChangeFunction,
  options,
  multiSelectTog,
  isSelectedSubItem,
  openPopupId,
  setOpenPopupId
}) => {
  const [rangeLayersCellIsFocused, setRangeLayersCellIsFocused] =
    useState(false)
  const [rangeLayersPopUpOpen, setRangeLayersPopUpOpen] = useState(false)

  useLayoutEffect(() => {
    if (rangeLayersPopUpOpen) {
      setOpenPopupId?.(id) // Mark this popup as open
    }
  }, [rangeLayersPopUpOpen, id, setOpenPopupId])

  useEffect(() => {
    if (openPopupId !== id) {
      setRangeLayersPopUpOpen(false) // Close this popup if another one opens
    }
  }, [openPopupId, id])

  const [togLayersOffTab, setTogLayersOffTab] = useState(false)

  const [possibleValuesRangesOrLayers, setPossibleValuesRangesOrLayers] =
    useState<string[]>([])

  const [buttonListTapLayersOrBothRanges, setButtonListTapLayersOrBothRanges] =
    useState<React.JSX.Element | undefined>(undefined)
  const [buttonListTogLayersOff, setButtonListTogLayersOff] = useState<
    React.JSX.Element | undefined
  >(undefined)
  const [buttonListTogLayersOn, setButtonListTogLayersOn] = useState<
    React.JSX.Element | undefined
  >(undefined)

  const { selectValues } = useSelectArraysContext()
  const [
    activeValuesTapLayersOrBothRanges,
    setActiveValuesTapLayersOrBothRanges
  ] = useState<Set<string>>(new Set())
  const [activeValuesTogLayersOn, setActiveValuesTogLayersOn] = useState<
    Set<string>
  >(new Set())
  const [activeValuesTogLayersOff, setActiveValuesTogLayersOff] = useState<
    Set<string>
  >(new Set())
  const [tapLayersTogether, setTapLayersTogether] = useState(false)
  const [tapLayersTogetherDefaultLayer, setTapLayersTogetherDefaultLayer] =
    useState<string | undefined>(undefined)

  const [tapLayersTogetherDefaultPopUp, setTapLayersTogetherDefaultPopUp] =
    useState(false)
  const [tapLayersTogetherDefaultPopUpId, setTapLayersTogetherDefaultPopUpId] =
    useState<string | undefined>(undefined)

  const tapLayersOrBothRangesIsOnlyEmpty = useCallback(
    () =>
      activeValuesTapLayersOrBothRanges.size === 1 &&
      activeValuesTapLayersOrBothRanges.has(''),
    [activeValuesTapLayersOrBothRanges]
  )

  const activeTapLayersOrBothRangesMinusEmpty = useCallback(
    () =>
      activeValuesTapLayersOrBothRanges.size > 1 &&
      activeValuesTapLayersOrBothRanges.has('')
        ? activeValuesTapLayersOrBothRanges.size - 1
        : activeValuesTapLayersOrBothRanges.size,
    [activeValuesTapLayersOrBothRanges]
  )

  const togLayersOnIsOnlyEmpty = useCallback(
    () => activeValuesTogLayersOn.size === 1 && activeValuesTogLayersOn.has(''),
    [activeValuesTogLayersOn]
  )

  const activeTogLayersOnMinusEmpty = useCallback(
    () =>
      activeValuesTogLayersOn.size > 1 && activeValuesTogLayersOn.has('')
        ? activeValuesTogLayersOn.size - 1
        : activeValuesTogLayersOn.size,
    [activeValuesTogLayersOn]
  )

  const togLayersOffIsOnlyEmpty = useCallback(
    () =>
      activeValuesTogLayersOff.size === 1 && activeValuesTogLayersOff.has(''),
    [activeValuesTogLayersOff]
  )
  const activeTogLayersOffMinusEmpty = useCallback(
    () =>
      activeValuesTogLayersOff.size > 1 && activeValuesTogLayersOff.has('')
        ? activeValuesTogLayersOff.size - 1
        : activeValuesTogLayersOff.size,
    [activeValuesTogLayersOff]
  )

  const valChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (codeFullLocked) return

      const target = event.target as HTMLButtonElement
      const value = target.value

      if (
        options === 'artRngsArray' ||
        (options === 'artLayersArray' && !multiSelectTog)
      ) {
        setActiveValuesTapLayersOrBothRanges((prev) => {
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
              if (tapLayersTogetherDefaultLayer === value) {
                setTapLayersTogetherDefaultPopUpId(undefined)
                const syntheticEvent = {
                  ...event,
                  target: { ...event.target, value: '' }
                } as unknown as ChangeEvent<HTMLInputElement>

                onChangeFunction(syntheticEvent, 'default_layer')
              }
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
      }

      if (options === 'artLayersArray' && multiSelectTog && togLayersOffTab) {
        setActiveValuesTogLayersOff((prev) => {
          const newSet = new Set(prev)

          if (newSet.has(value)) {
            newSet.delete(value)
          } else {
            newSet.add(value)
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

          onChangeFunction(syntheticEvent, 'art_layers_off')
          return newSet
        })
      }

      if (options === 'artLayersArray' && multiSelectTog && !togLayersOffTab) {
        setActiveValuesTogLayersOn((prev) => {
          const newSet = new Set(prev)

          if (newSet.has(value)) {
            newSet.delete(value)
          } else {
            newSet.add(value)
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

          onChangeFunction(syntheticEvent, 'art_layers_on')
          return newSet
        })
      }
    },
    [
      options,
      setActiveValuesTapLayersOrBothRanges,
      setActiveValuesTogLayersOn,
      setActiveValuesTogLayersOff,
      tapLayersTogetherDefaultLayer,
      setTapLayersTogetherDefaultPopUpId,
      togLayersOffTab,
      multiSelectTog,
      onChangeFunction,
      codeFullLocked
    ]
  )

  const shortenedSubItemId = useCallback((initialId: string) => {
    return `${initialId.split('_')[2]}_${parseInt(initialId.split('_')[3]!)}`
  }, [])

  const getSelectList = useCallback(
    (name: SelectValuesKeys) => {
      const values = selectValues[name]
      setPossibleValuesRangesOrLayers(values as string[])

      const useShortId = name === 'artLayersArray' || name === 'artRngsArray'

      return (
        <>
          {values.map((value, index) => {
            return (
              <div
                key={`${value}_${index}`}
                className='relative w-1/3 max-w-1/3 grow-1 p-0.5'>
                <button
                  type='button'
                  tabIndex={0}
                  title={value.toString()}
                  id={id + '_rangeLayerPicker_' + value.toString()}
                  className={twMerge(
                    name === 'artLayersArray' &&
                      multiSelectTog &&
                      togLayersOffTab &&
                      activeValuesTogLayersOff.has(value.toString())
                      ? 'bg-indigo-200'
                      : '',
                    name === 'artLayersArray' &&
                      multiSelectTog &&
                      !togLayersOffTab &&
                      activeValuesTogLayersOn.has(value.toString())
                      ? 'bg-indigo-200'
                      : '',

                    name === 'artLayersArray' &&
                      !multiSelectTog &&
                      activeValuesTogLayersOn.has(value.toString())
                      ? 'bg-indigo-200'
                      : '',
                    activeValuesTapLayersOrBothRanges.has(value.toString())
                      ? 'bg-indigo-200'
                      : '',
                    'w-full cursor-pointer rounded-sm p-1 text-left text-black shadow-sm shadow-black',
                    'focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                  )}
                  onClick={(e) => {
                    valChange(e)
                    setTapLayersTogetherDefaultPopUp(false)
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.shiftKey &&
                      e.key === 'Tab' &&
                      name !== 'artLayersArray' &&
                      value === values[0]
                    ) {
                      setRangeLayersPopUpOpen(false)
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    if (name === 'artRngsArray') return
                    if (name === 'artLayersArray' && multiSelectTog) return
                    if (tapLayersTogether) return
                    if (
                      !activeValuesTapLayersOrBothRanges.has(value.toString())
                    )
                      return

                    if (
                      tapLayersTogetherDefaultPopUp &&
                      tapLayersTogetherDefaultPopUpId === value.toString()
                    ) {
                      setTapLayersTogetherDefaultPopUp(false)
                      return
                    }

                    setTapLayersTogetherDefaultPopUp(true)
                    setTapLayersTogetherDefaultPopUpId(value.toString())
                  }}
                  value={value.toString()}>
                  {useShortId ? shortenedSubItemId(value.toString()) : value}
                </button>
                {name === 'artLayersArray' &&
                  !multiSelectTog &&
                  !tapLayersTogether &&
                  tapLayersTogetherDefaultLayer === value.toString() &&
                  activeValuesTapLayersOrBothRanges.has(value.toString()) && (
                    <HiCheckCircle className='absolute -top-1 -right-1 h-5 w-5 text-green-700' />
                  )}
                {name === 'artLayersArray' &&
                  !multiSelectTog &&
                  !tapLayersTogether &&
                  tapLayersTogetherDefaultPopUp &&
                  activeValuesTapLayersOrBothRanges.has(value.toString()) &&
                  tapLayersTogetherDefaultPopUpId === value.toString() &&
                  tapLayersTogetherDefaultLayer !== value.toString() && (
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault()
                        const syntheticEvent = {
                          ...e,
                          target: { ...e.target, value: value.toString() }
                        } as unknown as ChangeEvent<HTMLInputElement>

                        setTapLayersTogetherDefaultPopUp(false)
                        setTapLayersTogetherDefaultLayer(() => {
                          onChangeFunction(syntheticEvent, 'default_layer')
                          return value.toString()
                        })
                      }}
                      className='absolute -top-1 -right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md'>
                      <HiCheckCircle className='h-5 w-5 text-gray-700' />
                    </button>
                  )}
              </div>
            )
          })}
        </>
      )
    },
    [
      selectValues,
      setPossibleValuesRangesOrLayers,
      activeValuesTapLayersOrBothRanges,
      activeValuesTogLayersOff,
      activeValuesTogLayersOn,
      setRangeLayersPopUpOpen,
      shortenedSubItemId,
      tapLayersTogetherDefaultPopUp,
      setTapLayersTogetherDefaultPopUp,
      tapLayersTogetherDefaultPopUpId,
      setTapLayersTogetherDefaultPopUpId,
      setTapLayersTogetherDefaultLayer,
      tapLayersTogetherDefaultLayer,
      onChangeFunction,
      tapLayersTogether,
      multiSelectTog,
      togLayersOffTab,
      id,
      valChange
    ]
  )

  useLayoutEffect(() => {
    if (!defaultValue) return

    if (options === 'artRngsArray') {
      try {
        const fixedJson = (defaultValue as string).toString().replace(/'/g, '"')
        const parsedArray = JSON.parse(fixedJson) as string[]
        setActiveValuesTapLayersOrBothRanges(new Set(parsedArray))
      } catch (error) {
        console.error(
          'Error parsing defaultValue:',
          error,
          'Raw Value:',
          defaultValue
        )
      }
    }

    if (options === 'artLayersArray' && !multiSelectTog) {
      try {
        const fixedJson = (
          defaultValue as { layers: string; together: boolean; default: string }
        ).layers
          .toString()
          .replace(/'/g, '"')

        const together = (
          defaultValue as { layers: string; together: boolean; default: string }
        ).together

        const defaultLayer = (
          defaultValue as { layers: string; together: boolean; default: string }
        ).default

        const parsedLayers = JSON.parse(fixedJson) as string[]

        setActiveValuesTapLayersOrBothRanges(new Set(parsedLayers))
        setTapLayersTogetherDefaultLayer(defaultLayer)
        setTapLayersTogether(together)
      } catch (error) {
        console.error(
          'Error parsing defaultValue:',
          error,
          'Raw Value:',
          defaultValue
        )
      }
    }

    if (options === 'artLayersArray' && multiSelectTog) {
      try {
        const fixedOff = (defaultValue as { off: string; on: string }).off
          .toString()
          .replace(/'/g, '"')
        const fixedOn = (defaultValue as { off: string; on: string }).on
          .toString()
          .replace(/'/g, '"')

        const parsedOff = JSON.parse(fixedOff) as string[]
        const parsedOn = JSON.parse(fixedOn) as string[]

        setActiveValuesTogLayersOff(new Set(parsedOff))
        setActiveValuesTogLayersOn(new Set(parsedOn))
      } catch (error) {
        console.error(
          'Error parsing defaultValue:',
          error,
          'Raw Value:',
          defaultValue
        )
      }
    }
  }, [
    defaultValue,
    options,
    multiSelectTog,
    setActiveValuesTogLayersOff,
    setActiveValuesTogLayersOn,
    setActiveValuesTapLayersOrBothRanges,
    setTapLayersTogether,
    setTapLayersTogetherDefaultLayer
  ])

  useLayoutEffect(() => {
    const list = getSelectList(options ?? 'valNoneList')
    setButtonListTapLayersOrBothRanges(list)
    setButtonListTogLayersOff(list)
    setButtonListTogLayersOn(list)
  }, [options, getSelectList])

  return (
    <div
      onClick={() => setTapLayersTogetherDefaultPopUp(false)}
      className={twMerge('relative h-6 w-full')}>
      {rangeLayersPopUpOpen &&
        isSelectedSubItem &&
        options === 'artRngsArray' && (
          <div className='absolute right-[2px] bottom-[27px] z-100 block max-h-60 w-40 rounded-sm border border-black bg-zinc-300 p-2 dark:bg-zinc-200'>
            <div
              id='tapRangeLayerPickerPopUp'
              className='flex h-full flex-wrap'>
              {buttonListTapLayersOrBothRanges}
            </div>
          </div>
        )}
      {rangeLayersPopUpOpen &&
        isSelectedSubItem &&
        options === 'artLayersArray' &&
        !multiSelectTog && (
          <div className='absolute right-[2px] bottom-[27px] z-100 block max-h-60 w-40 rounded-sm border border-black bg-zinc-300 p-2 dark:bg-zinc-200'>
            <div className='flex items-center justify-end gap-1'>
              <p className='text-black'>Together</p>
              <div className='rounded-xs border border-zinc-400'>
                <InputCheckBox
                  id={id.replace('art_layers', 'layers_together')}
                  codeFullLocked={codeFullLocked}
                  defaultValue={tapLayersTogether}
                  onChangeFunction={(e) => {
                    setTapLayersTogether((prev) => {
                      onChangeFunction(e, 'layers_together')
                      return !prev
                    })
                  }}
                  shiftTabOutFunction={() => setRangeLayersPopUpOpen(false)}
                />
              </div>
            </div>
            <div
              id='tapRangeLayerPickerPopUp'
              className='flex h-full flex-wrap'>
              {buttonListTapLayersOrBothRanges}
            </div>
          </div>
        )}
      {rangeLayersPopUpOpen &&
        isSelectedSubItem &&
        options === 'artLayersArray' &&
        multiSelectTog && (
          <div className='absolute right-[2px] bottom-[27px] z-100 flex max-h-60 w-40 flex-col gap-2 rounded-sm border border-black bg-zinc-300 p-2 dark:bg-zinc-200'>
            <div className='flex justify-start gap-1'>
              <button
                title={''}
                className={twMerge(
                  togLayersOffTab ? 'bg-zinc-400' : 'bg-red-300',
                  'w-8 cursor-pointer rounded-sm border border-black px-1 text-black',
                  'focus-visible:border-white focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                )}
                onClick={() => setTogLayersOffTab(false)}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === 'Tab') {
                    setRangeLayersPopUpOpen(false)
                  }
                }}>
                On
              </button>
              <button
                className={twMerge(
                  togLayersOffTab ? 'bg-red-300' : 'bg-zinc-400',
                  'w-8 cursor-pointer rounded-sm border border-black px-1 text-black',
                  'focus-visible:border-white focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                )}
                onClick={() => setTogLayersOffTab(true)}>
                Off
              </button>
            </div>
            <div
              id='tapRangeLayerPickerPopUp'
              className='flex h-full flex-wrap'>
              {togLayersOffTab ? buttonListTogLayersOff : buttonListTogLayersOn}
            </div>
          </div>
        )}
      <label
        htmlFor={
          options === 'artLayersArray' && multiSelectTog
            ? `${id.replace('_art_layers', '_art_layers_on/off')}`
            : id
        }
        title={
          options === 'artLayersArray' && multiSelectTog
            ? `${id.replace('art_layers', 'art_layers_on')}: ${JSON.stringify(Array.from(activeValuesTogLayersOn))}\n${id.replace('art_layers', 'art_layers_off')}: ${JSON.stringify(Array.from(activeValuesTogLayersOff))}`
            : options === 'artLayersArray' && !multiSelectTog
              ? `${id}: ${JSON.stringify(Array.from(activeValuesTapLayersOrBothRanges))}\n${id.replace('art_layers', 'layers_together')}: ${tapLayersTogether}`
              : id +
                '_currentValue: ' +
                `${JSON.stringify(Array.from(activeValuesTapLayersOrBothRanges))}`
        }
        className={twMerge(
          'absolute flex h-full w-full items-center rounded-xs transition-all duration-200',
          codeFullLocked ? 'cursor-not-allowed' : 'cursor-pointer',
          rangeLayersCellIsFocused
            ? 'bg-white text-black ring-4 ring-indigo-600 outline-hidden'
            : ''
        )}>
        {options === 'artRngsArray' && (
          <p>
            {activeValuesTapLayersOrBothRanges.size > 0 &&
              !tapLayersOrBothRangesIsOnlyEmpty() &&
              `(x${activeTapLayersOrBothRangesMinusEmpty()})`}
          </p>
        )}
        {options === 'artLayersArray' && !multiSelectTog && (
          <p>
            {activeValuesTapLayersOrBothRanges.size > 0 &&
              !tapLayersOrBothRangesIsOnlyEmpty() &&
              `(x${activeTapLayersOrBothRangesMinusEmpty()})`}
            {tapLayersTogether ? '*' : ''}
          </p>
        )}
        {options === 'artLayersArray' && multiSelectTog && (
          <p>
            {activeValuesTogLayersOn.size > 0 && !togLayersOnIsOnlyEmpty()
              ? `(x${activeTogLayersOnMinusEmpty()})/`
              : '/'}

            {activeValuesTogLayersOff.size > 0 &&
              !togLayersOffIsOnlyEmpty() &&
              `(x${activeTogLayersOffMinusEmpty()})`}
          </p>
        )}

        <input
          id={
            options === 'artLayersArray' && multiSelectTog
              ? `${id.replace('_art_layers', '_art_layers_on/off')}`
              : id
          }
          type='checkbox'
          autoComplete='off'
          checked={rangeLayersPopUpOpen}
          disabled={codeFullLocked}
          className='sr-only'
          onChange={() => {
            if (rangeLayersPopUpOpen) {
              setRangeLayersPopUpOpen(false)
              setOpenPopupId?.(null)
            } else {
              setRangeLayersPopUpOpen(true)
              setOpenPopupId?.(id)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setRangeLayersPopUpOpen((prev) => !prev)
            } else if (e.key === 'ArrowDown') {
              setRangeLayersPopUpOpen(false)
            } else if (e.key === 'ArrowUp') {
              setRangeLayersPopUpOpen(false)
            } else if (e.shiftKey && e.key === 'Tab' && rangeLayersPopUpOpen) {
              e.preventDefault()
              const rangeLayerPicker = document.getElementById(
                id +
                  'rangeLayerPicker' +
                  possibleValuesRangesOrLayers[
                    possibleValuesRangesOrLayers.length - 1
                  ]
              )
              rangeLayerPicker?.focus()
            } else if (!e.shiftKey && e.key === 'Tab' && rangeLayersPopUpOpen) {
              setRangeLayersPopUpOpen(false)
            } else {
              return
            }
          }}
          onFocus={() => setRangeLayersCellIsFocused(true)}
          onBlur={() => setRangeLayersCellIsFocused(false)}
        />
      </label>
    </div>
  )
}
