import { type FC, Fragment, useState, type ChangeEvent } from 'react'
import { trpc } from '@/utils/trpc'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackOptionsTableKeys from './trackOptionsTableKeys'
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

type TrackOptionsProps = {
  selectedItemId: string | null
}

const TrackOptions: FC<TrackOptionsProps> = ({ selectedItemId }) => {
  const { data: selectedItem, refetch } = trpc.items.getSingleItem.useQuery({
    itemId: selectedItemId ?? ''
  })
  //////////////////////////////////////////
  const renumberArtListMutation = trpc.items.renumberArtList.useMutation({
    onSuccess: () => {
      renumberArtListMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  //////////////////////////////////////////
  const updateSingleFullRangeMutation =
    trpc.items.updateSingleFullRange.useMutation({
      onSuccess: () => {
        updateSingleFullRangeMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  const updateSingleArtListTapMutation =
    trpc.items.updateSingleArtListTap.useMutation({
      onSuccess: () => {
        updateSingleArtListTapMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  const updateSingleArtListTogMutation =
    trpc.items.updateSingleArtListTog.useMutation({
      onSuccess: () => {
        updateSingleArtListTogMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  const updateSingleFadListMutation =
    trpc.items.updateSingleFadList.useMutation({
      onSuccess: () => {
        updateSingleFadListMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  //////////////////////////////////////////
  const createSingleFullRangeMutation =
    trpc.items.createSingleFullRange.useMutation({
      onSuccess: () => {
        createSingleFullRangeMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  const createSingleArtListTapMutation =
    trpc.items.createSingleArtListTap.useMutation({
      onSuccess: () => {
        createSingleArtListTapMutation.reset()
        renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  const createSingleArtListTogMutation =
    trpc.items.createSingleArtListTog.useMutation({
      onSuccess: () => {
        createSingleArtListTogMutation.reset()
        renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  const createSingleFadListMutation =
    trpc.items.createSingleFadList.useMutation({
      onSuccess: () => {
        createSingleFadListMutation.reset()
        refetch()
      },
      onError: () => {
        alert('There was an error submitting your request. Please try again.')
      }
    })
  //////////////////////////////////////////
  const deleteSingleFullRangeMutation =
    trpc.items.deleteSingleFullRange.useMutation({
      onSuccess: () => {
        deleteSingleFullRangeMutation.reset()
        refetch()
      },
      onError: (error) => {
        alert(
          error ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const deleteSingleArtListTapMutation =
    trpc.items.deleteSingleArtListTap.useMutation({
      onSuccess: () => {
        deleteSingleArtListTapMutation.reset()
        refetch()
      },
      onError: (error) => {
        alert(
          error ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const deleteSingleArtListTogMutation =
    trpc.items.deleteSingleArtListTog.useMutation({
      onSuccess: () => {
        deleteSingleArtListTogMutation.reset()
        refetch()
      },
      onError: (error) => {
        alert(
          error ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const deleteSingleFadListMutation =
    trpc.items.deleteSingleFadList.useMutation({
      onSuccess: () => {
        deleteSingleFadListMutation.reset()
        refetch()
      },
      onError: (error) => {
        alert(
          error ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  //////////////////////////////////////////
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
      } else {
        updateSingleArtListTapMutation.mutate({
          artId: layoutDataSingleId ?? '',
          [key]: newValue
        })
      }
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
              <table className='w-full table-fixed border-separate border-spacing-0 text-left text-xs '>
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
                    <td className={tw(trackTh, 'w-[5%] text-center')}>
                      <button
                        onClick={() =>
                          createSingleSubItemMutationHelper(layoutConfig.label)
                        }>
                        <i className='fa-solid fa-plus' />
                      </button>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {layoutDataArray?.map((layoutDataSingle) => {
                    const layoutDataSingleId = layoutDataSingle.id

                    return (
                      <tr
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
                                layoutConfigLabel={layoutConfig.label}
                                layoutDataSingle={layoutDataSingle}
                                onChangeHelper={onChangeHelper}
                                selectedItem={selectedItem as SelectedItemType}
                              />
                            </td>
                          )
                        })}
                        <td className='text-center'>
                          <button
                            onClick={() =>
                              deleteSingleSubItemMutationHelper(
                                layoutDataSingleId,
                                layoutConfig.label
                              )
                            }>
                            <i className='fa-solid fa-minus' />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            {!table && (
              <div className='flex gap-1 overflow-x-scroll'>
                {layoutDataArray?.map((layoutDataSingle) => {
                  const layoutDataSingleId = layoutDataSingle.id
                  return (
                    <table
                      key={layoutDataSingleId}
                      className='w-max table-auto border-separate border-spacing-0 text-left text-xs'>
                      <thead>
                        <tr>
                          <td className={tw(trackTh, 'w-1/2')}>
                            {layoutDataSingleId}
                          </td>
                          <td className={tw(trackTh, 'flex justify-between')}>
                            <button
                              onClick={() =>
                                deleteSingleSubItemMutationHelper(
                                  layoutDataSingleId,
                                  layoutConfig.label
                                )
                              }>
                              <i className='fa-solid fa-minus' />
                            </button>
                            <button
                              onClick={() =>
                                createSingleSubItemMutationHelper(
                                  layoutConfig.label
                                )
                              }>
                              <i className='fa-solid fa-plus' />
                            </button>
                          </td>
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
