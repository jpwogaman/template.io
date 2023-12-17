import tw from '@/utils/tw'
import { type Dispatch, type FC, type SetStateAction } from 'react'
import { ContextMenuOptions } from '../utils/contextMenuOptions'
import useMutations from '@/hooks/useMutations'
import { set } from 'zod'

type ContextMenuProps = {
  contextMenuId: string
  contextMenuPosition: {
    top: number
    left: number
  }
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
  selectedSubItemId: string | null
  setSelectedSubItemId: Dispatch<SetStateAction<string | null>>
  copiedItemId: string | null
  setCopiedItemId: Dispatch<SetStateAction<string | null>>
  copiedSubItemId: string | null
  setCopiedSubItemId: Dispatch<SetStateAction<string | null>>
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
}

const ContextMenu: FC<ContextMenuProps> = ({
  contextMenuId,
  contextMenuPosition,
  setIsContextMenuOpen,
  selectedItemId,
  setSelectedItemId,
  selectedSubItemId,
  setSelectedSubItemId,
  copiedItemId,
  setCopiedItemId,
  copiedSubItemId,
  setCopiedSubItemId
}) => {
  const { selectedItem, create, del, clear, paste } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  const isArtTog = (artId: string) => {
    const art = selectedItem?.artListTog?.find((art) => art.id === artId)
    if (art) return true
  }

  const handleClick = (newMenuId: string) => {
    setIsContextMenuOpen(false)

    if (!contextMenuId?.includes(selectedItemId ?? '')) {
      setSelectedItemId(contextMenuId)
      return
    }

    if (newMenuId.includes('break')) return //should be redundant

    if (newMenuId.includes('Track')) {
      switch (newMenuId) {
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
          create.track({ count: 1 })
          break
        case 'duplicateTrackAbove':
          console.log('duplicateTrackAbove')
          break
        case 'duplicateTrackBelow':
          console.log('duplicateTrackBelow')
          break
        case 'copyTrack':
          setCopiedItemId(selectedItemId ?? '')
          break
        case 'pasteTrack':
          if (!copiedItemId) return
          paste.track({
            destinationItemId: selectedItemId ?? '',
            copiedItemId: copiedItemId ?? ''
          })
          break
        case 'clearTrack':
          clear.track({
            itemId: selectedItemId ?? ''
          })
          break
        case 'deleteTrack':
          del.track({
            itemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }
    if (newMenuId.includes('Range')) {
      switch (newMenuId) {
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
          create.fullRange({
            itemId: selectedItemId ?? ''
          })
          break
        case 'duplicateRangeAbove':
          console.log('duplicateRangeAbove')
          break
        case 'duplicateRangeBelow':
          console.log('duplicateRangeBelow')
          break
        case 'copyRange':
          setCopiedSubItemId(contextMenuId ?? '')
          break
        case 'pasteRange':
          console.log('pasteRange')
          break
        case 'clearRange':
          console.log('clearRange')
          break
        case 'deleteRange':
          del.fullRange({
            rangeId: contextMenuId ?? '',
            fileItemsItemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }
    if (newMenuId.includes('Articulation')) {
      switch (newMenuId) {
        case 'moveArticulationUp':
          break
        case 'moveArticulationDown':
          break
        case 'addArticulationAbove':
          break
        case 'addArticulationBelow':
          if (isArtTog(contextMenuId ?? '')) {
            create.artListTog({
              itemId: selectedItemId ?? ''
            })
          } else {
            create.artListTap({
              itemId: selectedItemId ?? ''
            })
          }
          break
        case 'duplicateArticulationAbove':
          break
        case 'duplicateArticulationBelow':
          break
        case 'copyArticulation':
          setCopiedSubItemId(contextMenuId ?? '')
          break
        case 'pasteArticulation':
          break
        case 'clearArticulation':
          break
        case 'deleteArticulation':
          if (isArtTog(contextMenuId ?? '')) {
            del.artListTog({
              artId: contextMenuId ?? '',
              fileItemsItemId: selectedItemId ?? ''
            })
          } else {
            del.artListTap({
              artId: contextMenuId ?? '',
              fileItemsItemId: selectedItemId ?? ''
            })
          }
          break

        default:
          break
      }
    }
    if (newMenuId.includes('Layer')) {
      switch (newMenuId) {
        case 'moveLayerUp':
          break
        case 'moveLayerDown':
          break
        case 'addLayerAbove':
          break
        case 'addLayerBelow':
          create.artLayer({
            itemId: selectedItemId ?? ''
          })
          break
        case 'duplicateLayerAbove':
          break
        case 'duplicateLayerBelow':
          break
        case 'copyLayer':
          setCopiedSubItemId(contextMenuId ?? '')
          break
        case 'pasteLayer':
          break
        case 'clearLayer':
          break
        case 'deleteLayer':
          del.artLayer({
            layerId: contextMenuId ?? '',
            fileItemsItemId: selectedItemId ?? ''
          })
          break

        default:
          break
      }
    }
    if (newMenuId.includes('Fader')) {
      switch (newMenuId) {
        case 'moveFaderUp':
          break
        case 'moveFaderDown':
          break
        case 'addFaderAbove':
          break
        case 'addFaderBelow':
          create.fadList({
            itemId: selectedItemId ?? ''
          })
          break
        case 'duplicateFaderAbove':
          break
        case 'duplicateFaderBelow':
          break
        case 'copyFader':
          setCopiedSubItemId(contextMenuId ?? '')
          break
        case 'pasteFader':
          break
        case 'clearFader':
          break
        case 'deleteFader':
          del.fadList({
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
      <h3
        className={tw(
          !contextMenuId?.includes(selectedItemId ?? '') ? 'text-red-400' : '',
          'mx-auto'
        )}>{`Current Track: ${selectedItemId}`}</h3>

      {(contextMenuId?.includes('FR_') ||
        contextMenuId?.includes('AT_') ||
        contextMenuId?.includes('AL_') ||
        contextMenuId?.includes('FL_')) && (
        <h3
          className={tw(
            !contextMenuId?.includes(selectedSubItemId ?? '')
              ? 'text-red-400'
              : '',
            'mx-auto'
          )}>{`Current SubItem: ${selectedSubItemId}`}</h3>
      )}
      <h3 className='mx-auto'>{`Selected: ${contextMenuId}`}</h3>
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
            className='flex items-end gap-2 whitespace-nowrap px-1 py-0.5 hover:bg-zinc-600'>
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
