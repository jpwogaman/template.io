'use'

import {
  type FC,
  Fragment,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackOptionsTableKeys from './utils/trackOptionsTableKeys'
import {
  type OnChangeHelperArgsType,
  type SelectedItemType,
  InputTypeSelector
} from './inputs'

import {
  type ItemsFullRanges,
  type ItemsArtListTog,
  type ItemsArtListTap,
  type ItemArtLayers,
  type ItemsFadList
} from '@prisma/client'

import useMutations from '@/hooks/useMutations'
import TrackListTableKeys from './utils/trackListTableKeys'

type TrackOptionsProps = {
  selectedItemId: string | null
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
  setContextMenuId: Dispatch<SetStateAction<string>>
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
  selectedSubItemId: string | null
  setSelectedSubItemId: Dispatch<SetStateAction<string | null>>
}

const TrackOptions: FC<TrackOptionsProps> = ({
  selectedItemId,
  setIsContextMenuOpen,
  setContextMenuId,
  setSelectedItemId,
  selectedSubItemId,
  setSelectedSubItemId
}) => {


  const { selectedItem, update } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  //////////////////////////////////////////
  // This logic is used to disable individual components in the artTap, artTog, and fadList tables.
  const allArtTogs = selectedItem?.artListTog ?? []
  const allArtTaps = selectedItem?.artListTap ?? []
  const allArtLayers = selectedItem?.artLayers ?? []
  const allFads = selectedItem?.fadList ?? []

  const [artTogIndividualComponentLocked, setArtTogIndividualComponentLocked] =
    useState([
      {
        id: selectedItemId + 'AT_0',
        code: false
      }
    ])

  const [artTapIndividualComponentLocked, setArtTapIndividualComponentLocked] =
    useState([
      {
        id: selectedItemId + 'AT_1',
        on: false
      }
    ])

  const [fadIndividualComponentLocked, setFadIndividualComponentLocked] =
    useState([
      {
        id: selectedItemId + 'FL_0',
        code: false
      }
    ])

  const [artTapOneDefaultOnly, setArtTapOneDefaultOnly] = useState([
    {
      id: selectedItemId + 'AL_1',
      default: true
    }
  ])

  const [
    artLayerIndividualComponentLocked,
    setArtLayerIndividualComponentLocked
  ] = useState([
    {
      id: selectedItemId + 'AL_0',
      code: false
    }
  ])

  useEffect(() => {
    setArtTogIndividualComponentLocked(
      allArtTogs?.map((artTog) => {
        const V1 = artTog.changeType === 'Value 1'
        return {
          id: artTog.id,
          code: V1
        }
      })
    )
  }, [allArtTogs])

  useEffect(() => {
    setArtTapIndividualComponentLocked(
      allArtTaps?.map((artTap) => {
        const V1 = artTap.changeType === 'Value 1'
        return {
          id: artTap.id,
          code: false,
          on: V1
        }
      })
    )
    setArtTapOneDefaultOnly(
      allArtTaps?.map((artTap) => {
        return {
          id: artTap.id,
          default: artTap.default ?? false
        }
      })
    )
  }, [allArtTaps])

  useEffect(
    () =>
      setArtLayerIndividualComponentLocked(
        allArtLayers?.map((artLayer) => {
          return {
            id: artLayer.id,
            code: false
          }
        })
      ),
    [allArtLayers]
  )

  useEffect(() => {
    setFadIndividualComponentLocked(
      allFads?.map((fad) => {
        const V1 = fad.changeType === 'Value 1'
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
    fullRange: 'table',
    artListTog: 'table',
    artListTap: 'table',
    artLayers: 'table',
    fadList: 'table'
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

    update.track({
      itemId: id,
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
    if (label === 'fullRange') {
      if (key === 'whiteKeysOnly') {
        update.fullRange({
          rangeId: layoutDataSingleId ?? '',
          whiteKeysOnly: newValue === 'true'
        })
      } else {
        update.fullRange({
          rangeId: layoutDataSingleId ?? '',
          [key]: newValue
        })
      }
    }
    if (label === 'artListTog') {
      update.artListTog({
        artId: layoutDataSingleId ?? '',
        [key]: newValue
      })
    }
    if (label === 'artListTap') {
      if (key === 'default') {
        update.artListTap({
          artId: layoutDataSingleId ?? '',
          default: newValue === 'true'
        })
        return
      }
      update.artListTap({
        artId: layoutDataSingleId ?? '',
        [key]: newValue
      })
    }
    if (label === 'artLayers') {
      update.artLayer({
        layerId: layoutDataSingleId ?? '',
        [key]: newValue
      })
    }
    if (label === 'fadList') {
      update.fadList({
        fadId: layoutDataSingleId ?? '',
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
  const notesId = selectedItem?.id + '_notes'
  const notesSelectedLocked =
    locked && selectedSubItemId === notesId
  const notesSelectedUnlocked =
    !locked && selectedSubItemId === notesId
  const notesUnselectedLocked =
    locked && selectedSubItemId !== notesId
  const notesUnselectedUnlocked =
    !locked && selectedSubItemId !== notesId

  //////////////////////////////////////////
  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      <h1
        title={`Track Id: ${selectedItem?.id} - Track Name: ${selectedItem?.name}`}
        className='pb-2 pt-4 text-3xl'>{`Track Name: ${selectedItem?.name}`}</h1>

        <h2>Notes:</h2>      
        <div
          className={
            tw(
              'm-1 p-1 flex items-center',
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
            } as unknown as (typeof TrackListTableKeys)['keys'][number]
          }
          onChangeHelper={onChangeHelperTrack}
          selectedItem={selectedItem as unknown as SelectedItemType}
        />
        </div>
      {TrackOptionsTableKeys.map((layoutConfig) => {
        let layoutDataArray:
          | ItemsFullRanges[]
          | ItemsArtListTog[]
          | ItemsArtListTap[]
          | ItemArtLayers[]
          | ItemsFadList[]
          | undefined = []

        if (layoutConfig.label === 'fullRange') {
          layoutDataArray = selectedItem?.fullRange
        }
        if (layoutConfig.label === 'artListTog') {
          layoutDataArray = selectedItem?.artListTog
        }
        if (layoutConfig.label === 'artListTap') {
          layoutDataArray = selectedItem?.artListTap
        }
        if (layoutConfig.label === 'artLayers') {
          layoutDataArray = selectedItem?.artLayers
        }
        if (layoutConfig.label === 'fadList') {
          layoutDataArray = selectedItem?.fadList
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
                className='w-full table-fixed border-separate border-spacing-0 text-left text-xs '>
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
                      locked && selectedSubItemId === layoutDataSingleId
                    const selectedUnlocked =
                      !locked && selectedSubItemId === layoutDataSingleId
                    const unselectedLocked =
                      locked && selectedSubItemId !== layoutDataSingleId
                    const unselectedUnlocked =
                      !locked && selectedSubItemId !== layoutDataSingleId

                    return (
                      <tr
                        onClick={() => setSelectedSubItemId(layoutDataSingleId)}
                        onContextMenu={() => {
                          setIsContextMenuOpen(true)
                          setContextMenuId(layoutDataSingleId)
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
                                selectedItem={selectedItem as SelectedItemType}
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
                      onClick={() => setSelectedSubItemId(layoutDataSingleId)}
                      onKeyDown={() => {}}
                      onContextMenu={() => {
                        setIsContextMenuOpen(true)
                        setContextMenuId(layoutDataSingleId)
                      }}
                      key={layoutDataSingleId}
                      className='w-max table-auto border-separate border-spacing-0 text-left text-xs'>
                      <thead>
                        <tr>
                          <td className={tw(trackTh, 'w-1/2 border-r-0')}>
                            {layoutDataSingleId}
                          </td>
                          <td className={tw(trackTh, ' w-1/2 border-l-0')} />
                        </tr>
                      </thead>
                      <tbody>
                        {layoutConfig.keys.map((key) => {
                          if (!key.show) return

                          return (
                            <tr
                              key={key.key}
                              className='bg-zinc-300 
                              dark:bg-zinc-600'>
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
                                  selectedItem={
                                    selectedItem as SelectedItemType
                                  }
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

export default TrackOptions
