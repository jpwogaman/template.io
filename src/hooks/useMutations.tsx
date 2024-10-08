import { type Dispatch, type SetStateAction } from 'react'
import { trpc } from '@/utils/trpc'
//import { vepInstanceArray } from '@/components/inputs/input-arrays'

type UseMutationsProps = {
  selectedItemId: string | null
  setSelectedItemId: Dispatch<SetStateAction<string | null>>
}

const useMutations = ({
  selectedItemId,
  setSelectedItemId
}: UseMutationsProps) => {
  //////////////////////////////////////////
  // initial queries
  const { data, refetch: refetchAll } = trpc.items.getAllItems.useQuery()
  const { data: selectedItem, refetch: refetchSelected } =
    trpc.items.getSingleItem.useQuery({
      itemId: selectedItemId ?? ''
    })
  //////////////////////////////////////////
  // logic to count vep samplers and instances
  const dataLength = data?.length ?? 0
  let vepSamplerCount = 0
  let nonVepSamplerCount = 0

  const vepInstanceArray: string[] = []
  for (const item of data ?? []) {
    vepInstanceArray.push(item.vepInstance)
  }
  const vepInstanceArraySet = new Set(
    vepInstanceArray.filter((item) => item !== '')
  )
  const vepInstanceArraySetArray = Array.from(vepInstanceArraySet)
  const vepInstanceCount = vepInstanceArraySetArray.filter(
    (item) => item !== 'N/A'
  ).length

  const instanceArraysObject: {
    [key: string]: string[]
  } = {}

  for (const element of vepInstanceArraySetArray) {
    Object.defineProperty(instanceArraysObject, element, {
      value: [],
      writable: true,
      enumerable: true,
      configurable: true
    })
  }

  for (const item of data ?? []) {
    const itemInstance = item.vepInstance
    if (itemInstance === '') continue

    if (itemInstance === 'N/A') {
      if (item.name === '') continue
      if (item.channel !== 1) continue
      nonVepSamplerCount++
      continue
    }

    if (vepInstanceArraySetArray.find((element) => element === itemInstance)) {
      instanceArraysObject[itemInstance]?.push(item.smpNumber)
    }
  }

  const eachInstanceArraySet: {
    [key: string]: Set<string>
  } = {}

  for (const [key, value] of Object.entries(instanceArraysObject)) {
    eachInstanceArraySet[key] = new Set(value)
  }

  const eachInstanceArraySetArray: {
    [key: string]: string[]
  } = {}

  for (const [key, value] of Object.entries(eachInstanceArraySet)) {
    eachInstanceArraySetArray[key] = Array.from(value)
  }

  const eachInstanceArraySetArrayLength: {
    [key: string]: number
  } = {}

  for (const [key, value] of Object.entries(eachInstanceArraySetArray)) {
    eachInstanceArraySetArrayLength[key] = value.length
  }

  const eachInstanceArraySetArrayLengthArray = Object.values(
    eachInstanceArraySetArrayLength
  )

  for (const element of eachInstanceArraySetArrayLengthArray) {
    vepSamplerCount += element
  }

  //////////////////////////////////////////
  // logic to find previous and next item ids
  const selectedItemIndex =
    data?.findIndex((item) => item.id === selectedItemId) ?? 0
  const previousItemId = data?.[selectedItemIndex - 1]?.id ?? ''
  const nextItemId = data?.[selectedItemIndex + 1]?.id ?? ''

  //////////////////////////////////////////
  // logic to count selected item's connected sub-items
  const selectedItemRangeCount =
    data?.[selectedItemIndex]?._count?.fullRange ?? 0
  const selectedItemArtTogCount =
    data?.[selectedItemIndex]?._count?.artListTog ?? 0
  const selectedItemArtTapCount =
    data?.[selectedItemIndex]?._count?.artListTap ?? 0
  const selectedItemArtCount = selectedItemArtTogCount + selectedItemArtTapCount
  const selectedItemLayerCount =
    data?.[selectedItemIndex]?._count?.artLayers ?? 0
  const selectedItemFadCount = data?.[selectedItemIndex]?._count?.fadList ?? 0

  //////////////////////////////////////////
  // CREATE mutations
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
  const createSingleArtLayerMutation =
    trpc.items.createSingleArtLayer.useMutation({
      onSuccess: () => {
        createSingleArtLayerMutation.reset()
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
  // UPDATE mutations
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
  const updateSingleArtLayerMutation =
    trpc.items.updateSingleArtLayer.useMutation({
      onSuccess: () => {
        updateSingleArtLayerMutation.reset()
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
  //////////////////////////////////////////
  // DELETE mutations
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
  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      createSingleItemMutation.mutate({
        count: 1
      })
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
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
  const deleteSingleArtLayerMutation =
    trpc.items.deleteSingleArtLayer.useMutation({
      onSuccess: () => {
        deleteSingleArtLayerMutation.reset()
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
  //////////////////////////////////////////
  // CLEAR mutations
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
  // RENUMBER/REORDER mutations
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
  //////////////////////////////////////////
  // PASTE/DUPLICATE mutations
  const pasteSingleItemMutation = trpc.items.pasteSingleItem.useMutation({
    onSuccess: () => {
      pasteSingleItemMutation.reset()
      refetchAll()
      refetchSelected()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  //////////////////////////////////////////

  const create = {
    track: createSingleItemMutation.mutate,
    fullRange: createSingleFullRangeMutation.mutate,
    artListTog: createSingleArtListTogMutation.mutate,
    artListTap: createSingleArtListTapMutation.mutate,
    artLayer: createSingleArtLayerMutation.mutate,
    fadList: createSingleFadListMutation.mutate
  }
  const update = {
    track: updateSingleItemMutation.mutate,
    fullRange: updateSingleFullRangeMutation.mutate,
    artListTog: updateSingleArtListTogMutation.mutate,
    artListTap: updateSingleArtListTapMutation.mutate,
    artLayer: updateSingleArtLayerMutation.mutate,
    fadList: updateSingleFadListMutation.mutate
  }
  const del = {
    track: deleteSingleItemMutation.mutate,
    allTracks: deleteAllItemsMutation.mutate,
    fullRange: deleteSingleFullRangeMutation.mutate,
    artListTog: deleteSingleArtListTogMutation.mutate,
    artListTap: deleteSingleArtListTapMutation.mutate,
    artLayer: deleteSingleArtLayerMutation.mutate,
    fadList: deleteSingleFadListMutation.mutate
  }
  const clear = {
    track: clearSingleItemMutation.mutate
  }
  const renumber = {
    allTracks: renumberAllItemsMutation.mutate,
    artList: renumberArtListMutation.mutate
  }
  const paste = {
    track: pasteSingleItemMutation.mutate
  }

  return {
    data,
    dataLength,
    refetchAll,
    refetchSelected,
    vepSamplerCount,
    vepInstanceCount,
    nonVepSamplerCount,
    /////////////////////////////////
    selectedItem,
    selectedItemIndex,
    selectedItemRangeCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemArtCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    previousItemId,
    nextItemId,
    /////////////////////////////////
    create,
    update,
    del,
    clear,
    renumber,
    paste
  }
}

export default useMutations
