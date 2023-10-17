import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { SelectList, selectArrays } from '@/components/select-arrays'
import { trpc } from '@/utils/trpc'
import tw from '@/utils/tw'
import { type ChangeEvent, useState, FC, Fragment } from 'react'
import {
  FileItems,
  type LayoutKeys
} from '@/utils/template-io-track-data-schema'

const levelTwoKeys = [
  {
    title: 'Instrument Ranges',
    label: 'fullRange',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[30.75%]',
        show: true,
        key: 'low',
        input: 'select',
        selectArray: 'allNoteList',
        label: 'Low'
      },
      {
        className: 'w-[30.75%]',
        show: true,
        key: 'high',
        input: 'select',
        selectArray: 'allNoteList',
        label: 'High'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'whiteKeysOnly',
        input: 'checkbox',
        selectArray: null,
        label: 'WKO'
      }
    ]
  },
  {
    title: 'Articulations (Switch)',
    label: 'artListTog',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[00%]',
        show: false,
        key: 'toggle',
        input: 'checkbox',
        selectArray: null,
        label: 'Toggle'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'codeType',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'on',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'On'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'off',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Off'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'default',
        input: 'select',
        selectArray: 'valDeftList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'delay',
        input: 'text',
        selectArray: null,
        label: 'Delay'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'changeType',
        input: 'select',
        selectArray: 'valChngList',
        label: 'Change'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'ranges',
        input: 'select',
        selectArray: 'artRngsArray',
        label: 'Ranges'
      }
    ]
  },
  {
    title: 'Articulations (Toggle)',
    label: 'artListSwitch',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[00%]',
        show: false,
        key: 'toggle',
        input: 'checkbox',
        selectArray: null,
        label: 'Toggle'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'codeType',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'on',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'On'
      },
      {
        className: 'w-[00%]',
        show: false,
        key: 'off',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Off'
      },
      {
        className: 'w-[19%]',
        show: true,
        key: 'default',
        input: 'checkbox',
        selectArray: 'valDeftList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'delay',
        input: 'text',
        selectArray: null,
        label: 'Delay'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'changeType',
        input: 'select',
        selectArray: 'valChngList',
        label: 'Change'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'ranges',
        input: 'select',
        selectArray: 'artRngsArray',
        label: 'Ranges'
      }
    ]
  },
  {
    title: 'Faders',
    label: 'fadList',
    layout: 'table',
    keys: [
      {
        className: 'w-[7.5%]',
        show: true,
        key: 'id',
        input: undefined,
        selectArray: null,
        label: 'ID'
      },
      {
        className: 'w-[16.5%]',
        show: true,
        key: 'name',
        input: 'text',
        selectArray: null,
        label: 'Name'
      },
      {
        className: 'w-[14%]',
        show: true,
        key: 'codeType',
        input: 'select',
        selectArray: 'valAddrList',
        label: 'Code Type'
      },
      {
        className: 'w-[19.5%]',
        show: true,
        key: 'code',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Code'
      },
      {
        className: 'w-[29%]',
        show: true,
        key: 'default',
        input: 'select',
        selectArray: 'valMidiList',
        label: 'Default'
      },
      {
        className: 'w-[9.5%]',
        show: true,
        key: 'changeType',
        input: 'select',
        selectArray: 'valChngList',
        label: 'Change'
      }
    ]
  }
]
let optionElements: string | React.JSX.Element | undefined

const TrackOptions: FC = () => {
  const { data, refetch } = trpc.items.getSingleItem.useQuery({ itemId: 'T_9' })
  const [selectedItemIndex, setSelectedItemIndex] = useState(0)

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
  for (const element of data?.fullRange ?? []) {
    artRngsArray.push(element?.rangeId)
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

  return (
    <div className='max-h-[85%] w-6/12 overflow-y-scroll'>
      {levelTwoKeys.map((level, levelIndex) => {
        const section = data?.artListSwitch
        //const section =
        //  data![selectedItemIndex]![level.label as unknown as 'artListSwitch']
        //const table = fileMetaData?.layouts[levelIndex]?.layout === 'table'
        const table = true
        return (
          <Fragment key={level.label}>
            <div className='mt-4 flex justify-between'>
              {/*<h2 className='font-caviarBold text-base'>{`${level.title} (${section.length})`}</h2>*/}
              {/*<IconBtnToggle
                classes=''
                titleA=''
                titleB=''
                id='changeLayout'
                a='fa-solid fa-table-cells-large'
                b='fa-solid fa-table-columns'
                defaultIcon={table ? 'a' : 'b'} //this isn't saving the correct icon on refresh
                onToggleA={() => changeLayoutsHelper('cards', levelIndex)}
                onToggleB={() => changeLayoutsHelper('table', levelIndex)}
              />*/}
            </div>
            {table && (
              <div className=''>
                <table className='w-full table-fixed border-separate border-spacing-0 text-left text-xs '>
                  <thead>
                    <tr>
                      {level.keys.map((key) => {
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
                        {/*<button onClick={() => addSubItem(level.label)}>
                          <i className='fa-solid fa-plus' />
                        </button>*/}
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {section?.map((subSection, subSectionIndex) => {
                      return (
                        <tr
                          key={subSection.artId}
                          className={`${trackTr}`}>
                          {level.keys.map((key) => {
                            let multiple: boolean = false
                            const selected: boolean = false
                            const locked = data?.locked
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
                                title={subSection[key.key as 'artId']}
                                className={tw(trackTd, 'p-0.5')}>
                                {!key.input && (
                                  <p className='p-1'>
                                    {subSection[key.key as 'artId']}
                                  </p>
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
                                        ? (subSection[
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
                                {key.input === 'text' ||
                                  (key.input === 'checkbox' && (
                                    <input
                                      checked={
                                        subSection[
                                          key.key as 'changeType'
                                        ] as unknown as boolean
                                      }
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
                                      value={subSection[key.key as 'artId']}
                                    />
                                  ))}
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
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {!table && (
              <div className='flex gap-1 overflow-x-scroll'>
                {section?.map((subSection, subSectionIndex) => {
                  return (
                    <table
                      key={'subSection.id'}
                      className='w-max table-auto border-separate border-spacing-0 text-left text-xs'>
                      <thead>
                        <tr>
                          <td className={tw(trackTh, 'w-1/2')}>
                            {subSection.artId}
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
                        {level.keys.map((key) => {
                          let multiple: boolean = false
                          const locked = data?.locked
                          const keyIsId = key.key === 'id'
                          const disabled = locked ? true : keyIsId

                          for (const array in selectArrays) {
                            if (key.selectArray === 'artRngsArray') {
                              optionElements = (
                                <SelectList numbers={artRngsArray} />
                              )
                              multiple = true
                            }
                            if (key.selectArray === selectArrays[array]?.name) {
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
                                  <p className='p-1'>
                                    {subSection[key.key as 'artId']}
                                  </p>
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
                                        ? (subSection[
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
                                {key.input === 'text' ||
                                  (key.input === 'checkbox' && (
                                    <input
                                      checked={
                                        subSection[
                                          key.key as 'changeType'
                                        ] as unknown as boolean
                                      }
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
                                      value={subSection[key.key as 'artId']}
                                    />
                                  ))}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )
                })}
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

export default TrackOptions
