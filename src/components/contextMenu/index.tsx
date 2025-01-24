'use client'

import tw from '@/utils/tw'
import { Fragment, type FC, type ChangeEvent } from 'react'
import {
  useMutations,
  useSelectedItem,
  useContextMenu
} from '@/components/context'

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

  const isArtTog = (artId: string) => {
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
        icon1: 'fa-arrow-up',
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
        icon1: 'fa-arrow-down',
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
        icon1: 'fa-plus',
        icon2: 'fa-arrow-up',
        shortcut: 'CTRL_SHIFT_ARROWUP'
      },
      addItemAtEnd: {
        track: {
          action: () => create.track(track_add_count ?? 1)
        },
        range: {
          action: () =>
            create.fullRange({
              fileitemsItemId: selected_item_id ?? '',
              count: sub_item_add_count ?? 1
            })
        },
        articulation: {
          action: () => {
            if (isArtTog(contextMenuId)) {
              create.artListTog({
                fileitemsItemId: selected_item_id ?? '',
                count: sub_item_add_count ?? 1
              })
            } else {
              create.artListTap({
                fileitemsItemId: selected_item_id ?? '',
                count: sub_item_add_count ?? 1
              })
            }
          }
        },
        layer: {
          action: () =>
            create.artLayer({
              fileitemsItemId: selected_item_id ?? '',
              count: sub_item_add_count ?? 1
            })
        },
        fader: {
          action: () =>
            create.fadList({
              fileitemsItemId: selected_item_id ?? '',
              count: sub_item_add_count ?? 1
            })
        },
        label: 'Add Item At End (ctrl+shift+ArrowDown)',
        icon1: 'fa-plus',
        icon2: 'fa-arrow-down',
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
        icon1: 'fa-copy',
        icon2: 'fa-arrow-up',
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
        icon1: 'fa-copy',
        icon2: 'fa-arrow-down',
        shortcut: 'CTRL_SHIFT_ALT_ARROWDOWN'
      }
    },
    copyPaste: {
      copyItem: {
        track: {
          action: () => setCopiedItemId(selected_item_id ?? '')
        },
        range: {
          action: () => setCopiedSubItemId(contextMenuId)
        },
        articulation: {
          action: () => setCopiedSubItemId(contextMenuId)
        },
        layer: {
          action: () => setCopiedSubItemId(contextMenuId)
        },
        fader: {
          action: () => setCopiedSubItemId(contextMenuId)
        },
        label: 'Copy Item Settings',
        icon1: 'fa-copy',
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
        icon1: 'fa-paste',
        icon2: null,
        shortcut: null
      }
    },
    clearDelete: {
      clearItem: {
        track: {
          action: () => clear.track(selected_item_id ?? '')
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
        icon1: 'fa-eraser',
        icon2: null,
        shortcut: null
      },
      deleteItem: {
        track: {
          action: () => del.track(selected_item_id ?? '')
        },
        range: {
          action: () =>
            del.fullRange({
              id: contextMenuId,
              fileitemsItemId: selected_item_id ?? ''
            })
        },
        articulation: {
          action: () => {
            if (isArtTog(contextMenuId)) {
              del.artListTog({
                id: contextMenuId,
                fileitemsItemId: selected_item_id ?? ''
              })
            } else {
              del.artListTap({
                id: contextMenuId,
                fileitemsItemId: selected_item_id ?? ''
              })
            }
          }
        },
        layer: {
          action: () =>
            del.artLayer({
              id: contextMenuId,
              fileitemsItemId: selected_item_id ?? ''
            })
        },
        fader: {
          action: () =>
            del.fadList({
              id: contextMenuId,
              fileitemsItemId: selected_item_id ?? ''
            })
        },
        label: 'Delete Item (ctrl+del)',
        icon1: 'fa-xmark',
        icon2: null,
        shortcut: 'CTRL_DELETE'
      }
    }
  } as const

  if (!isContextMenuOpen) return null

  const contextMenuIsSubItem =
    contextMenuId?.includes('FR_') ||
    contextMenuId?.includes('AT_') ||
    contextMenuId?.includes('AL_') ||
    contextMenuId?.includes('FL_')

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
        <div className='flex'>
          <div className='w-3/4'>
            <h3
              className={tw(
                !contextMenuId.includes(selected_item_id ?? '')
                  ? 'text-red-400'
                  : '',
                'mx-auto'
              )}>{`Current Track: ${selected_item_id}`}</h3>

            {contextMenuIsSubItem && (
              <h3
                className={tw(
                  !contextMenuId.includes(selected_sub_item_id ?? '')
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
                  updateSettings({ key: 'sub_item_add_count', value: newValue })
                } else {
                  updateSettings({ key: 'track_add_count', value: newValue })
                }
              }}
              className={tw(
                'h-full w-1/2',
                'hover:cursor-text',
                'rounded-sm bg-inherit p-1 outline-none',
                'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600'
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
                  { label: string; action: any }
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
                      if (!contextMenuId.includes(selected_item_id ?? '')) {
                        updateSettings({
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
                      'flex items-end gap-2 whitespace-nowrap px-1 py-0.5 hover:bg-zinc-600'
                    )}>
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
