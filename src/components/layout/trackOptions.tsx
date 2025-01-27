'use client'

import { type FC, Fragment, useState, useEffect } from 'react'

import { IconBtnToggle } from '@/components/layout/icon-btn-toggle'
import tw from '@/components/utils/tw'
import { type OnChangeHelperArgsType, InputTypeSelector } from '../inputs'

import { type TrackListTableKeys } from '../utils/trackListTableKeys'
import TrackOptionsTableKeys from '../utils/trackOptionsTableKeys'

import {
  useMutations,
  useSelectedItem,
  useContextMenu,
  contextMenuType,
  FileItemId,
  SubItemId
} from '@/components/context'

import {
  type FullTrackForExport,
  type ItemsFullRanges,
  type ItemsArtLayers,
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList
} from '../backendCommands/backendCommands'

export const TrackOptions: FC = () => {
  const { setIsContextMenuOpen, setContextMenuId } = useContextMenu()
  const { selectedItem, update } = useMutations()
  const { settings, updateSettings } = useSelectedItem()
  const { selected_item_id, selected_sub_item_id } = settings

  //////////////////////////////////////////
  // This logic is used to disable individual components in the artTap, artTog, and fadList tables.
  const allArtTogs = selectedItem?.art_list_tog
  const allArtTaps = selectedItem?.art_list_tap
  const allArtLayers = selectedItem?.art_layers
  const allFads = selectedItem?.fad_list

  const [artTogIndividualComponentLocked, setArtTogIndividualComponentLocked] =
    useState([
      {
        id: selected_item_id + 'AT_0',
        code: false
      }
    ])

  const [artTapIndividualComponentLocked, setArtTapIndividualComponentLocked] =
    useState([
      {
        id: selected_item_id + 'AT_1',
        on: false
      }
    ])

  const [fadIndividualComponentLocked, setFadIndividualComponentLocked] =
    useState([
      {
        id: selected_item_id + 'FL_0',
        code: false
      }
    ])

  const [artTapOneDefaultOnly, setArtTapOneDefaultOnly] = useState([
    {
      id: selected_item_id + 'AL_1',
      default: true
    }
  ])

  const [
    artLayerIndividualComponentLocked,
    setArtLayerIndividualComponentLocked
  ] = useState([
    {
      id: selected_item_id + 'AL_0',
      code: false
    }
  ])

  useEffect(() => {
    if (!allArtTogs) return

    setArtTogIndividualComponentLocked(
      allArtTogs.map((artTog) => {
        const V1 = artTog.change_type === 'Value 1'
        return {
          id: artTog.id,
          code: V1
        }
      })
    )
  }, [allArtTogs])

  useEffect(() => {
    if (!allArtTaps) return
    setArtTapIndividualComponentLocked(
      allArtTaps.map((artTap) => {
        const V1 = artTap.change_type === 'Value 1'
        return {
          id: artTap.id,
          code: false,
          on: V1
        }
      })
    )
    setArtTapOneDefaultOnly(
      allArtTaps.map((artTap) => {
        return {
          id: artTap.id,
          default: artTap.default ?? false
        }
      })
    )
  }, [allArtTaps])

  useEffect(() => {
    if (!allArtLayers) return
    setArtLayerIndividualComponentLocked(
      allArtLayers.map((artLayer) => {
        return {
          id: artLayer.id,
          code: false
        }
      })
    )
  }, [allArtLayers])

  useEffect(() => {
    if (!allFads) return
    setFadIndividualComponentLocked(
      allFads.map((fad) => {
        const V1 = fad.change_type === 'Value 1'
        return {
          id: fad.id,
          code: V1
        }
      })
    )
  }, [allFads])

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

  //////////////////////////////////////////
  //This could be a user-setting in local storage, but for now, it's hard-coded.
  const [trackOptionsLayouts, setTrackOptionsLayouts] = useState({
    full_ranges: 'table',
    art_list_tog: 'table',
    art_list_tap: 'table',
    art_layers: 'table',
    fad_list: 'table'
  })

  const cardTableLayoutsHelper = (layoutKey: string, layout: string) => {
    setTrackOptionsLayouts((prevState) => ({
      ...prevState,
      [layoutKey]: layout
    }))
  }
  //////////////////////////////////////////
  const onChangeHelperTrack = ({
    newValue,
    layoutDataSingleId: id,
    key
  }: OnChangeHelperArgsType) => {
    //I need to throttle this so it doesn't fire on every keypress, only when the user stops typing for a second or so.
    if (!id) return
    update.track({
      id: id as FileItemId,
      [key]: newValue
    })
  }
  //////////////////////////////////////////
  const onChangeHelper = ({
    newValue,
    layoutDataSingleId,
    key,
    label
  }: OnChangeHelperArgsType) => {
    if (label === 'full_ranges') {
      if (key === 'whiteKeysOnly') {
        update.fullRange({
          id: layoutDataSingleId as SubItemId,
          white_keys_only: newValue === 'true'
        })
      } else {
        update.fullRange({
          id: layoutDataSingleId as SubItemId,
          [key]: newValue
        })
      }
    }
    if (label === 'art_list_tog') {
      update.artListTog({
        id: layoutDataSingleId as SubItemId,
        [key]: newValue
      })
    }
    if (label === 'art_list_tap') {
      if (key === 'default') {
        update.artListTap({
          id: layoutDataSingleId as SubItemId,
          default: newValue === 'true'
        })
        return
      }
      update.artListTap({
        id: layoutDataSingleId as SubItemId,
        [key]: newValue
      })
    }
    if (label === 'art_layers') {
      update.artLayer({
        id: layoutDataSingleId as SubItemId,
        [key]: newValue
      })
    }
    if (label === 'fad_list') {
      update.fadList({
        id: layoutDataSingleId as SubItemId,
        [key]: newValue
      })
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

  //////////////////////////////////////////
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
        <InputTypeSelector
          keySingle={
            {
              className: null,
              show: false,
              key: 'notes',
              input: 'text-rich',
              selectArray: undefined,
              label: undefined
            } as unknown as TrackListTableKeys['keys'][number]
          }
          onChangeHelper={onChangeHelperTrack}
          selectedItem={selectedItem as unknown as FullTrackForExport}
        />
      </div>
      {TrackOptionsTableKeys.map((layoutConfig) => {
        let layoutDataArray:
          | ItemsFullRanges[]
          | ItemsArtListTog[]
          | ItemsArtListTap[]
          | ItemsArtLayers[]
          | ItemsFadList[]
          | undefined = []

        if (layoutConfig.label === 'full_ranges') {
          layoutDataArray = selectedItem?.full_ranges
        }
        if (layoutConfig.label === 'art_list_tog') {
          layoutDataArray = selectedItem?.art_list_tog
        }
        if (layoutConfig.label === 'art_list_tap') {
          layoutDataArray = selectedItem?.art_list_tap
        }
        if (layoutConfig.label === 'art_layers') {
          layoutDataArray = selectedItem?.art_layers
        }
        if (layoutConfig.label === 'fad_list') {
          layoutDataArray = selectedItem?.fad_list
        }

        const table = trackOptionsLayouts[layoutConfig.label] === 'table'

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
                  cardTableLayoutsHelper(layoutConfig.label, 'cards')
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
                          className={tw(trackTh, key.className)}>
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
                        {layoutConfig.keys.map((key) => {
                          if (!key.show) return
                          return (
                            <td
                              key={key.key}
                              title={layoutDataSingleId}
                              className={'p-0.5'}>
                              <InputTypeSelector
                                keySingle={key}
                                artTogIndividualComponentLocked={
                                  artTogIndividualComponentLocked
                                }
                                artTapIndividualComponentLocked={
                                  artTapIndividualComponentLocked
                                }
                                artLayerIndividualComponentLocked={
                                  artLayerIndividualComponentLocked
                                }
                                fadIndividualComponentLocked={
                                  fadIndividualComponentLocked
                                }
                                artTapOneDefaultOnly={artTapOneDefaultOnly}
                                layoutConfigLabel={layoutConfig.label}
                                layoutDataSingle={layoutDataSingle}
                                onChangeHelper={onChangeHelper}
                                selectedItem={selectedItem!}
                              />
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
                        {layoutConfig.keys.map((key) => {
                          if (!key.show) return

                          return (
                            <tr
                              key={key.key}
                              className='bg-zinc-300 dark:bg-zinc-600'>
                              <td className={'p-0.5'}>{key.label}</td>
                              <td className={'p-0.5'}>
                                <InputTypeSelector
                                  keySingle={key}
                                  artTapIndividualComponentLocked={
                                    artTapIndividualComponentLocked
                                  }
                                  artTogIndividualComponentLocked={
                                    artTogIndividualComponentLocked
                                  }
                                  fadIndividualComponentLocked={
                                    fadIndividualComponentLocked
                                  }
                                  artTapOneDefaultOnly={artTapOneDefaultOnly}
                                  layoutConfigLabel={layoutConfig.label}
                                  layoutDataSingle={layoutDataSingle}
                                  onChangeHelper={onChangeHelper}
                                  selectedItem={selectedItem!}
                                />
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
