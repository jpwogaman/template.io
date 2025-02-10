'use client'

import { type FC, Fragment } from 'react'
import { HiOutlineTableCells, HiOutlineViewColumns } from 'react-icons/hi2'

import { twMerge } from 'tailwind-merge'
import {
  InputCheckBox,
  InputCheckBoxSwitch,
  InputSelectMultiple,
  InputSelectSingle,
  InputText,
  InputTextRich,
  InputColorPicker,
  type layoutDataArray,
  type layoutDataSingle,
  type ChangeEventHelper,
  type LayoutDataSingleHelper,
  type OnChangeHelperArgsType,
  type InputComponentProps
} from '@/components/inputs'

import { TrackOptionsTableKeys } from '@/components/utils/trackOptionsTableKeys'

import {
  useMutations,
  useSelectedItem,
  useContextMenu,
  type contextMenuType,
  type SubItemId
} from '@/components/context'

import {
  type ItemsFullRanges,
  type ItemsArtLayers,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type FullTrackCounts,
  type TrackOptionLayouts
} from '@/components/backendCommands/backendCommands'

export const TrackOptions: FC = () => {
  const { setIsContextMenuOpen, setContextMenuId } = useContextMenu()
  const { selectedItem, update } = useMutations()
  const { settings, updateSettings } = useSelectedItem()
  const { selected_sub_item_id, track_options_layouts } = settings

  //////////////////////////////////////////
  const cardTableLayoutsHelper = (
    layoutKey: keyof TrackOptionLayouts,
    layout: 'table' | 'card'
  ) => {
    void updateSettings({
      key: 'track_options_layouts',
      value: {
        ...track_options_layouts,
        [layoutKey]: layout
      }
    })
  }
  //////////////////////////////////////////
  const onChangeHelper = ({
    newValue,
    layoutDataSingleId,
    key,
    label
  }: OnChangeHelperArgsType) => {
    let refetch = false
    const id = layoutDataSingleId as SubItemId

    if (label === 'full_ranges') {
      if (key === 'white_keys_only') {
        update.fullRange(
          {
            id,
            [key]: newValue as boolean
          },
          (refetch = true)
        )
      } else {
        update.fullRange(
          {
            id,
            [key]: newValue
          },
          refetch
        )
      }
    }
    if (label === 'art_list_tog') {
      if (key === 'change_type') {
        update.artListTog(
          {
            id,
            [key]: newValue as string
          },
          (refetch = true)
        )
      } else {
        update.artListTog(
          {
            id,
            [key]: newValue
          },
          refetch
        )
      }
    }
    if (label === 'art_list_tap') {
      if (key === 'default') {
        update.artListTap(
          {
            id,
            [key]: newValue as boolean
          },
          (refetch = true)
        )
      } else if (key === 'change_type') {
        update.artListTap(
          {
            id,
            [key]: newValue as string
          },
          (refetch = true)
        )
      } else {
        update.artListTap(
          {
            id,
            [key]: newValue
          },
          refetch
        )
      }
    }
    if (label === 'art_layers') {
      if (key === 'change_type') {
        update.artLayer(
          {
            id,
            [key]: newValue as string
          },
          (refetch = true)
        )
      } else {
        update.artLayer(
          {
            id,
            [key]: newValue
          },
          refetch
        )
      }
    }
    if (label === 'fad_list') {
      if (key === 'change_type') {
        update.fadList(
          {
            id,
            [key]: newValue as string
          },
          (refetch = true)
        )
      } else {
        update.fadList(
          {
            id,
            [key]: newValue
          },
          refetch
        )
      }
    }
  }

  //////////////////////////////////////////
  const isItemsFullRanges = (obj: unknown): obj is ItemsFullRanges =>
    typeof obj === 'object' && obj !== null && 'id' in obj

  const isItemsArtListTog = (obj: unknown): obj is ItemsArtListTog =>
    typeof obj === 'object' && obj !== null && 'id' in obj

  const isItemsArtListTap = (obj: unknown): obj is ItemsArtListTap =>
    typeof obj === 'object' && obj !== null && 'id' in obj

  const isItemsArtLayers = (obj: unknown): obj is ItemsArtLayers =>
    typeof obj === 'object' && obj !== null && 'id' in obj

  const isItemsFadList = (obj: unknown): obj is ItemsFadList =>
    typeof obj === 'object' && obj !== null && 'id' in obj

  const safeGet = <T extends object, K extends keyof T>(
    obj: T,
    key: K
  ): T[K] | undefined => (key in obj ? obj[key] : undefined)

  const getLayoutData = <T extends keyof FullTrackCounts>(
    layoutDataSingle: layoutDataSingle,
    key: LayoutDataSingleHelper<T>
  ) =>
    isItemsFullRanges(layoutDataSingle)
      ? safeGet(layoutDataSingle, key as keyof ItemsFullRanges)
      : isItemsArtListTog(layoutDataSingle)
        ? safeGet(layoutDataSingle, key as keyof ItemsArtListTog)
        : isItemsArtListTap(layoutDataSingle)
          ? safeGet(layoutDataSingle, key as keyof ItemsArtListTap)
          : isItemsArtLayers(layoutDataSingle)
            ? safeGet(layoutDataSingle, key as keyof ItemsArtLayers)
            : isItemsFadList(layoutDataSingle)
              ? safeGet(layoutDataSingle, key as keyof ItemsFadList)
              : undefined

  //////////////////////////////////////////
  // This logic is used to disable individual components in the artTap, artTog, and fadList tables.

  //if (artTap) {
  //  V1 = 'the ON value relates to the CODE itself (i.e. ON = CC18)'
  //  V2 = 'the ON value relates to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20)'
  //}
  //if (artTog) {
  //  V1 = 'the ON and OFF values relate to the CODE itself (i.e. ON = CC18, OFF = CC35)'
  //  V2 = 'the ON and OFF values relate to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20, OFF = Velocity 21)'
  //}
  // if (fad) {
  //  V1 = 'the DEFAULT value relates to the CODE itself (i.e. DEFAULT = CC11)'
  //  V2 = 'the DEFAULT value relates to the CODE's second Value (i.e. CODE = C#3, DEFAULT = Velocity 20)'
  //}

  const isSubKeyInputDisabled = (
    label: keyof FullTrackCounts,
    item: layoutDataSingle,
    subKey: TrackOptionsTableKeys<
      keyof FullTrackCounts
    >[number]['keys'][number]['key']
  ) => {
    const artTogLockedHelper =
      label === 'art_list_tog' &&
      isItemsArtListTog(item) &&
      item.change_type === 'Value 1' &&
      subKey === 'code'

    const artTapLockedHelper =
      label === 'art_list_tap' &&
      isItemsArtListTap(item) &&
      ((subKey === 'on' && item.change_type === 'Value 1') ||
        (subKey === 'default' && item.default))

    const artLayerLockedHelper =
      label === 'art_layers' &&
      isItemsArtLayers(item) &&
      item.change_type === 'Value 1' &&
      subKey === 'code'

    const fadLockedHelper =
      label === 'fad_list' &&
      isItemsFadList(item) &&
      item.change_type === 'Value 1' &&
      subKey === 'code'

    if (
      artTogLockedHelper ||
      artTapLockedHelper ||
      artLayerLockedHelper ||
      fadLockedHelper
    ) {
      return true
    } else {
      return false
    }
  }

  const locked = selectedItem?.locked ?? false
  //const notesId = selectedItem?.id + '_notes'
  //const notesSelectedLocked = locked && selected_sub_item_id === notesId
  //const notesSelectedUnlocked = !locked && selected_sub_item_id === notesId
  //const notesUnselectedLocked = locked && selected_sub_item_id !== notesId
  //const notesUnselectedUnlocked = !locked && selected_sub_item_id !== notesId

  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      <h1
        title={`Track Id: ${selectedItem?.id} - Track Name: ${selectedItem?.name}`}
        className='pt-4 pb-2 text-3xl'>{`Track Name: ${selectedItem?.name}`}</h1>

      <h2>Notes:</h2>
      <div
        className={twMerge(
          'm-1 flex items-center p-1'
          //notesSelectedUnlocked
          //  ? 'bg-red-300 hover:bg-red-400 hover:text-zinc-50 dark:bg-red-600 dark:hover:bg-red-400 dark:hover:text-zinc-50'
          //  : notesSelectedLocked
          //    ? 'bg-red-500 hover:bg-red-600 hover:text-zinc-50 dark:bg-red-800 dark:hover:bg-red-500 dark:hover:text-zinc-50'
          //    : notesUnselectedLocked
          //      ? 'hover:bg-zinc-500 hover:text-zinc-50  dark:hover:bg-zinc-400 dark:hover:text-zinc-50'
          //      : notesUnselectedUnlocked
          //        ? 'hover:bg-zinc-500 hover:text-zinc-50 dark:hover:bg-zinc-400 dark:hover:text-zinc-50'
          //        : ''
        )}>
        <InputTextRich
          id={`${selectedItem?.id}_notes`}
          codeFullLocked={selectedItem?.locked ?? false}
          defaultValue={selectedItem?.notes}
          onChangeFunction={(event: ChangeEventHelper) => {
            if (!selectedItem?.id) return
            const refetch = false
            update.track(
              {
                id: selectedItem?.id,
                notes: event.target.value
              },
              refetch
            )
          }}
        />
      </div>
      {TrackOptionsTableKeys.map((layoutConfig) => {
        let layoutDataArray: layoutDataArray = []

        if (layoutConfig.label === 'full_ranges') {
          if (selectedItem?.full_ranges) {
            layoutDataArray = selectedItem.full_ranges
          }
        }
        if (layoutConfig.label === 'art_list_tog') {
          if (selectedItem?.art_list_tog) {
            layoutDataArray = selectedItem.art_list_tog
          }
        }
        if (layoutConfig.label === 'art_list_tap') {
          if (selectedItem?.art_list_tap) {
            layoutDataArray = selectedItem.art_list_tap
          }
        }
        if (layoutConfig.label === 'art_layers') {
          if (selectedItem?.art_layers) {
            layoutDataArray = selectedItem.art_layers
          }
        }
        if (layoutConfig.label === 'fad_list') {
          if (selectedItem?.fad_list) {
            layoutDataArray = selectedItem.fad_list
          }
        }

        const table = track_options_layouts[layoutConfig.label] === 'table'

        return (
          <Fragment key={layoutConfig.label}>
            <div className='flex justify-between pt-4 pb-2'>
              <h2 className='font-codeBold text-base'>{`${
                layoutConfig.title
              } (${layoutDataArray?.length ?? 0})`}</h2>

              <button
                type='button'
                className={twMerge(
                  'cursor-pointer rounded-lg p-2 text-zinc-200 transition-colors duration-300',
                  'outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:outline-hidden focus-visible:ring-inset'
                )}
                onClick={() =>
                  table
                    ? cardTableLayoutsHelper(layoutConfig.label, 'card')
                    : cardTableLayoutsHelper(layoutConfig.label, 'table')
                }>
                <span className='sr-only'>change layout</span>
                {table && (
                  <HiOutlineTableCells
                    className='h-6 w-6'
                    aria-hidden='true'
                  />
                )}
                {!table && (
                  <HiOutlineViewColumns
                    className='h-6 w-6'
                    aria-hidden='true'
                  />
                )}
              </button>
            </div>
            {table && (
              <table
                id={'table_' + layoutConfig.label}
                className='w-full table-fixed border-separate border-spacing-0 text-left text-xs'>
                <thead>
                  <tr>
                    {layoutConfig.keys.map((key) => {
                      if (!key.show) return
                      return (
                        <td
                          key={key.key}
                          title={key.key}
                          className={twMerge(
                            'font-codeBold dark:font-code z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 p-1 dark:border-zinc-400 dark:bg-zinc-600',
                            key.className ?? ''
                          )}>
                          {key.label}
                        </td>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {layoutDataArray?.map((layoutDataSingle) => {
                    const layoutDataSingleId = layoutDataSingle.id

                    const selectedLocked =
                      locked && selected_sub_item_id === layoutDataSingleId
                    const selectedUnlocked =
                      !locked && selected_sub_item_id === layoutDataSingleId
                    const unselectedLocked =
                      locked && selected_sub_item_id !== layoutDataSingleId
                    const unselectedUnlocked =
                      !locked && selected_sub_item_id !== layoutDataSingleId

                    return (
                      <tr
                        onClick={() =>
                          void updateSettings({
                            key: 'selected_sub_item_id',
                            value: layoutDataSingleId
                          })
                        }
                        onKeyUpCapture={() =>
                          void updateSettings({
                            key: 'selected_sub_item_id',
                            value: layoutDataSingleId
                          })
                        }
                        onContextMenu={() => {
                          setIsContextMenuOpen(true)
                          setContextMenuId(
                            layoutDataSingleId as contextMenuType
                          )
                        }}
                        key={layoutDataSingleId}
                        className={twMerge(
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
                        {layoutConfig.keys.map((subKey) => {
                          if (!subKey.show) return
                          //const artLayerOrRangeOptions =
                          //  layoutConfig.label === 'art_list_tap' ||
                          //  layoutConfig.label === 'art_list_tog'

                          //const layersOptions =
                          //  key.key === 'art_layers' && artLayerOrRangeOptions

                          //const stringListFullArtLayerIds = JSON.stringify(
                          //  selectedItem?.art_layers.map(
                          //    (artLayer: ItemsArtLayers) => artLayer.id
                          //  )
                          //)

                          //const rangeOptions =
                          //  key.key === 'ranges' && artLayerOrRangeOptions

                          //const stringListOfFullRangeIds = JSON.stringify(
                          //  selectedItem?.full_ranges.map(
                          //    (fullRange: Ite msFullRanges) => fullRange.id
                          //  )
                          //)

                          const safeValue = getLayoutData(
                            layoutDataSingle,
                            subKey.key
                          )

                          const inputPropsHelper: InputComponentProps = {
                            id: `${layoutDataSingle.id}_${subKey.key}`,
                            codeFullLocked: selectedItem?.locked ?? false,
                            codeDisabled: isSubKeyInputDisabled(
                              layoutConfig.label,
                              layoutDataSingle,
                              subKey.key
                            ),
                            defaultValue: safeValue,
                            options: subKey.selectArray,
                            onChangeFunction: (event: ChangeEventHelper) => {
                              let typedValue: string | number | boolean =
                                event.target.value
                              if (typeof safeValue === 'string') {
                                typedValue = event.target.value
                              } else if (typeof safeValue === 'number') {
                                typedValue = parseInt(event.target.value)
                              } else if (typeof safeValue === 'boolean') {
                                typedValue = event.target.value === 'true'
                              }
                              onChangeHelper({
                                newValue: typedValue,
                                layoutDataSingleId: layoutDataSingle.id,
                                key: subKey.key,
                                label: layoutConfig.label
                              })
                            }
                          }
                          return (
                            <td
                              key={subKey.key}
                              title={layoutDataSingleId}>
                              {!subKey.input && subKey.key === 'id' && (
                                <p
                                  id={`${layoutDataSingle.id}_${subKey.key}`}
                                  title={layoutDataSingle.id}
                                  className='cursor-default p-1 transition-all duration-200'>
                                  {`${layoutDataSingle.id.split('_')[2]}_${parseInt(layoutDataSingle.id.split('_')[3]!)}`}
                                </p>
                              )}
                              {subKey.input === 'select-multiple' && (
                                <InputSelectMultiple {...inputPropsHelper} />
                              )}
                              {subKey.input === 'select' && (
                                <InputSelectSingle {...inputPropsHelper} />
                              )}
                              {subKey.input === 'checkbox-switch' && (
                                <InputCheckBoxSwitch {...inputPropsHelper} />
                              )}
                              {subKey.input === 'checkbox' && (
                                <InputCheckBox {...inputPropsHelper} />
                              )}
                              {subKey.input === 'color-picker' && (
                                <InputColorPicker {...inputPropsHelper} />
                              )}
                              {subKey.input === 'text' && (
                                //<p
                                //  id={`${layoutDataSingle.id}_${subKey.key}`}
                                //  title={layoutDataSingle.id}
                                //  className='cursor-default p-1 transition-all duration-200'>
                                //  {safeValue}
                                //</p>
                                <InputText {...inputPropsHelper} />
                              )}
                              {subKey.input === 'text-rich' && (
                                <InputTextRich {...inputPropsHelper} />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            {!table && (
              <div
                id={'card_' + layoutConfig.label}
                className='flex gap-1 overflow-x-scroll'>
                {layoutDataArray?.map((layoutDataSingle) => {
                  const layoutDataSingleId = layoutDataSingle.id
                  return (
                    <table
                      onClick={() =>
                        void updateSettings({
                          key: 'selected_sub_item_id',
                          value: layoutDataSingleId
                        })
                      }
                      onKeyUpCapture={() =>
                        void updateSettings({
                          key: 'selected_sub_item_id',
                          value: layoutDataSingleId
                        })
                      }
                      onContextMenu={() => {
                        setIsContextMenuOpen(true)
                        setContextMenuId(layoutDataSingleId as contextMenuType)
                      }}
                      key={layoutDataSingleId}
                      className='w-max table-auto border-separate border-spacing-0 text-left text-xs'>
                      <thead>
                        <tr>
                          <td
                            className={twMerge(
                              'font-codeBold dark:font-code z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 p-1 dark:border-zinc-400 dark:bg-zinc-600',
                              'w-1/2 border-r-0'
                            )}>
                            {layoutDataSingleId}
                          </td>
                          <td
                            className={twMerge(
                              'font-codeBold dark:font-code z-50 border-[1.5px] border-zinc-100 border-b-transparent bg-zinc-200 p-1 dark:border-zinc-400 dark:bg-zinc-600',
                              'w-1/2 border-l-0'
                            )}
                          />
                        </tr>
                      </thead>
                      <tbody>
                        {layoutConfig.keys.map((subKey) => {
                          if (!subKey.show) return
                          //const artLayerOrRangeOptions =
                          //  layoutConfig.label === 'art_list_tap' ||
                          //  layoutConfig.label === 'art_list_tog'

                          //const layersOptions =
                          //  key.key === 'art_layers' && artLayerOrRangeOptions

                          //const stringListFullArtLayerIds = JSON.stringify(
                          //  selectedItem?.art_layers.map(
                          //    (artLayer: ItemsArtLayers) => artLayer.id
                          //  )
                          //)

                          //const rangeOptions =
                          //  key.key === 'ranges' && artLayerOrRangeOptions

                          //const stringListOfFullRangeIds = JSON.stringify(
                          //  selectedItem?.full_ranges.map(
                          //    (fullRange: Ite msFullRanges) => fullRange.id
                          //  )
                          //)

                          const safeValue = getLayoutData(
                            layoutDataSingle,
                            subKey.key
                          )

                          const inputPropsHelper: InputComponentProps = {
                            id: `${layoutDataSingle.id}_${subKey.key}`,
                            codeFullLocked: selectedItem?.locked ?? false,
                            codeDisabled: isSubKeyInputDisabled(
                              layoutConfig.label,
                              layoutDataSingle,
                              subKey.key
                            ),
                            defaultValue: safeValue,
                            options: subKey.selectArray,
                            onChangeFunction: (event: ChangeEventHelper) => {
                              let typedValue: string | number | boolean =
                                event.target.value
                              if (typeof safeValue === 'string') {
                                typedValue = event.target.value
                              } else if (typeof safeValue === 'number') {
                                typedValue = parseInt(event.target.value)
                              } else if (typeof safeValue === 'boolean') {
                                typedValue = event.target.value === 'true'
                              }
                              onChangeHelper({
                                newValue: typedValue,
                                layoutDataSingleId: layoutDataSingle.id,
                                key: subKey.key,
                                label: layoutConfig.label
                              })
                            }
                          }
                          return (
                            <tr
                              key={subKey.key}
                              className='bg-zinc-300 dark:bg-zinc-600'>
                              <td className={'p-0.5'}>{subKey.label}</td>
                              <td className={'p-0.5'}>
                                {!subKey.input && subKey.key === 'id' && (
                                  <p
                                    id={`${layoutDataSingle.id}_${subKey.key}`}
                                    title={layoutDataSingle.id}
                                    className='cursor-default p-1 transition-all duration-200'>
                                    {`${layoutDataSingle.id.split('_')[2]}_${parseInt(layoutDataSingle.id.split('_')[3]!)}`}
                                  </p>
                                )}
                                {subKey.input === 'select-multiple' && (
                                  <InputSelectMultiple {...inputPropsHelper} />
                                )}
                                {subKey.input === 'select' && (
                                  <InputSelectSingle {...inputPropsHelper} />
                                )}
                                {subKey.input === 'checkbox-switch' && (
                                  <InputCheckBoxSwitch {...inputPropsHelper} />
                                )}
                                {subKey.input === 'checkbox' && (
                                  <InputCheckBox {...inputPropsHelper} />
                                )}
                                {subKey.input === 'color-picker' && (
                                  <InputColorPicker {...inputPropsHelper} />
                                )}
                                {subKey.input === 'text' && (
                                  <InputText {...inputPropsHelper} />
                                )}
                                {subKey.input === 'text-rich' && (
                                  <InputTextRich {...inputPropsHelper} />
                                )}
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
