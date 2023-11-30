import {
  type FC,
  Fragment,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction
} from 'react'
import { trpc } from '@/utils/trpc'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackOptionsTableKeys from './utils/trackOptionsTableKeys'
import {
  type OnChangeHelperArgsType,
  type SelectedItemType,
  InputTypeSelector
} from './inputs'

import {
  type ItemsArtListTap,
  type ItemsArtListTog,
  type ItemsFadList,
  type ItemsFullRanges
} from '@prisma/client'

import useMutations from '@/hooks/useMutations'

type TrackOptionsProps = {
  selectedItemId: string | null
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
  setContextMenuId: Dispatch<SetStateAction<string>>
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
}

const TrackOptions: FC<TrackOptionsProps> = ({
  selectedItemId,
  setIsContextMenuOpen,
  setContextMenuId,
  setSelectedItemId
}) => {
  const {
    selectedItem,
    updateSingleFullRangeMutation,
    updateSingleArtListTapMutation,
    updateSingleArtListTogMutation,
    updateSingleFadListMutation,
    createSingleFullRangeMutation,
    createSingleArtListTapMutation,
    createSingleArtListTogMutation,
    createSingleFadListMutation,
    deleteSingleFullRangeMutation,
    deleteSingleArtListTapMutation,
    deleteSingleArtListTogMutation,
    deleteSingleFadListMutation
  } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  //////////////////////////////////////////
  // This logic is used to disable individual components in the artTap, artTog, and fadList tables.
  const allArtTaps = selectedItem?.artListTap ?? []
  const allArtTogs = selectedItem?.artListTog ?? []
  const allFads = selectedItem?.fadList ?? []

  const [artTapIndividualComponentLocked, setArtTapIndividualComponentLocked] =
    useState([
      {
        id: selectedItemId + 'AL_0',
        on: false
      }
    ])

  const [artTogIndividualComponentLocked, setArtTogIndividualComponentLocked] =
    useState([
      {
        id: selectedItemId + 'AL_1',
        code: false
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
      id: selectedItemId + 'AL_0',
      default: true
    }
  ])

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
    artListTap: 'table',
    artListTog: 'table',
    fadList: 'table'
  })

  const cardTableLayoutsHelper = (layoutKey: string, layout: string) => {
    setTrackOptionsLayouts((prevState) => ({
      ...prevState,
      [layoutKey]: layout
    }))
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
        updateSingleFullRangeMutation.mutate({
          rangeId: layoutDataSingleId ?? '',
          whiteKeysOnly: newValue === 'true'
        })
      } else {
        updateSingleFullRangeMutation.mutate({
          rangeId: layoutDataSingleId ?? '',
          [key]: newValue
        })
      }
    }
    if (label === 'artListTap') {
      if (key === 'default') {
        updateSingleArtListTapMutation.mutate({
          artId: layoutDataSingleId ?? '',
          default: newValue === 'true'
        })
        return
      }
      updateSingleArtListTapMutation.mutate({
        artId: layoutDataSingleId ?? '',
        [key]: newValue
      })
    }
    if (label === 'artListTog') {
      updateSingleArtListTogMutation.mutate({
        artId: layoutDataSingleId ?? '',
        [key]: newValue
      })
    }
    if (label === 'fadList') {
      updateSingleFadListMutation.mutate({
        fadId: layoutDataSingleId ?? '',
        [key]: newValue
      })
    }
  }
  const createSingleSubItemMutationHelper = (label: string) => {
    if (label === 'fullRange') {
      createSingleFullRangeMutation.mutate({
        itemId: selectedItemId ?? ''
      })
    }
    if (label === 'artListTap') {
      createSingleArtListTapMutation.mutate({
        itemId: selectedItemId ?? ''
      })
    }
    if (label === 'artListTog') {
      createSingleArtListTogMutation.mutate({
        itemId: selectedItemId ?? ''
      })
    }
    if (label === 'fadList') {
      createSingleFadListMutation.mutate({
        itemId: selectedItemId ?? ''
      })
    }
  }
  const deleteSingleSubItemMutationHelper = (id: string, label: string) => {
    if (label === 'fullRange') {
      deleteSingleFullRangeMutation.mutate({
        fileItemsItemId: selectedItemId ?? '',
        rangeId: id
      })
    }
    if (label === 'artListTap') {
      deleteSingleArtListTapMutation.mutate({
        fileItemsItemId: selectedItemId ?? '',
        artId: id
      })
    }
    if (label === 'artListTog') {
      deleteSingleArtListTogMutation.mutate({
        fileItemsItemId: selectedItemId ?? '',
        artId: id
      })
    }
    if (label === 'fadList') {
      deleteSingleFadListMutation.mutate({
        fileItemsItemId: selectedItemId ?? '',
        fadId: id
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
  //////////////////////////////////////////
  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      <h1
        title={`Track Id: ${selectedItem?.id} - Track Name: ${selectedItem?.name}`}
        className='pb-2 pt-4 text-3xl'>{`Track Name: ${selectedItem?.name}`}</h1>

      {TrackOptionsTableKeys.map((layoutConfig) => {
        let layoutDataArray:
          | ItemsArtListTap[]
          | ItemsArtListTog[]
          | ItemsFadList[]
          | ItemsFullRanges[]
          | undefined = []

        if (layoutConfig.label === 'fullRange') {
          layoutDataArray = selectedItem?.fullRange
        }
        if (layoutConfig.label === 'artListTap') {
          layoutDataArray = selectedItem?.artListTap
        }
        if (layoutConfig.label === 'artListTog') {
          layoutDataArray = selectedItem?.artListTog
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

                    return (
                      <tr
                        onContextMenu={() => {
                          setIsContextMenuOpen(true)
                          setContextMenuId(layoutDataSingleId)
                        }}
                        key={layoutDataSingleId}
                        className='bg-zinc-300 dark:bg-zinc-600 '>
                        {layoutConfig.keys.map((key) => {
                          if (!key.show) return
                          return (
                            <td
                              key={key.key}
                              title={layoutDataSingleId}
                              className={'p-0.5'}>
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
