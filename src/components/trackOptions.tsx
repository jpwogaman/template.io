import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { selectArrays } from '@/components/select-arrays'
import { trpc } from '@/utils/trpc'
import tw from '@/utils/tw'
import { type ChangeEvent, useState, FC } from 'react'
import { type LayoutKeys } from '@/utils/template-io-track-data-schema'

let optionElements: string | React.JSX.Element | undefined

const TrackOptions: FC = () => {
  const { data, refetch } = trpc.items.getSingleItem.useQuery({ itemId: '' })

  const updateSingleItemMutation = trpc.items.updateSingleItem.useMutation({
    onSuccess: () => {
      updateSingleItemMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const createSingleFullRangeMutation =
    trpc.items.addSingleFullRange.useMutation({
      onSuccess: () => {
        createSingleFullRangeMutation.reset()
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

  return <div className='max-h-[85%] w-6/12 border border-black'></div>
}

export default TrackOptions
