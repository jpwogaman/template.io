'use client'
import React, { type FC } from 'react'
import { HiOutlineLockClosed, HiOutlineLockOpen } from 'react-icons/hi2'
import { FaArrowDown19 } from 'react-icons/fa6'
import tw from '@/components/utils/tw'
import { TrackListTableKeys } from '../utils/trackListTableKeys'
import {
  InputCheckBox,
  InputCheckBoxSwitch,
  InputSelectMultiple,
  InputSelectSingle,
  InputText,
  InputTextRich,
  InputColorPicker,
  type ChangeEventHelper,
  type OnChangeHelperArgsType,
  type InputComponentProps
} from '../inputs'

import {
  useMutations,
  useSelectedItem,
  useContextMenu,
  contextMenuType,
  FileItemId,
  SubItemId
} from '@/components/context'

export const TrackList: FC = () => {
  const { setIsContextMenuOpen, setContextMenuId } = useContextMenu()
  const { data, update, renumber } = useMutations()
  const { settings, updateSettings } = useSelectedItem()
  const { selected_item_id } = settings

  const onChangeHelper = ({
    newValue,
    layoutDataSingleId: id,
    key
  }: OnChangeHelperArgsType) => {
    const refetch = false
    update.track(
      {
        id: id as FileItemId,
        [key]: newValue
      },
      refetch
    )
  }

  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      <table className='w-full table-fixed border-separate border-spacing-0 text-left text-xs'>
        <thead>
          <tr>
            {/* COLOR PICKER HEAD */}
            <td
              className={tw(
                'font-codeBold dark:font-code sticky top-0 z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 px-1 dark:border-zinc-400 dark:bg-zinc-600',
                'sticky z-50 w-[20px]'
              )}
            />
            {/* LOCK HEAD */}
            <td
              className={tw(
                'font-codeBold dark:font-code sticky top-0 z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 px-1 dark:border-zinc-400 dark:bg-zinc-600',
                'sticky z-50 w-[25px]'
              )}
            />
            {/* OTHER HEADS */}
            {TrackListTableKeys.keys.map((keyActual) => {
              const { key, show, className, label } = keyActual

              if (!show) return
              return (
                <td
                  key={key}
                  className={tw(
                    'font-codeBold dark:font-code sticky top-0 z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 px-1 dark:border-zinc-400 dark:bg-zinc-600',
                    'sticky z-50',
                    className ?? ''
                  )}
                  title={key}>
                  {key === 'id' && (
                    <div className='flex items-center'>
                      <p>{label}</p>
                      <button
                        type='button'
                        className={tw(
                          'cursor-pointer text-zinc-200 transition-colors duration-300',
                          'outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:outline-hidden focus-visible:ring-inset'
                        )}
                        title='Renumber Tracks'
                        onClick={() => renumber.allTracks()}>
                        <FaArrowDown19 className='h-4 w-4' />
                      </button>
                    </div>
                  )}{' '}
                  {key !== 'id' && label}
                </td>
              )
            })}
            {/* ART COUNT HEAD */}
            <td
              className={tw(
                'font-codeBold dark:font-code sticky top-0 z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 px-1 dark:border-zinc-400 dark:bg-zinc-600',
                'sticky z-50 w-[5%]'
              )}>
              Arts.
            </td>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => {
            const { id, locked, _count } = item

            const selectedLocked = locked && selected_item_id === id
            const selectedUnlocked = !locked && selected_item_id === id
            const unselectedLocked = locked && selected_item_id !== id
            const unselectedUnlocked = !locked && selected_item_id !== id

            return (
              <tr
                id={id + '_row'}
                key={id}
                onContextMenu={() => {
                  setIsContextMenuOpen(true)
                  setContextMenuId(id as contextMenuType)
                }}
                onKeyUpCapture={() => {
                  updateSettings({ key: 'selected_item_id', value: id })
                  updateSettings({
                    key: 'selected_sub_item_id',
                    value: (id + '_notes') as SubItemId
                  })
                }}
                onClick={() => {
                  updateSettings({ key: 'selected_item_id', value: id })
                  updateSettings({
                    key: 'selected_sub_item_id',
                    value: (id + '_notes') as SubItemId
                  })
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
                  className='h-[30px] transition-all duration-200'>
                  <InputColorPicker
                    id={`${item?.id}_color`}
                    codeFullLocked={item?.locked}
                    defaultValue={item?.color}
                    onChangeFunction={(event: ChangeEventHelper) => {
                      const refetch = false
                      update.track(
                        {
                          id: item?.id,
                          color: event.target.value
                        },
                        refetch
                      )
                    }}
                  />
                </td>
                {/* LOCK CELL */}
                <td
                  id={id + '_lock_' + 'cell'}
                  className='text-center transition-all duration-200'>
                  <button
                    type='button'
                    className={tw(
                      'cursor-pointer',
                      'rounded-sm p-2 outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:outline-hidden focus-visible:ring-inset'
                    )}
                    onClick={() => {
                      const refetch = true
                      update.track(
                        {
                          id: id,
                          locked: !locked
                        },
                        refetch
                      )
                    }}>
                    <span className='sr-only'>lock track</span>
                    {locked && (
                      <HiOutlineLockClosed
                        className='h-4 w-4'
                        aria-hidden='true'
                      />
                    )}
                    {!locked && (
                      <HiOutlineLockOpen
                        className='h-4 w-4'
                        aria-hidden='true'
                      />
                    )}
                  </button>
                </td>
                {/* OTHER CELLS */}
                {TrackListTableKeys.keys.map((keyActual) => {
                  const { key, show, input, selectArray } = keyActual
                  if (!show) return

                  const inputPropsHelper: InputComponentProps = {
                    id: `${item.id}_${key}`,
                    codeFullLocked: item?.locked,
                    defaultValue: item[key],
                    options: selectArray,
                    onChangeFunction: (event: ChangeEventHelper) => {
                      let typedValue: string | number | boolean =
                        event.target.value

                      if (typeof item[key] === 'string') {
                        typedValue = event.target.value
                      } else if (typeof item[key] === 'number') {
                        typedValue = parseInt(event.target.value)
                      } else if (typeof item[key] === 'boolean') {
                        typedValue = event.target.value === 'true'
                      }
                      onChangeHelper({
                        newValue: typedValue,
                        layoutDataSingleId: item.id,
                        key
                      })
                    }
                  }

                  return (
                    <td
                      id={id + '_' + key + '_' + 'cell'}
                      key={key}
                      className='p-0.5'>
                      {!input && (
                        <p
                          id={`${item.id}_${key}`}
                          title={
                            key === 'id'
                              ? item.id
                              : item.id +
                                '_' +
                                key +
                                '_currentValue: ' +
                                `${item[key]}`
                          }
                          className={tw(
                            'cursor-default overflow-hidden p-1 transition-all duration-200',
                            item?.locked && key != 'id' ? 'text-gray-400' : ''
                          )}>
                          {item[key]}
                        </p>
                      )}
                      {input === 'select-multiple' && (
                        <InputSelectMultiple {...inputPropsHelper} />
                      )}
                      {input === 'select' && (
                        <InputSelectSingle {...inputPropsHelper} />
                      )}
                      {input === 'checkbox-switch' && (
                        <InputCheckBoxSwitch {...inputPropsHelper} />
                      )}
                      {input === 'checkbox' && (
                        <InputCheckBox {...inputPropsHelper} />
                      )}
                      {input === 'color-picker' && (
                        <InputColorPicker {...inputPropsHelper} />
                      )}
                      {input === 'text' && <InputText {...inputPropsHelper} />}
                      {input === 'text-rich' && (
                        <InputTextRich {...inputPropsHelper} />
                      )}
                    </td>
                  )
                })}
                {/* ART COUNT CELL */}
                <td
                  id={id + '_artCount_' + 'cell'}
                  className={tw(
                    'p-0.5 transition-all duration-200',
                    locked ? 'text-gray-400' : ''
                  )}>
                  {_count?.art_list_tog + _count?.art_list_tap}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
