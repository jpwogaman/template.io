import React, { type FC, type Dispatch, type SetStateAction } from 'react'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackListTableKeys from './utils/trackListTableKeys'
import {
  type OnChangeHelperArgsType,
  type SelectedItemType,
  InputTypeSelector
} from './inputs'
import useMutations from '@/hooks/useMutations'

type TrackListProps = {
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
  setContextMenuId: Dispatch<SetStateAction<string>>
  setSelectedSubItemId: Dispatch<SetStateAction<string | null>>
}

const TrackList: FC<TrackListProps> = ({
  selectedItemId,
  setSelectedItemId,
  setIsContextMenuOpen,
  setContextMenuId,
  setSelectedSubItemId
}) => {
  const { data, update } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  const onChangeHelper = ({
    newValue,
    layoutDataSingleId: id,
    key
  }: OnChangeHelperArgsType) => {
    //I need to throttle this so it doesn't fire on every keypress, only when the user stops typing for a second or so.

    update.track({
      itemId: id,
      [key]: newValue
    })
  }

  const sortedData = data?.toSorted((a, b) => {
    return (
      parseInt(a.id.split('_')[1] || '0') - parseInt(b.id.split('_')[1] || '0')
    )
  })

  const trackTh = `border-[1.5px]
  border-b-transparent
  border-zinc-100
  dark:border-zinc-400
  bg-zinc-200
  dark:bg-zinc-600
  font-bold
  z-50
  dark:font-normal
  p-1
  sticky
  top-0
  `
  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      <table className='w-full table-fixed border-separate border-spacing-0 text-left text-xs'>
        <thead>
          <tr>
            {/* COLOR PICKER HEAD */}
            <td className={tw(trackTh, 'sticky z-50 w-[20px]')} />
            {/* LOCK HEAD */}
            <td className={tw(trackTh, 'sticky z-50 w-[25px]')} />
            {/* OTHER HEADS */}
            {TrackListTableKeys.keys.map((keyActual) => {
              const { key, show, className, label } = keyActual

              if (!show) return
              return (
                <td
                  key={key}
                  className={tw(trackTh, 'sticky z-50', className)}
                  title={key}>
                  {key === 'id' && (
                    <div className='flex gap-1'>
                      <p>{label}</p>
                      <button
                        //onClick={renumberItems}
                        title={`Renumber ${TrackListTableKeys.label}`}>
                        <i className='fa-solid fa-arrow-down-1-9' />
                      </button>
                    </div>
                  )}{' '}
                  {key !== 'id' && label}
                </td>
              )
            })}
            {/* ART COUNT HEAD */}
            <td className={tw(trackTh, 'sticky z-50 w-[5%]')}>Arts.</td>
          </tr>
        </thead>
        <tbody>
          {sortedData?.map((item) => {
            const { id, locked, _count } = item

            const selectedLocked = locked && selectedItemId === id
            const selectedUnlocked = !locked && selectedItemId === id
            const unselectedLocked = locked && selectedItemId !== id
            const unselectedUnlocked = !locked && selectedItemId !== id

            return (
              <tr
                id={id + '_row'}
                key={id}
                onContextMenu={() => {
                  setIsContextMenuOpen(true)
                  setContextMenuId(id)
                }}
                onClick={() => {
                  setSelectedItemId(id)
                  setSelectedSubItemId(id + '_FR_0')
                }}
                className={tw(
                  selectedUnlocked
                    ? 'bg-red-300 hover:bg-red-400 hover:text-zinc-50 dark:bg-red-600 dark:hover:bg-red-400 dark:hover:text-zinc-50'
                    : selectedLocked
                      ? 'bg-red-500 hover:bg-red-600 hover:text-zinc-50 dark:bg-red-800 dark:hover:bg-red-500 dark:hover:text-zinc-50'
                      : unselectedLocked
                        ? 'bg-zinc-200 hover:bg-zinc-500 hover:text-zinc-50 dark:bg-zinc-600 dark:hover:bg-zinc-400 dark:hover:text-zinc-50'
                        : unselectedUnlocked
                          ? 'bg-zinc-200 hover:bg-zinc-500 hover:text-zinc-50 dark:bg-zinc-600 dark:hover:bg-zinc-400 dark:hover:text-zinc-50'
                          : ''
                )}>
                {/* COLOR PICKER CELL */}
                <td
                  id={id + '_color_' + 'cell'}
                  className='h-[30px]'>
                  <InputTypeSelector
                    keySingle={
                      {
                        className: 'w-[00%]',
                        show: false,
                        key: 'color',
                        input: 'color-picker',
                        selectArray: undefined,
                        label: undefined
                      } as unknown as (typeof TrackListTableKeys)['keys'][number]
                    }
                    onChangeHelper={onChangeHelper}
                    selectedItem={item as unknown as SelectedItemType}
                  />
                </td>
                {/* LOCK CELL */}
                <td
                  id={id + '_lock_' + 'cell'}
                  className='px-1 py-0.5 text-center'>
                  <IconBtnToggle
                    classes={''}
                    titleA={id + '_locked_currentValue: ' + locked}
                    titleB={id + '_locked_currentValue: ' + locked}
                    id={id + '_lock_' + 'button'}
                    a='fa-solid fa-lock-open'
                    b='fa-solid fa-lock'
                    defaultIcon={locked ? 'b' : 'a'}
                    onToggleA={() =>
                      update.track({
                        itemId: id,
                        locked: true
                      })
                    }
                    onToggleB={() =>
                      update.track({
                        itemId: id,
                        locked: false
                      })
                    }
                  />
                </td>
                {/* OTHER CELLS */}
                {TrackListTableKeys.keys.map((keyActual) => {
                  const { key, show } = keyActual
                  if (!show) return
                  return (
                    <td
                      id={id + '_' + key + '_' + 'cell'}
                      key={key}
                      className='p-0.5'>
                      <InputTypeSelector
                        keySingle={keyActual}
                        onChangeHelper={onChangeHelper}
                        selectedItem={item as unknown as SelectedItemType}
                      />
                    </td>
                  )
                })}
                {/* ART COUNT CELL */}
                <td
                  id={id + '_artCount_' + 'cell'}
                  className={tw('p-0.5', locked ? 'text-gray-400' : '')}>
                  {_count?.artListTog + _count?.artListTap}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TrackList
