'use client'

import { type FC, Fragment } from 'react'

import { IconBtnToggle } from '@/components/layout/icon-btn-toggle'
import tw from '@/components/utils/tw'
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
} from '../inputs'

import { TrackOptionsTableKeys } from '../utils/trackOptionsTableKeys'

import {
  useMutations,
  useSelectedItem,
  useContextMenu,
  contextMenuType,
  type SubItemId
} from '@/components/context'

import {
  type ItemsFullRanges,
  type ItemsArtLayers,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type FullTrackCounts,
  TrackOptionLayouts
} from '../backendCommands/backendCommands'

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
    updateSettings({
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
  function isItemsFullRanges(obj: any): obj is ItemsFullRanges {
    return obj && obj.hasOwnProperty('id')
  }
  function isItemsArtListTog(obj: any): obj is ItemsArtListTog {
    return obj && obj.hasOwnProperty('id')
  }
  function isItemsArtListTap(obj: any): obj is ItemsArtListTap {
    return obj && obj.hasOwnProperty('id')
  }
  function isItemsArtLayers(obj: any): obj is ItemsArtLayers {
    return obj && obj.hasOwnProperty('id')
  }
  function isItemsFadList(obj: any): obj is ItemsFadList {
    return obj && obj.hasOwnProperty('id')
  }

  function safeGet<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
    if (key in obj) {
      return obj[key]
    }
    return undefined as any
  }

  function getLayoutData<T extends keyof FullTrackCounts>(
    layoutDataSingle: layoutDataSingle,
    key: LayoutDataSingleHelper<T>
  ) {
    if (isItemsFullRanges(layoutDataSingle)) {
      return safeGet(layoutDataSingle, key as keyof ItemsFullRanges)
    } else if (isItemsArtListTog(layoutDataSingle)) {
      return safeGet(layoutDataSingle, key as keyof ItemsArtListTog)
    } else if (isItemsArtListTap(layoutDataSingle)) {
      return safeGet(layoutDataSingle, key as keyof ItemsArtListTap)
    } else if (isItemsArtLayers(layoutDataSingle)) {
      return safeGet(layoutDataSingle, key as keyof ItemsArtLayers)
    } else if (isItemsFadList(layoutDataSingle)) {
      return safeGet(layoutDataSingle, key as keyof ItemsFadList)
    }
  }
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

  //////////////////////////////////////////
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
   `

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
        className='pb-2 pt-4 text-3xl'>{`Track Name: ${selectedItem?.name}`}</h1>

      <h2>Notes:</h2>
      <div
        className={tw(
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
          codeFullLocked={selectedItem?.locked}
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
          layoutDataArray = selectedItem?.full_ranges!
        }
        if (layoutConfig.label === 'art_list_tog') {
          layoutDataArray = selectedItem?.art_list_tog!
        }
        if (layoutConfig.label === 'art_list_tap') {
          layoutDataArray = selectedItem?.art_list_tap!
        }
        if (layoutConfig.label === 'art_layers') {
          layoutDataArray = selectedItem?.art_layers!
        }
        if (layoutConfig.label === 'fad_list') {
          layoutDataArray = selectedItem?.fad_list!
        }

        const table = track_options_layouts[layoutConfig.label] === 'table'

        return (
          <Fragment key={layoutConfig.label}>
            <div className='flex justify-between pb-2 pt-4'>
              <h2 className='font-caviarBold text-base'>{`${
                layoutConfig.title
              } (${layoutDataArray?.length ?? 0})`}</h2>
              <IconBtnToggle
                classes=''
                titleA='Change to card layout'
                titleB='Change to table layout'
                id='changeLayout'
                a='fa-solid fa-table-cells-large'
                b='fa-solid fa-table-columns'
                defaultIcon={table ? 'a' : 'b'}
                onToggleA={() =>
                  cardTableLayoutsHelper(layoutConfig.label, 'card')
                }
                onToggleB={() =>
                  cardTableLayoutsHelper(layoutConfig.label, 'table')
                }
              />
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
                          className={tw(trackTh, key.className ?? '')}>
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
                          updateSettings({
                            key: 'selected_sub_item_id',
                            value: layoutDataSingleId
                          })
                        }
                        onKeyUpCapture={() =>
                          updateSettings({
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
                            codeFullLocked: selectedItem?.locked,
                            codeDisabled: isSubKeyInputDisabled(
                              layoutConfig.label,
                              layoutDataSingle,
                              subKey.key
                            ),
                            defaultValue: safeValue,
                            options: subKey.selectArray,
                            textTypeValidator: typeof safeValue,
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
                              title={layoutDataSingleId}
                              className={'p-0.5'}>
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
                        updateSettings({
                          key: 'selected_sub_item_id',
                          value: layoutDataSingleId
                        })
                      }
                      onKeyUpCapture={() =>
                        updateSettings({
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
                          <td className={tw(trackTh, 'w-1/2 border-r-0')}>
                            {layoutDataSingleId}
                          </td>
                          <td className={tw(trackTh, 'w-1/2 border-l-0')} />
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
                            codeFullLocked: selectedItem?.locked,
                            codeDisabled: isSubKeyInputDisabled(
                              layoutConfig.label,
                              layoutDataSingle,
                              subKey.key
                            ),
                            defaultValue: safeValue,
                            options: subKey.selectArray,
                            textTypeValidator: typeof safeValue,
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
