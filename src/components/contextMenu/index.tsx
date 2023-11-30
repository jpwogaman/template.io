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
  const { createSingleItemMutation, deleteSingleItemMutation } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

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
          console.log('clearTrack')
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
          console.log('addRangeBelow')
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
          console.log('deleteRange')
          break

        default:
          break
      }
    }
    if (newId.includes('Articulation')) {
      switch (newId) {
        case 'moveArtUp':
          console.log('moveArtUp')
          break
        case 'moveArtDown':
          console.log('moveArtDown')
          break
        case 'addArtAbove':
          console.log('addArtAbove')
          break
        case 'addArtBelow':
          console.log('addArtBelow')
          break
        case 'duplicateArtAbove':
          console.log('duplicateArtAbove')
          break
        case 'duplicateArtBelow':
          console.log('duplicateArtBelow')
          break
        case 'clearArt':
          console.log('clearArt')
          break
        case 'deleteArt':
          console.log('deleteArt')
          break

        default:
          break
      }
    }
    if (newId.includes('Fader')) {
      switch (newId) {
        case 'moveFadUp':
          console.log('moveFadUp')
          break
        case 'moveFadDown':
          console.log('moveFadDown')
          break
        case 'addFadAbove':
          console.log('addFadAbove')
          break
        case 'addFadBelow':
          console.log('addFadBelow')
          break
        case 'duplicateFadAbove':
          console.log('duplicateFadAbove')
          break
        case 'duplicateFadBelow':
          console.log('duplicateFadBelow')
          break
        case 'clearFad':
          console.log('clearFad')
          break
        case 'deleteFad':
          console.log('deleteFad')
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
        if (contextMenuId.includes('AL_')) {
          newId = optionId.replace('Item', 'Articulation')
          newLabel = label?.replace('Item', 'Articulation')
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
            className='flex items-center gap-2 whitespace-nowrap'>
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
