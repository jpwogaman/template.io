import { type FC, Fragment, useState, type ChangeEvent } from 'react'
import { trpc } from '@/utils/trpc'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackOptionsTableKeys from './trackOptionsTableKeys'
import {
  InputText,
  InputSelectSingle,
  InputSelectMultiple,
  InputCheckBox,
  InputCheckBoxSwitch
} from './inputs'

import {
  type ItemsArtListSwitch,
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
  const updateSingleArtListSwitchMutation =
    trpc.items.updateSingleArtListSwitch.useMutation({
      onSuccess: () => {
        updateSingleArtListSwitchMutation.reset()
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
  const createSingleArtListSwitchMutation =
    trpc.items.createSingleArtListSwitch.useMutation({
      onSuccess: () => {
        createSingleArtListSwitchMutation.reset()
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
  const deleteSingleArtListSwitchMutation =
    trpc.items.deleteSingleArtListSwitch.useMutation({
      onSuccess: () => {
        deleteSingleArtListSwitchMutation.reset()
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

  const trackTr = `bg-zinc-300 
  dark:bg-zinc-600 
  `
  const trackTd = ``

  const [trackOptionsLayouts, setTrackOptionsLayouts] = useState({
    fullRange: 'table',
    artListSwitch: 'table',
    artListTog: 'table',
    fadList: 'table'
  })

  const changeLayoutsHelper = (layoutKey: string, layout: string) => {
    setTrackOptionsLayouts((prevState) => ({
      ...prevState,
      [layoutKey]: layout
    }))
  }

  const layoutConfigKeysMap = (
    keySingle: (typeof TrackOptionsTableKeys)[number]['keys'][number],
    layoutConfigLabel: string,
    layoutDataSingle:
      | ItemsArtListSwitch
      | ItemsArtListTog
      | ItemsFadList
      | ItemsFullRanges
  ) => {
    const { input, selectArray, show, key } = keySingle

    const inputSelectMultiple = input === 'select-multiple'
    const inputSelectSingle = input === 'select'
    const inputCheckBoxSwitch = input === 'checkbox-switch'
    const inputCheckBox = input === 'checkbox'
    const inputText = input === 'text'

    const shortenedSubComponentId = (initialId: string) => {
      return `${initialId.split('_')[2]}_${
        parseInt(initialId.split('_')[3] as string) + 1
      }`
    }

    const artRangeOptions =
      layoutConfigLabel === 'artListSwitch' ||
      layoutConfigLabel === 'artListTog'
    const rangeOptions = key === 'ranges' && artRangeOptions
    const stringListOfFullRangeIds = JSON.stringify(
      selectedItem?.fullRange.map((fullRange: ItemsFullRanges) =>
        shortenedSubComponentId(fullRange.id)
      )
    )

    const inputPropsHelper = {
      id: `${layoutDataSingle.id}_${key}`,
      codeDisabled: selectedItem?.locked,
      defaultValue: layoutDataSingle[key as 'id'],
      options: rangeOptions ? stringListOfFullRangeIds : selectArray ?? '',
      onChangeInputSwitch: (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
      ) =>
        onChangeInputSwitchHelper({
          event,
          layoutDataSingleId: layoutDataSingle.id,
          key,
          label: layoutConfigLabel
        })
    }
    const inputComponent = (
      <>
        {!input && (
          <p
            title={layoutDataSingle.id}
            className='cursor-default overflow-hidden p-1'>
            {shortenedSubComponentId(layoutDataSingle[key as 'id'])}
          </p>
        )}
        {inputSelectSingle && <InputSelectSingle {...inputPropsHelper} />}
        {inputSelectMultiple && <InputSelectMultiple {...inputPropsHelper} />}
        {inputText && <InputText {...inputPropsHelper} />}
        {inputCheckBox && <InputCheckBox {...inputPropsHelper} />}
        {inputCheckBoxSwitch && <InputCheckBoxSwitch {...inputPropsHelper} />}
      </>
    )

    return {
      keyKey: key,
      input,
      show,
      inputComponent
    }
  }

  const onChangeInputSwitchHelper = ({
    event,
    layoutDataSingleId,
    key,
    label
  }: {
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    layoutDataSingleId: string
    key: string
    label: string
  }) => {
    if (label === 'fullRange') {
      if (key === 'whiteKeysOnly') {
        updateSingleFullRangeMutation.mutate({
          rangeId: layoutDataSingleId ?? '',
          whiteKeysOnly: event.target.value === 'true'
        })
      } else {
        updateSingleFullRangeMutation.mutate({
          rangeId: layoutDataSingleId ?? '',
          [key]: event.target.value
        })
      }
    }
    if (label === 'artListSwitch') {
      if (key === 'default') {
        updateSingleArtListSwitchMutation.mutate({
          artId: layoutDataSingleId ?? '',
          default: event.target.value === 'true'
        })
      } else {
        updateSingleArtListSwitchMutation.mutate({
          artId: layoutDataSingleId ?? '',
          [key]: event.target.value
        })
      }
    }
    if (label === 'artListTog') {
      updateSingleArtListTogMutation.mutate({
        artId: layoutDataSingleId ?? '',
        [key]: event.target.value
      })
    }
    if (label === 'fadList') {
      updateSingleFadListMutation.mutate({
        fadId: layoutDataSingleId ?? '',
        [key]: event.target.value
      })
    }
  }

  const createSingleSubItemMutationHelper = (label: string) => {
    if (label === 'fullRange') {
      createSingleFullRangeMutation.mutate({
        itemId: selectedItemId ?? ''
      })
    }
    if (label === 'artListSwitch') {
      createSingleArtListSwitchMutation.mutate({
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
    if (label === 'artListSwitch') {
      deleteSingleArtListSwitchMutation.mutate({
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

  return (
    <div className='h-full w-1/2 overflow-y-scroll'>
      {TrackOptionsTableKeys.map((layoutConfig) => {
        let layoutDataArray:
          | ItemsArtListSwitch[]
          | ItemsArtListTog[]
          | ItemsFadList[]
          | ItemsFullRanges[]
          | undefined = []

        if (layoutConfig.label === 'fullRange') {
          layoutDataArray = selectedItem?.fullRange
        }
        if (layoutConfig.label === 'artListSwitch') {
          layoutDataArray = selectedItem?.artListSwitch
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
            <div className='mt-4 flex justify-between'>
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
                  changeLayoutsHelper(layoutConfig.label, 'cards')
                }
                onToggleB={() =>
                  changeLayoutsHelper(layoutConfig.label, 'table')
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
                        className={`${trackTr}`}>
                        {layoutConfig.keys.map((key) => {
                          const { keyKey, show, inputComponent } =
                            layoutConfigKeysMap(
                              key,
                              layoutConfig.label,
                              layoutDataSingle
                            )

                          if (!show) return

                          return (
                            <td
                              key={keyKey}
                              title={layoutDataSingleId}
                              className={tw(trackTd, 'p-0.5')}>
                              {inputComponent}
                            </td>
                          )
                        })}
                        <td className={tw(trackTd, 'text-center')}>
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
                          const { keyKey, show, inputComponent } =
                            layoutConfigKeysMap(
                              key,
                              layoutConfig.label,
                              layoutDataSingle
                            )

                          if (!show) return
                          return (
                            <tr
                              key={keyKey}
                              className={trackTr}>
                              <td className={tw(trackTd, 'p-0.5')}>
                                {key.label}
                              </td>
                              <td className={tw(trackTd, 'p-0.5')}>
                                {inputComponent}
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
