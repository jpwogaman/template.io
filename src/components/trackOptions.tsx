import { type FC, Fragment, useState } from 'react'
import { trpc } from '@/utils/trpc'
import { SelectList, selectArrays } from '@/components/select-arrays'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackOptionsTableKeys from './trackOptionsTableKeys'

import {
  type ItemsArtListSwitch,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'

let optionElements: string | React.JSX.Element | undefined

type TrackOptionsProps = {
  selectedItemId: string | null
}

const TrackOptions: FC<TrackOptionsProps> = ({ selectedItemId }) => {
  const { data: selectedItem, refetch } = trpc.items.getSingleItem.useQuery({
    itemId: selectedItemId ?? ''
  })

  const updateSingleItemMutation = trpc.items.updateSingleItem.useMutation({
    onSuccess: () => {
      updateSingleItemMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const createSingleFullRangeMutation =
    trpc.items.addSingleFullRange.useMutation({
      onSuccess: () => {
        createSingleFullRangeMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })

  const deleteSingleFullRangeMutation =
    trpc.items.deleteSingleFullRange.useMutation({
      onSuccess: () => {
        deleteSingleFullRangeMutation.reset()
        refetch()
      },
      onError: (error) => {
        alert(
          error ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })

  const artRngsArray: string[] = []
  for (const element of selectedItem?.fullRange ?? []) {
    artRngsArray.push(element?.id)
  }

  const trackTh = `
    bg-zinc-400 dark:bg-zinc-500
    font-caviarBold dark:font-normal
    p-1
   `

  const trackTr = `bg-zinc-300  
    dark:bg-zinc-600 
    hover:bg-zinc-500 
    dark:hover:bg-zinc-400       
      hover:text-zinc-50 
    dark:hover:text-zinc-50        
   `

  const trackTd = ``

  const [trackOptionsLayouts, setTrackOptionsLayouts] = useState({
    fullRange: 'table',
    artListSwitch: 'table',
    artListTog: 'table',
    fadList: 'table'
  })

  const changeLayoutsHelper = (layoutKey: string, layout: string) => {
    setTrackOptionsLayouts((prevState) => ({
      ...prevState,
      [layoutKey]: layout
    }))
  }

  return (
    <div className='max-h-[85%] w-6/12 overflow-y-scroll'>
      {TrackOptionsTableKeys.map((layoutConfig, layoutIndex) => {
        let layoutDataArray:
          | ItemsArtListSwitch[]
          | ItemsArtListTog[]
          | ItemsFadList[]
          | ItemsFullRanges[]
          | undefined = []

        if (layoutConfig.label === 'fullRange') {
          layoutDataArray = selectedItem?.fullRange
        }
        if (layoutConfig.label === 'artListSwitch') {
          layoutDataArray = selectedItem?.artListSwitch
        }
        if (layoutConfig.label === 'artListTog') {
          layoutDataArray = selectedItem?.artListTog
        }
        if (layoutConfig.label === 'fadList') {
          layoutDataArray = selectedItem?.fadList
        }

        const table = trackOptionsLayouts[layoutConfig.label] === 'table'

        return (
          <Fragment key={layoutConfig.label}>
            <div className='mt-4 flex justify-between'>
              <h2 className='font-caviarBold text-base'>{`${
                layoutConfig.title
              } (${layoutDataArray?.length ?? 0})`}</h2>
              <IconBtnToggle
                classes=''
                titleA='Change to card layout'
                titleB='Change to table layout'
                id='changeLayout'
                a='fa-solid fa-table-cells-large'
                b='fa-solid fa-table-columns'
                defaultIcon={table ? 'a' : 'b'}
                onToggleA={() =>
                  changeLayoutsHelper(layoutConfig.label, 'cards')
                }
                onToggleB={() =>
                  changeLayoutsHelper(layoutConfig.label, 'table')
                }
              />
            </div>
            {table && (
              <div className=''>
                <table className='w-full table-fixed border-separate border-spacing-0 text-left text-xs '>
                  <thead>
                    <tr>
                      {layoutConfig.keys.map((key) => {
                        if (!key.show) return
                        return (
                          <td
                            key={key.key}
                            title={key.key}
                            className={tw(
                              trackTh,
                              key.className,
                              'sticky top-0 z-50'
                            )}>
                            {key.label}
                          </td>
                        )
                      })}
                      <td
                        className={tw(
                          trackTh,
                          'sticky top-0 z-50 w-[5%] text-center'
                        )}>
                        <button
                        //onClick={() => addSubItem(level.label)}
                        >
                          <i className='fa-solid fa-plus' />
                        </button>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {layoutDataArray?.map(
                      (layoutDataSingle, layoutDataSingleIndex) => {
                        const layoutDataSingleId = layoutDataSingle.id

                        return (
                          <tr
                            key={layoutDataSingleId}
                            className={`${trackTr}`}>
                            {layoutConfig.keys.map((key) => {
                              const checkBox = key.input === 'checkbox'
                              const keyIsTextOrCheckbox =
                                key.input === 'text' || checkBox

                              type keyType = typeof key.key

                              let multiple: boolean = false
                              const selected: boolean = false
                              const locked = selectedItem?.locked
                              const keyIsId = key.key === 'id'
                              const disabled = locked ? true : keyIsId

                              for (const array in selectArrays) {
                                if (key.selectArray === 'artRngsArray') {
                                  optionElements = (
                                    <SelectList numbers={artRngsArray} />
                                  )
                                  multiple = true
                                  optionElements = (
                                    <>
                                      {artRngsArray.map(
                                        (number: string | number) => (
                                          <option
                                            key={number}
                                            //  selected={
                                            //    subSection.ranges.includes(
                                            //      number as string
                                            //    )
                                            //  }
                                            value={number}>
                                            {number}
                                          </option>
                                        )
                                      )}
                                    </>
                                  )
                                }
                                if (
                                  key.selectArray === selectArrays[array]?.name
                                ) {
                                  optionElements = selectArrays[array]?.array
                                }
                              }
                              if (!key.show) return
                              return (
                                <td
                                  key={key.key}
                                  title={layoutDataSingleId}
                                  className={tw(trackTd, 'p-0.5')}>
                                  {!key.input && (
                                    <p className='p-1'>{layoutDataSingleId}</p>
                                  )}{' '}
                                  {key.input === 'select' && !multiple && (
                                    <select
                                      className={tw(
                                        'w-full cursor-pointer overflow-scroll p-[4.5px] text-zinc-900',
                                        disabled
                                          ? 'cursor-not-allowed bg-zinc-300'
                                          : 'bg-white dark:bg-zinc-100'
                                      )}
                                      value={
                                        !disabled
                                          ? (layoutDataSingle[
                                              key.key as unknown as 'name'
                                            ] as unknown as string)
                                          : undefined
                                      }
                                      disabled={disabled}
                                      //onChange={(event) =>
                                      //  valueChange(
                                      //    event,
                                      //    level.label,
                                      //    key.key,
                                      //    subSectionIndex
                                      //  )
                                      //}
                                    >
                                      {!disabled
                                        ? optionElements
                                        : selectArrays?.valNoneList?.array}
                                      {/*{optionElements}*/}
                                    </select>
                                  )}{' '}
                                  {key.input === 'select' && multiple && (
                                    // <details>
                                    <select
                                      className={tw(
                                        'w-full cursor-pointer overflow-scroll p-[4.5px] text-zinc-900',
                                        disabled
                                          ? 'cursor-not-allowed bg-zinc-300'
                                          : 'bg-white dark:bg-zinc-100'
                                      )}
                                      value={undefined}
                                      multiple
                                      disabled={disabled}
                                      //onChange={(event) =>
                                      //  valueChange(
                                      //    event,
                                      //    level.label,
                                      //    key.key,
                                      //    subSectionIndex
                                      //  )
                                      //}
                                    >
                                      {optionElements}
                                    </select>
                                  )}
                                  {/*</details>*/}
                                  {keyIsTextOrCheckbox && (
                                    <input
                                      //checked={
                                      //  layoutDataSingle[
                                      //    key.key as 'default'
                                      //  ] as unknown as boolean
                                      //}
                                      disabled={disabled}
                                      type={key.input}
                                      className={tw(
                                        'w-full p-1 text-zinc-900',
                                        key.input === 'checkbox'
                                          ? 'cursor-pointer'
                                          : '',
                                        disabled
                                          ? 'cursor-not-allowed bg-zinc-300'
                                          : 'bg-white dark:bg-zinc-100'
                                      )}
                                      //  onChange={(event) =>
                                      //    valueChange(
                                      //      event,
                                      //      level.label,
                                      //      key.key,
                                      //      subSectionIndex
                                      //    )
                                      //  }
                                      value={layoutDataSingle[key.key as 'id']}
                                    />
                                  )}
                                </td>
                              )
                            })}
                            <td className={tw(trackTd, 'text-center')}>
                              <button
                              //  onClick={() =>
                              //    deleteSingleFullRangeMutation.mutate({
                              //      fileItemsItemId: 'T_9',
                              //      rangeId: subSection.artId
                              //    })
                              //  }
                              >
                                <i className='fa-solid fa-minus' />
                              </button>
                            </td>
                          </tr>
                        )
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {!table && (
              <div className='flex gap-1 overflow-x-scroll'>
                {layoutDataArray?.map(
                  (layoutDataSingle, layoutDataSingleIndex) => {
                    const layoutDataSingleId = layoutDataSingle.id

                    return (
                      <table
                        key={layoutDataSingleId}
                        className='w-max table-auto border-separate border-spacing-0 text-left text-xs'>
                        <thead>
                          <tr>
                            <td className={tw(trackTh, 'w-1/2')}>
                              {layoutDataSingleId}
                            </td>
                            <td className={tw(trackTh, 'flex justify-between')}>
                              <button
                              //  onClick={() =>
                              //    deleteSingleFullRangeMutation.mutate({
                              //      fileItemsItemId: 'T_9',
                              //      rangeId: subSection.artId
                              //    })
                              //  }
                              >
                                <i className='fa-solid fa-minus' />
                              </button>
                              <button
                              //  onClick={() =>
                              //    createSingleFullRangeMutation.mutate({
                              //      itemId: 'T_9',
                              //    })}
                              >
                                <i className='fa-solid fa-plus' />
                              </button>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {layoutConfig.keys.map((key) => {
                            const checkBox = key.input === 'checkbox'
                            const keyIsTextOrCheckbox =
                              key.input === 'text' || checkBox

                            let multiple: boolean = false
                            const locked = selectedItem?.locked
                            const keyIsId = key.key === 'id'
                            const disabled = locked ? true : keyIsId

                            for (const array in selectArrays) {
                              if (key.selectArray === 'artRngsArray') {
                                optionElements = (
                                  <SelectList numbers={artRngsArray} />
                                )
                                multiple = true
                              }
                              if (
                                key.selectArray === selectArrays[array]?.name
                              ) {
                                optionElements = selectArrays[array]?.array
                              }
                            }
                            if (!key.show) return
                            return (
                              <tr
                                key={key.key}
                                className={trackTr}>
                                <td className={tw(trackTd, 'p-0.5')}>
                                  {key.label}
                                </td>
                                <td className={tw(trackTd, 'p-0.5')}>
                                  {!key.input && (
                                    <p className='p-1'>{layoutDataSingleId}</p>
                                  )}{' '}
                                  {key.input === 'select' && !multiple && (
                                    <select
                                      className={tw(
                                        'w-full cursor-pointer overflow-scroll p-[4.5px]',
                                        disabled
                                          ? 'cursor-not-allowed bg-zinc-300'
                                          : 'bg-white dark:bg-zinc-100'
                                      )}
                                      value={
                                        !disabled
                                          ? (layoutDataSingle[
                                              key.key as unknown as 'name'
                                            ] as unknown as string)
                                          : undefined
                                      }
                                      disabled={disabled}
                                      //onChange={(event) =>
                                      //  valueChange(
                                      //    event,
                                      //    level.label,
                                      //    key.key,
                                      //    subSectionIndex
                                      //  )
                                      //}
                                    >
                                      {!disabled
                                        ? optionElements
                                        : selectArrays?.valNoneList?.array}
                                      {optionElements}
                                    </select>
                                  )}{' '}
                                  {key.input === 'select' && multiple && (
                                    <details>
                                      <select
                                        className={tw(
                                          'w-full cursor-pointer overflow-scroll p-[4.5px]',
                                          disabled
                                            ? 'cursor-not-allowed bg-zinc-300'
                                            : 'bg-white dark:bg-zinc-100'
                                        )}
                                        value={undefined}
                                        multiple
                                        disabled={disabled}
                                        //  onChange={(event) =>
                                        //    valueChange(
                                        //      event,
                                        //      level.label,
                                        //      key.key,
                                        //      subSectionIndex
                                        //    )
                                        //  }
                                      >
                                        {optionElements}
                                      </select>
                                    </details>
                                  )}{' '}
                                  {keyIsTextOrCheckbox && (
                                    <input
                                      //checked={
                                      //  layoutDataSingle[
                                      //    key.key as 'changeType'
                                      //  ] as unknown as boolean
                                      //}
                                      disabled={disabled}
                                      type={key.input}
                                      className={tw(
                                        'p-1',
                                        key.input === 'checkbox'
                                          ? 'cursor-pointer'
                                          : 'w-full',
                                        disabled
                                          ? 'cursor-not-allowed bg-zinc-300'
                                          : 'bg-white dark:bg-zinc-100'
                                      )}
                                      //  onChange={(event) =>
                                      //    valueChange(
                                      //      event,
                                      //      level.label,
                                      //      key.key,
                                      //      subSectionIndex
                                      //    )
                                      //  }
                                      value={layoutDataSingleId}
                                    />
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )
                  }
                )}
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default TrackOptions
