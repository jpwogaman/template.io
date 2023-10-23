import { type FC, Fragment, useState, ChangeEvent } from 'react'
import { trpc } from '@/utils/trpc'
import { SelectList, selectArrays } from '@/components/input-arrays'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import tw from '@/utils/tw'
import TrackOptionsTableKeys from './trackOptionsTableKeys'
import { InputText } from './input-text'
import { InputSelect } from './input-select-single'
import { InputSelectMultiple } from './input-select-multiple'
import { InputCheckBox } from './input-checkbox'
import { InputCheckBoxSwitch } from './input-checkbox-switch'

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

  const updateSingleItemMutation = trpc.items.updateSingleItem.useMutation({
    onSuccess: () => {
      updateSingleItemMutation.reset()
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
    layoutDataSingle:
      | ItemsArtListSwitch
      | ItemsArtListTog
      | ItemsFadList
      | ItemsFullRanges,
    layoutConfigLabel: string
  ) => {
    const { input, selectArray, show, key } = keySingle

    const inputSelectMultiple = input === 'select-multiple'
    const inputSelectSingle = input === 'select'
    const inputCheckBoxSwitch = input === 'checkbox-switch'
    const inputCheckBox = input === 'checkbox'
    const inputText = input === 'text'

    const inputPropsHelper = {
      id: `${key}_${layoutDataSingle.id}`,
      codeDisabled: selectedItem?.locked,
      options: selectArray ?? '',
      onChangeInputSwitch: (
        event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
      ) =>
        onChangeInputSwitchHelper({
          event,
          layoutDataSingleId: layoutDataSingle.id,
          key,
          label: layoutConfigLabel
        }),
      defaultValue: layoutDataSingle[key as 'id']
    }

    return {
      keyKey: key,
      input,
      show,
      inputCheckBoxSwitch,
      inputCheckBox,
      inputText,
      inputSelectMultiple,
      inputSelectSingle,
      inputPropsHelper
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
                      //onClick={() => addSubItem(level.label)}
                      >
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
                          const {
                            keyKey,
                            input,
                            show,
                            inputSelectMultiple,
                            inputSelectSingle,
                            inputCheckBoxSwitch,
                            inputCheckBox,
                            inputText,
                            inputPropsHelper
                          } = layoutConfigKeysMap(
                            key,
                            layoutDataSingle,
                            layoutConfig.label
                          )

                          if (!show) return

                          return (
                            <td
                              key={keyKey}
                              title={layoutDataSingleId}
                              className={tw(trackTd, 'p-0.5')}>
                              {!input && (
                                <p
                                  title={layoutDataSingleId}
                                  className='overflow-hidden p-1'>
                                  {layoutDataSingleId}
                                </p>
                              )}{' '}
                              {inputSelectSingle && (
                                <InputSelect {...inputPropsHelper} />
                              )}
                              {inputSelectMultiple && (
                                <InputSelectMultiple {...inputPropsHelper} />
                              )}
                              {inputText && <InputText {...inputPropsHelper} />}
                              {inputCheckBox && (
                                <InputCheckBox {...inputPropsHelper} />
                              )}
                              {inputCheckBoxSwitch && (
                                <InputCheckBoxSwitch {...inputPropsHelper} />
                              )}
                            </td>
                          )
                        })}
                        <td className={tw(trackTd, 'text-center')}>
                          <button
                          //  onClick={() =>
                          //    deleteSingleFullRangeMutation.mutate({
                          //      fileItemsItemId: 'T_9',
                          //      rangeId: subSection.artId
                          //    })
                          //  }
                          >
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
                            //  onClick={() =>
                            //    deleteSingleFullRangeMutation.mutate({
                            //      fileItemsItemId: 'T_9',
                            //      rangeId: subSection.artId
                            //    })
                            //  }
                            >
                              <i className='fa-solid fa-minus' />
                            </button>
                            <button
                            //  onClick={() =>
                            //    createSingleFullRangeMutation.mutate({
                            //      itemId: 'T_9',
                            //    })}
                            >
                              <i className='fa-solid fa-plus' />
                            </button>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {layoutConfig.keys.map((key) => {
                          const {
                            keyKey,
                            input,
                            show,
                            inputSelectMultiple,
                            inputSelectSingle,
                            inputCheckBoxSwitch,
                            inputCheckBox,
                            inputText,
                            inputPropsHelper
                          } = layoutConfigKeysMap(
                            key,
                            layoutDataSingle,
                            layoutConfig.label
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
                                {!input && (
                                  <p
                                    title={layoutDataSingleId}
                                    className='overflow-hidden p-1'>
                                    {layoutDataSingleId}
                                  </p>
                                )}{' '}
                                {inputSelectSingle && (
                                  <InputSelect {...inputPropsHelper} />
                                )}
                                {inputSelectMultiple && (
                                  <InputSelectMultiple {...inputPropsHelper} />
                                )}
                                {inputText && (
                                  <InputText {...inputPropsHelper} />
                                )}
                                {inputCheckBox && (
                                  <InputCheckBox {...inputPropsHelper} />
                                )}
                                {inputCheckBoxSwitch && (
                                  <InputCheckBoxSwitch {...inputPropsHelper} />
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

export default TrackOptions
