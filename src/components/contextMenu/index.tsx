import tw from '@/utils/tw'
import { type Dispatch, type FC, type SetStateAction } from 'react'
import { ContextMenuOptions } from '../utils/contextMenuOptions'
import useMutations from '@/hooks/useMutations'

type ContextMenuProps = {
  contextMenuId: string
  contextMenuPosition: {
    top: number
    left: number
  }
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
}

const ContextMenu: FC<ContextMenuProps> = ({
  contextMenuId,
  contextMenuPosition,
  setIsContextMenuOpen,
  selectedItemId,
  setSelectedItemId
}) => {
  const {
    createSingleItemMutation,
    deleteSingleItemMutation,
    clearSingleItemMutation,
    renumberArtListMutation,
    renumberAllItemsMutation,
    deleteAllItemsMutation,
    updateSingleItemMutation,
    updateSingleFullRangeMutation,
    updateSingleArtListTapMutation,
    updateSingleArtListTogMutation,
    updateSingleFadListMutation,
    updateSingleArtLayerMutation,
    createSingleFullRangeMutation,
    createSingleArtListTapMutation,
    createSingleArtListTogMutation,
    createSingleArtLayerMutation,
    createSingleFadListMutation,
    deleteSingleFullRangeMutation,
    deleteSingleArtListTapMutation,
    deleteSingleArtListTogMutation,
    deleteSingleFadListMutation,
    deleteSingleArtLayerMutation,
    selectedItem
  } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  const isArtTog = (artId: string) => {
    const art = selectedItem?.artListTog?.find((art) => art.id === artId)
    if (art) return true
  }

  const handleClick = (newId: string) => {
    setIsContextMenuOpen(false)

    if (!contextMenuId?.includes(selectedItemId ?? '')) {
      setSelectedItemId(contextMenuId)
      return
    }

    if (newId.includes('break')) return //should be redundant

    if (newId.includes('Track')) {
      switch (newId) {
        case 'moveTrackUp':
          console.log('moveTrackUp')
          break
        case 'moveTrackDown':
          console.log('moveTrackDown')
          break
        case 'addTrackAbove':
          console.log('addTrackAbove')
          break
        case 'addTrackBelow':
          createSingleItemMutation.mutate()
          break
        case 'duplicateTrackAbove':
          console.log('duplicateTrackAbove')
          break
        case 'duplicateTrackBelow':
          console.log('duplicateTrackBelow')
          break
        case 'clearTrack':
          clearSingleItemMutation.mutate({
            itemId: selectedItemId ?? ''
          })
          break
        case 'deleteTrack':
          deleteSingleItemMutation.mutate({
            itemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }
    if (newId.includes('Range')) {
      switch (newId) {
        case 'moveRangeUp':
          console.log('moveRangeUp')
          break
        case 'moveRangeDown':
          console.log('moveRangeDown')
          break
        case 'addRangeAbove':
          console.log('addRangeAbove')
          break
        case 'addRangeBelow':
          createSingleFullRangeMutation.mutate({
            itemId: selectedItemId ?? ''
          })
          break
        case 'duplicateRangeAbove':
          console.log('duplicateRangeAbove')
          break
        case 'duplicateRangeBelow':
          console.log('duplicateRangeBelow')
          break
        case 'clearRange':
          console.log('clearRange')
          break
        case 'deleteRange':
          deleteSingleFullRangeMutation.mutate({
            rangeId: contextMenuId ?? '',
            fileItemsItemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }
    if (newId.includes('Articulation')) {
      switch (newId) {
        case 'moveArticulationUp':
          break
        case 'moveArticulationDown':
          break
        case 'addArticulationAbove':
          break
        case 'addArticulationBelow':
          if (isArtTog(contextMenuId ?? '')) {
            createSingleArtListTogMutation.mutate({
              itemId: selectedItemId ?? ''
            })
          } else {
            createSingleArtListTapMutation.mutate({
              itemId: selectedItemId ?? ''
            })
          }
          break
        case 'duplicateArticulationAbove':
          break
        case 'duplicateArticulationBelow':
          break
        case 'clearArticulation':
          break
        case 'deleteArticulation':
          if (isArtTog(contextMenuId ?? '')) {
            deleteSingleArtListTogMutation.mutate({
              artId: contextMenuId ?? '',
              fileItemsItemId: selectedItemId ?? ''
            })
          } else {
            deleteSingleArtListTapMutation.mutate({
              artId: contextMenuId ?? '',
              fileItemsItemId: selectedItemId ?? ''
            })
          }
          break

        default:
          break
      }
    }
    if (newId.includes('Layer')) {
      switch (newId) {
        case 'moveLayerUp':
          break
        case 'moveLayerDown':
          break
        case 'addLayerAbove':
          break
        case 'addLayerBelow':
          createSingleArtLayerMutation.mutate({
            itemId: selectedItemId ?? ''
          })
          break
        case 'duplicateLayerAbove':
          break
        case 'duplicateLayerBelow':
          break
        case 'clearLayer':
          break
        case 'deleteLayer':
          deleteSingleArtLayerMutation.mutate({
            layerId: contextMenuId ?? '',
            fileItemsItemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }

    if (newId.includes('Fader')) {
      switch (newId) {
        case 'moveFaderUp':
          break
        case 'moveFaderDown':
          break
        case 'addFaderAbove':
          break
        case 'addFaderBelow':
          createSingleFadListMutation.mutate({
            itemId: selectedItemId ?? ''
          })
          break
        case 'duplicateFaderAbove':
          break
        case 'duplicateFaderBelow':
          break
        case 'clearFader':
          break
        case 'deleteFader':
          deleteSingleFadListMutation.mutate({
            fadId: contextMenuId ?? '',
            fileItemsItemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }
  }

  return (
    <div
      className={tw(
        'absolute z-[100] rounded-sm border border-zinc-200 bg-white shadow-md dark:bg-zinc-900',
        'min-h-[15rem] min-w-[10rem] p-4',
        'border border-gray-200 text-xs dark:border-zinc-800'
      )}
      style={{
        top: contextMenuPosition.top,
        left: contextMenuPosition.left
      }}>
      <h3 className='mx-auto'>{`Selected: ${contextMenuId}`}</h3>
      <h3
        className={tw(
          !contextMenuId?.includes(selectedItemId ?? '') ? 'text-red-400' : '',
          'mx-auto'
        )}>{`Current Track: ${selectedItemId}`}</h3>
      <hr className='my-2' />

      {ContextMenuOptions.map((item) => {
        const { id: optionId, label, icon1, icon2 } = item

        let newId = optionId.replace('Item', 'Track')
        let newLabel = label?.replace('Item', 'Track')

        if (contextMenuId.includes('FR_')) {
          newId = optionId.replace('Item', 'Range')
          newLabel = label?.replace('Item', 'Range')
        }
        if (contextMenuId.includes('AT_')) {
          newId = optionId.replace('Item', 'Articulation')
          newLabel = label?.replace('Item', 'Articulation')
        }
        if (contextMenuId.includes('AL_')) {
          newId = optionId.replace('Item', 'Layer')
          newLabel = label?.replace('Item', 'Layer')
        }
        if (contextMenuId.includes('FL_')) {
          newId = optionId.replace('Item', 'Fader')
          newLabel = label?.replace('Item', 'Fader')
        }

        if (optionId.includes('break'))
          return (
            <hr
              key={newId}
              className='my-2'
            />
          )

        return (
          <button
            key={newId}
            onClick={() => {
              handleClick(newId)
            }}
            className='flex items-center gap-2 whitespace-nowrap px-1 py-0.5 hover:bg-zinc-600'>
            <p>{newLabel}</p>
            <i className={`fa-solid ${icon1}`} />
            {icon2 && <i className={`fa-solid ${icon2}`} />}
          </button>
        )
      })}
    </div>
  )
}

export default ContextMenu
