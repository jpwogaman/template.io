import { type Dispatch, type SetStateAction } from 'react'
import { trpc } from '@/utils/trpc'

type UseMutationsProps = {
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
}

const useMutations = ({
  selectedItemId,
  setSelectedItemId
}: UseMutationsProps) => {
  const { data, refetch: refetchAll } = trpc.items.getAllItems.useQuery()
  const { data: selectedItem, refetch: refetchSelected } =
    trpc.items.getSingleItem.useQuery({
      itemId: selectedItemId ?? ''
    })

  const dataLength = data?.length ?? 0

  const selectedItemIndex =
    data?.findIndex((item) => item.id === selectedItemId) ?? 0
  const previousItemId = data?.[selectedItemIndex - 1]?.id ?? ''
  const nextItemId = data?.[selectedItemIndex + 1]?.id ?? ''

  const selectedItemRangeCount =
    data?.[selectedItemIndex]?._count?.fullRange ?? 0
  const selectedItemArtTogCount =
    data?.[selectedItemIndex]?._count?.artListTog ?? 0
  const selectedItemArtTapCount =
    data?.[selectedItemIndex]?._count?.artListTap ?? 0
  const selectedItemArtCount = selectedItemArtTogCount + selectedItemArtTapCount
  const selectedItemFadCount = data?.[selectedItemIndex]?._count?.fadList ?? 0

  const createSingleItemMutation = trpc.items.createSingleItem.useMutation({
    onSuccess: () => {
      createSingleItemMutation.reset()
      refetchAll()
      refetchSelected()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  const deleteSingleItemMutation = trpc.items.deleteSingleItem.useMutation({
    onSuccess: () => {
      deleteSingleItemMutation.reset()
      refetchAll()
      refetchSelected()
      setSelectedItemId(previousItemId)
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const updateSingleItemMutation = trpc.items.updateSingleItem.useMutation({
    onSuccess: () => {
      updateSingleItemMutation.reset()
      refetchAll()
      refetchSelected()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  const renumberAllItemsMutation = trpc.items.renumberAllItems.useMutation({
    onSuccess: () => {
      renumberAllItemsMutation.reset()
      refetchSelected()
      refetchAll()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      createSingleItemMutation.mutate()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const clearSingleItemMutation = trpc.items.clearSingleItem.useMutation({
    onSuccess: () => {
      clearSingleItemMutation.reset()
      refetchSelected()
      refetchAll()
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
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const updateSingleArtListTapMutation =
    trpc.items.updateSingleArtListTap.useMutation({
      onSuccess: () => {
        updateSingleArtListTapMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const updateSingleArtListTogMutation =
    trpc.items.updateSingleArtListTog.useMutation({
      onSuccess: () => {
        updateSingleArtListTogMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const updateSingleFadListMutation =
    trpc.items.updateSingleFadList.useMutation({
      onSuccess: () => {
        updateSingleFadListMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const createSingleFullRangeMutation =
    trpc.items.createSingleFullRange.useMutation({
      onSuccess: () => {
        createSingleFullRangeMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })

  const renumberArtListMutation = trpc.items.renumberArtList.useMutation({
    onSuccess: () => {
      renumberArtListMutation.reset()

      refetchSelected()
      refetchAll()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  const createSingleArtListTapMutation =
    trpc.items.createSingleArtListTap.useMutation({
      onSuccess: () => {
        createSingleArtListTapMutation.reset()
        //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const createSingleArtListTogMutation =
    trpc.items.createSingleArtListTog.useMutation({
      onSuccess: () => {
        createSingleArtListTogMutation.reset()
        //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const createSingleFadListMutation =
    trpc.items.createSingleFadList.useMutation({
      onSuccess: () => {
        createSingleFadListMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  //////////////////////////////////////////
  const deleteSingleFullRangeMutation =
    trpc.items.deleteSingleFullRange.useMutation({
      onSuccess: () => {
        deleteSingleFullRangeMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const deleteSingleArtListTapMutation =
    trpc.items.deleteSingleArtListTap.useMutation({
      onSuccess: () => {
        deleteSingleArtListTapMutation.reset()
        //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const deleteSingleArtListTogMutation =
    trpc.items.deleteSingleArtListTog.useMutation({
      onSuccess: () => {
        deleteSingleArtListTogMutation.reset()
        //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })
  const deleteSingleFadListMutation =
    trpc.items.deleteSingleFadList.useMutation({
      onSuccess: () => {
        deleteSingleFadListMutation.reset()
        refetchSelected()
      },
      onError: (error) => {
        alert(
          error.message ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })

  return {
    data,
    selectedItem,
    refetchAll,
    refetchSelected,
    selectedItemIndex,
    dataLength,
    previousItemId,
    nextItemId,
    selectedItemRangeCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemArtCount,
    selectedItemFadCount,
    createSingleItemMutation,
    deleteSingleItemMutation,
    clearSingleItemMutation,
    renumberArtListMutation,
    renumberAllItemsMutation,
    deleteAllItemsMutation,
    updateSingleItemMutation,
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
  }
}

export default useMutations
