import {
  type ChangeEvent,
  useState,
  FC,
  Dispatch,
  SetStateAction,
  useEffect
} from 'react'
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
  const [addMultipleItemsNumber, setAddMultipleItemsNumber] = useState(1)

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
      setAddMultipleItemsNumber(input)
    } else {
      setAddMultipleItemsNumber(1)
    }
  }

  const onChangeHelper = ({
    newValue,
    layoutDataSingleId: id,
    key
  }: OnChangeHelperArgsType) => {
    //I need to throttle this so it doesn't fire on every keypress, only when the user stops typing for a second or so.

    updateSingleItemMutation.mutate({
      itemId: id,
      [key]: newValue
    })
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      const selectedInput = window.document.activeElement as HTMLInputElement
      const isSelect = selectedInput?.tagName === 'SELECT'

      const selectedItemIndex =
        data?.findIndex((item) => item.id === selectedItemId) ?? 0
      const previousItemId = data?.[selectedItemIndex - 1]?.id ?? ''
      const nextItemId = data?.[selectedItemIndex + 1]?.id ?? ''

      const selectedInputIsInTrackOptions =
        selectedInput?.id.includes('_FR_') ||
        selectedInput?.id.includes('_AL_') ||
        selectedInput?.id.includes('_FL_')

      const rangeCount = data?.[selectedItemIndex]?._count?.fullRange ?? 0
      const artTogCount = data?.[selectedItemIndex]?._count?.artListTog ?? 0
      const artTapCount = data?.[selectedItemIndex]?._count?.artListTap ?? 0
      const artCount = artTogCount + artTapCount
      const fadCount = data?.[selectedItemIndex]?._count?.fadList ?? 0

      const optionType = selectedInput?.id.split('_')[2]
      const optionNumber = selectedInput?.id.split('_')[3]
      const optionField = selectedInput?.id.split('_')[4]

      if (e.key === 'ArrowUp') {
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') - 1
          let newInput =
            selectedItemId +
            '_' +
            optionType +
            '_' +
            nextNumber +
            '_' +
            optionField
          if (optionType === 'FR' && nextNumber < 0) {
            return
          }
          if (optionType === 'AL' && nextNumber < 0) {
            newInput =
              selectedItemId + '_FR_' + (rangeCount - 1) + '_' + optionField
          }
          if (optionType === 'FL' && nextNumber < 0) {
            newInput =
              selectedItemId + '_AL_' + (artCount - 1) + '_' + optionField
          }

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (previousItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          previousItemId
        )
        const previousInput = window.document.getElementById(newInput ?? '')

        previousInput?.focus()
        setSelectedItemId(previousItemId)
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()

        if (selectedInputIsInTrackOptions) {
          const nextNumber = parseInt(optionNumber ?? '0') + 1
          let newInput =
            selectedItemId +
            '_' +
            optionType +
            '_' +
            nextNumber +
            '_' +
            optionField
          if (optionType === 'FR' && nextNumber > rangeCount - 1) {
            newInput = selectedItemId + '_AL_0_' + optionField
          }
          if (optionType === 'AL' && nextNumber > artCount - 1) {
            newInput = selectedItemId + '_FL_0_' + optionField
          }
          if (optionType === 'FL' && nextNumber > fadCount) return

          const nextInput = window.document.getElementById(newInput ?? '')

          nextInput?.focus()
          return
        }

        if (nextItemId === '') return

        const newInput = selectedInput?.id.replace(
          selectedItemId ?? '',
          nextItemId
        )
        const nextInput = window.document.getElementById(newInput ?? '')

        nextInput?.focus()
        setSelectedItemId(nextItemId)
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        if (isSelect) e.preventDefault()
      }

      if (e.ctrlKey && e.key === 'ArrowRight') {
        if (selectedInputIsInTrackOptions) return
        e.preventDefault()
        const trackOptionsNameInput = window.document.getElementById(
          selectedItemId + '_FR_0_name'
        )
        trackOptionsNameInput?.focus()
      }
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        if (!selectedInputIsInTrackOptions) return
        e.preventDefault()
        const trackListNameInput = window.document.getElementById(
          selectedItemId + '_name'
        )
        trackListNameInput?.focus()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [setSelectedItemId])

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

            const selectedLocked = locked && selectedItemId === id
            const selectedUnlocked = !locked && selectedItemId === id
            const unselectedLocked = locked && selectedItemId !== id
            const unselectedUnlocked = !locked && selectedItemId !== id

            return (
              <tr
                key={id}
                onClick={() => setSelectedItemId(id)}
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
                <td>
                  <div style={{ backgroundColor: color }}>
                    <input
                      type='color'
                      title={selectedItemId + '_color_currentValue: ' + color}
                      disabled={locked}
                      defaultValue={color}
                      className={tw(
                        locked ? 'cursor-not-allowed' : 'cursor-pointer',
                        'w-full opacity-0'
                      )}
                      onChange={(event) =>
                        onChangeHelper({
                          newValue: event.target.value,
                          layoutDataSingleId: id,
                          key: 'color'
                        })
                      }
                    />
                  </div>
                </td>
                <td className='p-0.5 text-center'>
                  <IconBtnToggle
                    classes={''}
                    titleA={selectedItemId + '_locked_currentValue: ' + locked}
                    titleB={selectedItemId + '_locked_currentValue: ' + locked}
                    id={selectedItemId + '_lock'}
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
                <td className={tw('p-0.5', locked ? 'text-gray-400' : '')}>
                  {_count?.artListTog + _count?.artListTap}
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
