'use client'

import tw from '@/utils/tw'
import { Fragment, type FC } from 'react'
import {
  useMutations,
  useSelectedItem,
  useContextMenu
} from '@/components/context'

export const ContextMenu: FC = () => {
  const {
    selectedItemId,
    setSelectedItemId,
    selectedSubItemId,
    copiedItemId,
    setCopiedItemId,
    setCopiedSubItemId
  } = useSelectedItem()

  const { selectedItem, create, del, clear, paste } = useMutations()

  const { contextMenuId, isContextMenuOpen, contextMenuPosition, close } =
    useContextMenu()

  const isArtTog = (artId: string) => {
    const art = selectedItem?.art_list_tog?.find((art) => art.id === artId)
    if (art) return true
  }

  const ContextMenuOptions = {
    move: {
      moveItemUp: {
        track: {
          action: () => console.log('moveTrackUp')
        },
        range: {
          action: () => console.log('moveRangeUp')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Move Item Up',
        icon1: 'fa-arrow-up',
        icon2: null,
        shortcut: null
      },
      moveItemDown: {
        track: {
          action: () => console.log('moveTrackDown')
        },
        range: {
          action: () => console.log('moveRangeDown')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Move Item Down',
        icon1: 'fa-arrow-down',
        icon2: null,
        shortcut: null
      }
    },
    add: {
      addItemAbove: {
        track: {
          action: () => console.log('addTrackAbove')
        },
        range: {
          action: () => console.log('addRangeAbove')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Add Item Above (ctrl+shift+ArrowUp)',
        icon1: 'fa-plus',
        icon2: 'fa-arrow-up',
        shortcut: 'ctrl+shift+ArrowUp'
      },
      addItemBelow: {
        track: {
          action: () => create.track(1)
        },
        range: {
          action: () =>
            create.fullRange({
              fileitemsItemId: selectedItemId ?? '',
              count: 1
            })
        },
        articulation: {
          action: () => {
            if (isArtTog(contextMenuId ?? '')) {
              create.artListTog({
                fileitemsItemId: selectedItemId ?? '',
                count: 1
              })
            } else {
              create.artListTap({
                fileitemsItemId: selectedItemId ?? '',
                count: 1
              })
            }
          }
        },
        layer: {
          action: () =>
            create.artLayer({
              fileitemsItemId: selectedItemId ?? '',
              count: 1
            })
        },
        fader: {
          action: () =>
            create.fadList({
              fileitemsItemId: selectedItemId ?? '',
              count: 1
            })
        },
        label: 'Add Item Below (ctrl+shift+ArrowDown)',
        icon1: 'fa-plus',
        icon2: 'fa-arrow-down',
        shortcut: 'ctrl+shift+ArrowDown'
      }
    },
    duplicate: {
      duplicateItemAbove: {
        track: {
          action: () => console.log('duplicateTrackAbove')
        },
        range: {
          action: () => console.log('duplicateRangeAbove')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Duplicate Item Above (ctrl+shift+alt+ArrowUp)',
        icon1: 'fa-copy',
        icon2: 'fa-arrow-up',
        shortcut: 'ctrl+shift+alt+ArrowUp'
      },
      duplicateItemBelow: {
        track: {
          action: () => console.log('duplicateTrackBelow')
        },
        range: {
          action: () => console.log('duplicateRangeBelow')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Duplicate Item Below (ctrl+shift+alt+ArrowDown)',
        icon1: 'fa-copy',
        icon2: 'fa-arrow-down',
        shortcut: 'ctrl+shift+alt+ArrowDown'
      }
    },
    copyPaste: {
      copyItem: {
        track: {
          action: () => setCopiedItemId(selectedItemId ?? '')
        },
        range: {
          action: () => setCopiedSubItemId(contextMenuId ?? '')
        },
        articulation: {
          action: () => setCopiedSubItemId(contextMenuId ?? '')
        },
        layer: {
          action: () => setCopiedSubItemId(contextMenuId ?? '')
        },
        fader: {
          action: () => setCopiedSubItemId(contextMenuId ?? '')
        },
        label: 'Copy Item Settings',
        icon1: 'fa-copy',
        icon2: null,
        shortcut: null
      },
      pasteItem: {
        track: {
          action: () => {
            if (!copiedItemId) return
            paste.track({
              destinationItemId: selectedItemId ?? '',
              copiedItemId: copiedItemId ?? ''
            })
          }
        },
        range: {
          action: () => console.log('pasteRange')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Paste Item Settings',
        icon1: 'fa-paste',
        icon2: null,
        shortcut: null
      }
    },
    clearDelete: {
      clearItem: {
        track: {
          action: () => clear.track(selectedItemId ?? '')
        },
        range: {
          action: () => console.log('clearRange')
        },
        articulation: {
          action: () => {}
        },
        layer: {
          action: () => {}
        },
        fader: {
          action: () => {}
        },
        label: 'Clear Item',
        icon1: 'fa-eraser',
        icon2: null,
        shortcut: null
      },
      deleteItem: {
        track: {
          action: () => del.track(selectedItemId ?? '')
        },
        range: {
          action: () =>
            del.fullRange({
              id: contextMenuId ?? '',
              fileitemsItemId: selectedItemId ?? ''
            })
        },
        articulation: {
          action: () => {
            if (isArtTog(contextMenuId ?? '')) {
              del.artListTog({
                id: contextMenuId ?? '',
                fileitemsItemId: selectedItemId ?? ''
              })
            } else {
              del.artListTap({
                id: contextMenuId ?? '',
                fileitemsItemId: selectedItemId ?? ''
              })
            }
          }
        },
        layer: {
          action: () =>
            del.artLayer({
              id: contextMenuId ?? '',
              fileitemsItemId: selectedItemId ?? ''
            })
        },
        fader: {
          action: () =>
            del.fadList({
              id: contextMenuId ?? '',
              fileitemsItemId: selectedItemId ?? ''
            })
        },
        label: 'Delete Item (ctrl+del)',
        icon1: 'fa-xmark',
        icon2: null,
        shortcut: 'ctrl+del'
      }
    }
  } as const

  if (!isContextMenuOpen) return null

  return (
    <div className='absolute left-0 top-0 z-[100]'>
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
            !contextMenuId.includes(selectedItemId) ? 'text-red-400' : '',
            'mx-auto'
          )}>{`Current Track: ${selectedItemId}`}</h3>

        {(contextMenuId?.includes('FR_') ||
          contextMenuId?.includes('AT_') ||
          contextMenuId?.includes('AL_') ||
          contextMenuId?.includes('FL_')) && (
          <h3
            className={tw(
              !contextMenuId.includes(selectedSubItemId) ? 'text-red-400' : '',
              'mx-auto'
            )}>{`Current SubItem: ${selectedSubItemId}`}</h3>
        )}
        <h3 className='mx-auto'>{`Selected: ${contextMenuId}`}</h3>

        {Object.entries(ContextMenuOptions).map(([key, item]) => {
          return (
            <Fragment key={key}>
              <hr className='my-2' />

              {Object.entries(item).map(([subKey, subItem]) => {
                const {
                  label,
                  icon1,
                  icon2,
                  track,
                  range,
                  articulation,
                  layer,
                  fader
                } = subItem

                let contextMenuLabel = label.replace('Item', 'Track')
                let action = track.action

                if (contextMenuId?.includes('FR_')) {
                  contextMenuLabel = label.replace('Item', 'Range')
                  action = range.action
                }
                if (contextMenuId?.includes('AT_')) {
                  contextMenuLabel = label.replace('Item', 'Articulation')
                  action = articulation.action
                }
                if (contextMenuId?.includes('AL_')) {
                  contextMenuLabel = label.replace('Item', 'Layer')
                  action = layer.action
                }
                if (contextMenuId?.includes('FL_')) {
                  contextMenuLabel = label.replace('Item', 'Fader')
                  action = fader.action
                }

                return (
                  <button
                    key={subKey}
                    onClick={() => {
                      if (!contextMenuId.includes(selectedItemId)) {
                        setSelectedItemId(contextMenuId)
                        return
                      }
                      action()
                      close()
                    }}
                    className='flex items-end gap-2 whitespace-nowrap px-1 py-0.5 hover:bg-zinc-600'>
                    <p>{contextMenuLabel}</p>
                    <i className={`fa-solid ${icon1}`} />
                    {icon2 && <i className={`fa-solid ${icon2}`} />}
                  </button>
                )
              })}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ContextMenu
