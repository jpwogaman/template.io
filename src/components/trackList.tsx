import { type ChangeEvent, useState, FC, Dispatch, SetStateAction } from 'react'
import { trpc } from '@/utils/trpc'
import { selectArrays } from '@/components/select-arrays'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackListTableKeys from './trackListTableKeys'
import { TdInput } from './input-text'
import { TdSelect } from './input-select'

let optionElements: string | React.JSX.Element | undefined
type TrackListProps = {
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
}

const TrackList: FC<TrackListProps> = ({
  selectedItemId,
  setSelectedItemId
}) => {
  const [addMultipleItemsNumber, setMultipleItemsNumber] = useState(1)

  const { data, refetch } = trpc.items.getAllItems.useQuery()

  const createItemsHelper = () => {
    if (addMultipleItemsNumber >= 51) {
      alert('You may only add 50 tracks at one time.')
      return
    }

    for (let i = 0; i < addMultipleItemsNumber; i++) {
      createSingleItemMutation.mutate()
    }
  }

  const createSingleItemMutation = trpc.items.createSingleItem.useMutation({
    onSuccess: () => {
      createSingleItemMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
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

  const deleteSingleItemMutation = trpc.items.deleteSingleItem.useMutation({
    onSuccess: () => {
      deleteSingleItemMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const setMultipleItemsNumberHelper = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value as unknown as number
    if (input > 1) {
      setMultipleItemsNumber(input)
    } else {
      setMultipleItemsNumber(1)
    }
  }

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

  const trackTr = `bg-zinc-300  
  dark:bg-zinc-600 
  hover:bg-zinc-500 
  dark:hover:bg-zinc-400       
  hover:text-zinc-50 
  dark:hover:text-zinc-50        
 `

  const trackTd = ``

  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      {/*<div className='z-50 mt-4 flex gap-2'>
        <h2 className='font-caviarBold text-base'>{`${TrackListTableKeys.label} (${data?.length})`}</h2>
      </div>*/}
      <table className='w-full table-fixed border-separate border-spacing-0 text-left text-xs'>
        <thead>
          <tr>
            <td className={tw(trackTh, 'sticky z-50 w-[20px]')} />
            <td className={tw(trackTh, 'sticky z-50 w-[5%]')} />
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
            <td className={tw(trackTh, 'sticky z-50 w-[5%]')}>Arts.</td>
            <td className={tw(trackTh, 'sticky z-50 w-[10%] p-0.5')}>
              <button
                onClick={createItemsHelper}
                className='min-h-[20px] w-1/2'>
                <i className='fa-solid fa-plus' />
              </button>
              <input
                value={addMultipleItemsNumber}
                onChange={setMultipleItemsNumberHelper}
                className='min-h-[20px] w-1/2 bg-white px-1 text-zinc-900 dark:bg-zinc-100'
              />
            </td>
            <td className={tw(trackTh, 'sticky z-50 w-[5%]')} />
          </tr>
        </thead>
        <tbody>
          {data?.map((item, thisIndex) => {
            const { id, color, locked, _count } = item
            return (
              <tr
                key={id}
                onClick={() => setSelectedItemId(id)}
                className={tw(
                  trackTr,
                  selectedItemId === id
                    ? 'bg-red-300 text-zinc-50 hover:bg-zinc-600 dark:bg-red-400 dark:hover:bg-zinc-300 dark:hover:text-zinc-800'
                    : '',
                  'relative cursor-pointer'
                )}>
                <td className={tw(trackTd, 'p-0.5')}>
                  <button
                    //onClick={() => showColorSelectorHelper(thisIndex)}
                    style={{ backgroundColor: color }}
                    className='h-[25px] w-full rounded-sm'></button>
                </td>
                <td className={tw(trackTd, 'p-0.5 text-center')}>
                  <IconBtnToggle
                    classes={''}
                    titleA='Lock Item'
                    titleB='Unlock Item'
                    id='lockItem'
                    a='fa-solid fa-lock-open'
                    b='fa-solid fa-lock'
                    defaultIcon={locked ? 'b' : 'a'}
                    onToggleA={() =>
                      updateSingleItemMutation.mutate({
                        itemId: id,
                        locked: true
                      })
                    }
                    onToggleB={() =>
                      updateSingleItemMutation.mutate({
                        itemId: id,
                        locked: false
                      })
                    }
                  />
                </td>
                {TrackListTableKeys.keys.map((keyActual) => {
                  const { key, input, selectArray, show } = keyActual

                  const inputCheckBox = input === 'checkbox'
                  const inputSelect = input === 'select'
                  const inputText = input === 'text'

                  const keyIsId = key === 'id'
                  const disabled = inputCheckBox
                    ? false
                    : locked
                    ? true
                    : keyIsId

                  for (const array in selectArrays) {
                    if (selectArray === selectArrays[array]?.name) {
                      optionElements = selectArrays[array]?.array
                    }
                  }
                  if (!show) return

                  return (
                    <td
                      key={key}
                      className={tw(trackTd, 'p-0.5')}>
                      <div
                        className={tw(
                          inputCheckBox ? 'mx-auto w-[20px]' : 'w-full'
                        )}>
                        {!input && (
                          <p
                            title={item[key] as string}
                            className='overflow-hidden p-1'>
                            {item[key]}
                          </p>
                        )}
                        {inputSelect && (
                          <TdSelect
                            id={key + id}
                            options={selectArray as string}
                            codeDisabled={disabled}
                            onSelect={(event) =>
                              updateSingleItemMutation.mutate({
                                itemId: id,
                                [key]: event.target.value
                              })
                            }
                            defaultValue={item[key] as unknown as string}
                          />
                        )}

                        {inputText && (
                          <TdInput
                            id={key + id}
                            title=''
                            placeholder=''
                            td={true}
                            codeDisabled={disabled}
                            onInput={(event) =>
                              updateSingleItemMutation.mutate({
                                itemId: id,
                                [key]: event.target.value
                              })
                            }
                            defaultValue={item[key] as unknown as string}
                          />
                        )}

                        {inputCheckBox && (
                          <input
                            checked={item.locked}
                            disabled={disabled}
                            type='checkbox'
                            className={tw(
                              'w-full p-1 text-zinc-900',
                              inputCheckBox ? 'cursor-pointer' : '',
                              disabled
                                ? 'cursor-not-allowed bg-zinc-300'
                                : 'bg-white dark:bg-zinc-100'
                            )}
                            onChange={(event) =>
                              updateSingleItemMutation.mutate({
                                itemId: id,
                                [key]: event.target.value
                              })
                            }
                            value={item[key] as string}
                          />
                        )}
                      </div>
                    </td>
                  )
                })}
                <td className={tw(trackTd, 'p-0.5')}>
                  {_count?.artListTog + _count?.artListSwitch}
                </td>
                <td className={tw(trackTd, 'p-0.5 text-center')}>
                  <button
                    onClick={() =>
                      deleteSingleItemMutation.mutate({
                        itemId: id
                      })
                    }>
                    <i className='fa-solid fa-minus' />
                  </button>
                </td>
                <td className={tw(trackTd, 'p-0.5 text-center')}>
                  <button
                  //onClick={() => duplicateItem(thisIndex)}
                  >
                    <i className='fa-solid fa-copy' />
                  </button>
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
