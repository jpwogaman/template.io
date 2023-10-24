import { type ChangeEvent, useState, FC, Dispatch, SetStateAction } from 'react'
import { trpc } from '@/utils/trpc'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackListTableKeys from './trackListTableKeys'
import {
  type OnChangeHelperArgsType,
  type SelectedItemType,
  InputTypeSelector
} from './inputs'

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

  const { refetch: refetchSelected } = trpc.items.getSingleItem.useQuery({
    itemId: selectedItemId ?? ''
  })

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
      refetchSelected()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const deleteSingleItemMutation = trpc.items.deleteSingleItem.useMutation({
    onSuccess: () => {
      deleteSingleItemMutation.reset()
      refetch()
      refetchSelected()
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

  const onChangeHelper = ({
    newValue,
    layoutDataSingleId: id,
    key
  }: OnChangeHelperArgsType) => {
    updateSingleItemMutation.mutate({
      itemId: id,
      [key]: newValue
    })
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
                title={`Add Tracks (${addMultipleItemsNumber})`}
                onClick={createItemsHelper}
                className='min-h-[20px] w-1/2'>
                <i className='fa-solid fa-plus' />
              </button>
              <input
                title={`Add Tracks (${addMultipleItemsNumber})`}
                value={addMultipleItemsNumber}
                onChange={setMultipleItemsNumberHelper}
                className='min-h-[20px] w-1/2 border border-transparent bg-inherit px-1 pl-1 placeholder-zinc-400 outline-offset-4 outline-green-600 focus:cursor-text focus:bg-white focus:text-zinc-900 focus:placeholder-zinc-500 dark:placeholder-zinc-500 dark:outline-green-800'
              />
            </td>
            <td className={tw(trackTh, 'sticky z-50 w-[5%]')} />
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => {
            const { id, color, locked, _count } = item
            return (
              <tr
                key={id}
                onClick={() => setSelectedItemId(id)}
                className={tw(
                  selectedItemId === id
                    ? 'bg-red-300 text-zinc-50 hover:bg-red-400 dark:bg-red-700 dark:hover:bg-red-800'
                    : 'bg-zinc-300 hover:bg-zinc-500 hover:text-zinc-50 dark:bg-zinc-600 dark:hover:bg-zinc-400  dark:hover:text-zinc-50',
                  'relative cursor-pointer'
                )}>
                <td className='p-0.5'>
                  <button
                    //onClick={() => showColorSelectorHelper(thisIndex)}
                    style={{ backgroundColor: color }}
                    className='h-[25px] w-full rounded-sm'></button>
                </td>
                <td className='p-0.5 text-center'>
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
                  const { key, show } = keyActual
                  if (!show) return
                  return (
                    <td
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
                <td className='p-0.5'>
                  {_count?.artListTog + _count?.artListSwitch}
                </td>
                <td className='p-0.5 text-center'>
                  <button
                    onClick={() =>
                      deleteSingleItemMutation.mutate({
                        itemId: id
                      })
                    }>
                    <i className='fa-solid fa-minus' />
                  </button>
                </td>
                <td className='p-0.5 text-center'>
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
