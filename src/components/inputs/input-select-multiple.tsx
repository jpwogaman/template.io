import { type FC, type ChangeEvent, useState, useLayoutEffect } from 'react'
import { type InputComponentProps } from './index'
import { twMerge } from 'tailwind-merge'
import { useSelectArraysContext } from '../context'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2'

export const InputSelectMultiple: FC<InputComponentProps> = ({
  id,
  codeDisabled,
  codeFullLocked,
  defaultValue,
  options,
  onChangeFunction
}) => {
  const [value, setValue] = useState<string>(defaultValue as string)
  const [selectList, setSelectList] = useState<React.JSX.Element | undefined>(
    undefined
  )
  const [size, setSize] = useState(1)

  const { getSelectList } = useSelectArraysContext()

  const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value)
    onChangeFunction(event)
  }

  useLayoutEffect(() => {
    setValue(defaultValue as string)
  }, [defaultValue])

  useLayoutEffect(() => {
    const list = getSelectList(options ?? 'valNoneList')
    setSelectList(list)
  }, [options, getSelectList])

  return (
    <div className='flex h-full w-full items-center justify-between'>
      <select
        id={id}
        multiple
        autoComplete='off'
        disabled={codeFullLocked ? true : codeDisabled}
        title={id + '_currentValue: ' + value}
        value={value}
        size={size}
        onChange={valChange}
        onClick={() => setSize(3)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setSize(3)
          }
        }}
        className={twMerge(
          size === 3 ? 'no-scrollbar overflow-y-scroll' : 'overflow-y-hidden',
          'h-full w-full overflow-x-hidden rounded-xs bg-inherit p-1 transition-all duration-200',
          'focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden',
          codeFullLocked || codeDisabled
            ? 'cursor-not-allowed text-gray-400'
            : 'cursor-pointer'
        )}>
        {codeDisabled ? getSelectList('valNoneList') : selectList}
      </select>
      <button
        className='cursor-pointer'
        onClick={() =>
          setSize((prev) => {
            if (prev === 1) {
              return 3
            } else {
              return 1
            }
          })
        }>
        {size === 1 && <HiChevronDown className='h-4 w-4' />}
        {size === 3 && <HiChevronUp className='h-4 w-4' />}
      </button>
    </div>
  )
}
