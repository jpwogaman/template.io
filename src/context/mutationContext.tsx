'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type FC
} from 'react'

import { api as trpc } from '@/utils/trpc/react'
import { exportJSON } from '@/utils/exportJSON'
import { useSelectedItem } from './selectedItemContext'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { type AppRouter } from '@/server/trpc/root'

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>

type ItemsInput = RouterInput['items']
type ItemsOutput = RouterOutput['items']

interface MutationContextType {
  data: ItemsOutput['getAllItems'] | undefined
  dataLength: number
  refetchAll: () => void
  refetchSelected: () => void
  vepSamplerCount: number
  vepInstanceCount: number
  nonVepSamplerCount: number
  //////////////////////////////////////////
  selectedItem: ItemsOutput['getSingleItem'] | undefined
  selectedItemIndex: number
  selectedItemRangeCount: number
  selectedItemArtTogCount: number
  selectedItemArtTapCount: number
  selectedItemArtCount: number
  selectedItemLayerCount: number
  selectedItemFadCount: number
  previousItemId: string
  nextItemId: string
  //////////////////////////////////////////
  exportItems: {
    export: () => void
  }
  create: {
    allItemsFromJSON: (data: ItemsInput['createAllItemsFromJSON']) => void
    track: (data: ItemsInput['createSingleItem']) => void
    fullRange: (data: ItemsInput['createSingleFullRange']) => void
    artListTog: (data: ItemsInput['createSingleArtListTog']) => void
    artListTap: (data: ItemsInput['createSingleArtListTap']) => void
    artLayer: (data: ItemsInput['createSingleArtLayer']) => void
    fadList: (data: ItemsInput['createSingleFadList']) => void
  }
  update: {
    track: (data: ItemsInput['updateSingleItem']) => void
    fullRange: (data: ItemsInput['updateSingleFullRange']) => void
    artListTog: (data: ItemsInput['updateSingleArtListTog']) => void
    artListTap: (data: ItemsInput['updateSingleArtListTap']) => void
    artLayer: (data: ItemsInput['updateSingleArtLayer']) => void
    fadList: (data: ItemsInput['updateSingleFadList']) => void
  }
  del: {
    track: (data: { itemId: string }) => void
    allTracks: () => void
    fullRange: (data: ItemsInput['deleteSingleFullRange']) => void
    artListTog: (data: ItemsInput['deleteSingleArtListTog']) => void
    artListTap: (data: ItemsInput['deleteSingleArtListTap']) => void
    artLayer: (data: ItemsInput['deleteSingleArtLayer']) => void
    fadList: (data: ItemsInput['deleteSingleFadList']) => void
  }
  clear: {
    track: (data: ItemsInput['clearSingleItem']) => void
  }
  renumber: {
    allTracks: () => void
    artList: (data: ItemsInput['renumberArtList']) => void
  }
  paste: {
    track: (data: ItemsInput['pasteSingleItem']) => void
  }
}

const mutationContextDefaultValues: MutationContextType = {
  data: [],
  dataLength: 0,
  refetchAll: () => {},
  refetchSelected: () => {},
  vepSamplerCount: 0,
  vepInstanceCount: 0,
  nonVepSamplerCount: 0,
  //////////////////////////////////////////
  selectedItem: undefined,
  selectedItemIndex: 0,
  selectedItemRangeCount: 0,
  selectedItemArtTogCount: 0,
  selectedItemArtTapCount: 0,
  selectedItemArtCount: 0,
  selectedItemLayerCount: 0,
  selectedItemFadCount: 0,
  previousItemId: '',
  nextItemId: '',
  //////////////////////////////////////////
  exportItems: {
    export: () => {}
  },
  create: {
    allItemsFromJSON: () => {},
    track: () => {},
    fullRange: () => {},
    artListTog: () => {},
    artListTap: () => {},
    artLayer: () => {},
    fadList: () => {}
  },
  update: {
    track: () => {},
    fullRange: () => {},
    artListTog: () => {},
    artListTap: () => {},
    artLayer: () => {},
    fadList: () => {}
  },
  del: {
    track: () => {},
    allTracks: () => {},
    fullRange: () => {},
    artListTog: () => {},
    artListTap: () => {},
    artLayer: () => {},
    fadList: () => {}
  },
  clear: {
    track: () => {}
  },
  renumber: {
    allTracks: () => {},
    artList: () => {}
  },
  paste: {
    track: () => {}
  }
}

export const mutationContext = createContext<MutationContextType>(
  mutationContextDefaultValues
)

interface MutationProviderProps {
  children: ReactNode
}

export const MutationProvider: FC<MutationProviderProps> = ({ children }) => {
  const { selectedItemId, setSelectedItemId } = useSelectedItem()

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
  // EXPORT mutations
  const exportMutation = trpc.tauriMenuEvents.export.useMutation({
    onSuccess: (data) => {
      exportJSON(data)
      exportMutation.reset()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  //////////////////////////////////////////
  // CREATE mutations
  const createAllItemsFromJSONMutation =
    trpc.items.createAllItemsFromJSON.useMutation({
      onSuccess: () => {
        createAllItemsFromJSONMutation.reset()
      },
      onError: (error) => {
        alert(error.message)
      }
    })
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
  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      deleteAllItemsMutation.reset()
      createSingleItemMutation.mutate({
        count: 1
      })
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
  const exportItems = {
    export: exportMutation.mutate
  }
  const create = {
    allItemsFromJSON: createAllItemsFromJSONMutation.mutate,
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
  const value = useMemo(
    () => ({
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
      exportItems,
      create,
      update,
      del,
      clear,
      renumber,
      paste
    }),
    [
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
      exportItems,
      create,
      update,
      del,
      clear,
      renumber,
      paste
    ]
  )

  return (
    <mutationContext.Provider value={value}>
      {children}
    </mutationContext.Provider>
  )
}

export const useMutations = () => {
  return useContext(mutationContext)
}
