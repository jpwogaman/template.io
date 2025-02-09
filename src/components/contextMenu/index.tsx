'use client'

import tw from '@/components/utils/tw'
import { Fragment, type FC, type ChangeEvent } from 'react'
import {
  useMutations,
  useSelectedItem,
  useContextMenu,
  type SubItemId
} from '@/components/context'

import {
  HiOutlineArrowUp,
  HiOutlineArrowDown,
  HiOutlinePlus,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentDuplicate,
  HiOutlineClipboardDocumentCheck,
  HiOutlineXMark,
  HiOutlineArrowUturnLeft
} from 'react-icons/hi2'

export const ContextMenu: FC = () => {
  const { contextMenuId, isContextMenuOpen, contextMenuPosition, close } =
    useContextMenu()
  const { setCopiedItemId, setCopiedSubItemId } = useSelectedItem()
  const { selectedItem, create, del, clear } = useMutations()
  const { settings, updateSettings } = useSelectedItem()
  const {
    selected_item_id,
    selected_sub_item_id,
    track_add_count,
    sub_item_add_count
  } = settings

  const isArtTog = (artId: SubItemId) => {
    const art = selectedItem?.art_list_tog?.find((art) => art.id === artId)
    if (art) return true
  }

  const ContextMenuOptions = {
    move: {
      moveItemUp: {
        track: {
          action: null
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Move Item Up',
        icon1: <HiOutlineArrowUp className='h-3 w-3' />,
        icon2: null,
        shortcut: null
      },
      moveItemDown: {
        track: {
          action: null
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Move Item Down',
        icon1: <HiOutlineArrowDown className='h-3 w-3' />,
        icon2: null,
        shortcut: null
      }
    },
    add: {
      addItemAbove: {
        track: {
          action: null
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Add Item Above (ctrl+shift+ArrowUp)',
        icon1: <HiOutlinePlus className='h-3 w-3' />,
        icon2: <HiOutlineArrowUp className='h-3 w-3' />,
        shortcut: 'CTRL_SHIFT_ARROWUP'
      },
      addItemAtEnd: {
        track: {
          action: () => create.track()
        },
        range: {
          action: () =>
            create.fullRange({
              fileitemsItemId: selected_item_id
            })
        },
        articulation: {
          action: () => {
            if (isArtTog(contextMenuId as SubItemId)) {
              create.artListTog({
                fileitemsItemId: selected_item_id
              })
            } else {
              create.artListTap({
                fileitemsItemId: selected_item_id
              })
            }
          }
        },
        layer: {
          action: () =>
            create.artLayer({
              fileitemsItemId: selected_item_id
            })
        },
        fader: {
          action: () =>
            create.fadList({
              fileitemsItemId: selected_item_id
            })
        },
        label: 'Add Item At End (ctrl+shift+ArrowDown)',
        icon1: <HiOutlinePlus className='h-3 w-3' />,
        icon2: <HiOutlineArrowDown className='h-3 w-3' />,
        shortcut: 'CTRL_SHIFT_ARROWDOWN'
      }
    },
    duplicate: {
      duplicateItemAbove: {
        track: {
          action: null
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Duplicate Item Above (ctrl+shift+alt+ArrowUp)',
        icon1: <HiOutlineDocumentDuplicate className='h-3 w-3' />,
        icon2: <HiOutlineArrowUp className='h-3 w-3' />,
        shortcut: 'CTRL_SHIFT_ALT_ARROWUP'
      },
      duplicateItemBelow: {
        track: {
          action: null
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Duplicate Item Below (ctrl+shift+alt+ArrowDown)',
        icon1: <HiOutlineDocumentDuplicate className='h-3 w-3' />,
        icon2: <HiOutlineArrowDown className='h-3 w-3' />,
        shortcut: 'CTRL_SHIFT_ALT_ARROWDOWN'
      }
    },
    copyPaste: {
      copyItem: {
        track: {
          action: () => setCopiedItemId(selected_item_id)
        },
        range: {
          action: () => setCopiedSubItemId(contextMenuId as SubItemId)
        },
        articulation: {
          action: () => setCopiedSubItemId(contextMenuId as SubItemId)
        },
        layer: {
          action: () => setCopiedSubItemId(contextMenuId as SubItemId)
        },
        fader: {
          action: () => setCopiedSubItemId(contextMenuId as SubItemId)
        },
        label: 'Copy Item Settings',
        icon1: <HiOutlineClipboardDocumentList className='h-3 w-3' />,
        icon2: null,
        shortcut: null
      },
      pasteItem: {
        track: {
          action: null
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Paste Item Settings',
        icon1: <HiOutlineClipboardDocumentCheck className='h-3 w-3' />,
        icon2: null,
        shortcut: null
      }
    },
    clearDelete: {
      clearItem: {
        track: {
          action: () => {
            clear.track(selected_item_id)
          }
        },
        range: {
          action: null
        },
        articulation: {
          action: null
        },
        layer: {
          action: null
        },
        fader: {
          action: null
        },
        label: 'Clear Item',
        icon1: <HiOutlineArrowUturnLeft className='h-3 w-3' />,
        icon2: null,
        shortcut: null
      },
      deleteItem: {
        track: {
          action: () => del.track(selected_item_id)
        },
        range: {
          action: () =>
            del.fullRange({
              id: contextMenuId as SubItemId,
              fileitemsItemId: selected_item_id
            })
        },
        articulation: {
          action: () => {
            if (isArtTog(contextMenuId as SubItemId)) {
              del.artListTog({
                id: contextMenuId as SubItemId,
                fileitemsItemId: selected_item_id
              })
            } else {
              del.artListTap({
                id: contextMenuId as SubItemId,
                fileitemsItemId: selected_item_id
              })
            }
          }
        },
        layer: {
          action: () =>
            del.artLayer({
              id: contextMenuId as SubItemId,
              fileitemsItemId: selected_item_id
            })
        },
        fader: {
          action: () =>
            del.fadList({
              id: contextMenuId as SubItemId,
              fileitemsItemId: selected_item_id
            })
        },
        label: 'Delete Item (ctrl+del)',
        icon1: <HiOutlineXMark className='h-3 w-3' />,
        icon2: null,
        shortcut: 'CTRL_DELETE'
      }
    }
  } as const

  if (!isContextMenuOpen) return null

  
  const contextMenuIsSubItem =
    contextMenuId?.includes('FR_') || // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    contextMenuId?.includes('AT_') || // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    contextMenuId?.includes('AL_') || // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    contextMenuId?.includes('FL_')

  return (
    <div className='absolute top-0 left-0 z-100'>
      <div
        className={tw(
          'absolute z-100 rounded-xs border border-zinc-200 bg-white shadow-md dark:bg-zinc-900',
          'min-h-[15rem] min-w-[10rem] p-4',
          'border border-gray-200 text-xs dark:border-zinc-800'
        )}
        style={{
          top: contextMenuPosition.top,
          left: contextMenuPosition.left
        }}>
        <div className='flex'>
          <div className='w-3/4'>
            <h3
              className={tw(
                !contextMenuId?.includes(selected_item_id)
                  ? 'text-red-400'
                  : '',
                'mx-auto'
              )}>{`Current Track: ${selected_item_id}`}</h3>

            {contextMenuIsSubItem && (
              <h3
                className={tw(
                  !contextMenuId?.includes(selected_sub_item_id)
                    ? 'text-red-400'
                    : '',
                  'mx-auto'
                )}>{`Current SubItem: ${selected_sub_item_id}`}</h3>
            )}
            <h3 className='mx-auto'>{`Selected: ${contextMenuId}`}</h3>
          </div>
          <div className='flex w-1/4 justify-end'>
            <input
              type='number'
              id='contextMenuCountInput'
              max={10}
              min={1}
              value={
                contextMenuIsSubItem
                  ? (sub_item_add_count ?? 1)
                  : (track_add_count ?? 1)
              }
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.stopPropagation()
                e.preventDefault()
                const newValue = parseInt(e.target.value) || 1
                if (contextMenuIsSubItem) {
                  void updateSettings({
                    key: 'sub_item_add_count',
                    value: newValue
                  })
                } else {
                  void updateSettings({
                    key: 'track_add_count',
                    value: newValue
                  })
                }
              }}
              className={tw(
                'h-full w-1/2',
                'hover:cursor-text',
                'rounded-xs bg-inherit p-1 outline-hidden',
                'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
              )}
            />
          </div>
        </div>

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

                const contextMenuMap: Record<
                  string,
                  { label: string; action: () => void | null }
                > = {
                  FR_: { label: 'Range', action: range.action },
                  AT_: { label: 'Articulation', action: articulation.action },
                  AL_: { label: 'Layer', action: layer.action },
                  FL_: { label: 'Fader', action: fader.action }
                }

                let contextMenuLabel = label.replace('Item', 'Track')
                let action = track.action

                for (const [
                  prefix,
                  { label: mappedLabel, action: mappedAction }
                ] of Object.entries(contextMenuMap)) {
                  if (contextMenuId?.includes(prefix)) {
                    contextMenuLabel = label.replace('Item', mappedLabel)
                    action = mappedAction
                    break
                  }
                }

                if (key === 'add') {
                  const count = contextMenuIsSubItem
                    ? sub_item_add_count
                    : track_add_count
                  contextMenuLabel = contextMenuLabel.replace(
                    'Add',
                    `Add ${count ?? 1}`
                  )

                  if (count && count > 1) {
                    const singularToPlural: Record<string, string> = {
                      Range: 'Ranges',
                      Track: 'Tracks',
                      Articulation: 'Articulations',
                      Layer: 'Layers',
                      Fader: 'Faders'
                    }

                    for (const [singular, plural] of Object.entries(
                      singularToPlural
                    )) {
                      if (contextMenuLabel.includes(singular)) {
                        contextMenuLabel = contextMenuLabel.replace(
                          singular,
                          plural
                        )
                        break
                      }
                    }
                  }
                }

                return (
                  <button
                    key={subKey}
                    onClick={() => {
                      if (!action) return
                      if (!contextMenuId?.includes(selected_item_id)) {
                        void updateSettings({
                          key: 'selected_item_id',
                          value: contextMenuId
                        })
                        return
                      }
                      action()
                      close()
                    }}
                    className={tw(
                      !action ? 'opacity-30' : '',
                      'flex items-end gap-2 px-1 py-0.5 whitespace-nowrap hover:bg-zinc-600'
                    )}>
                    <p>{contextMenuLabel}</p>
                    {icon1}
                    {icon2}
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
