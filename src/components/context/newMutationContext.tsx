'use client'

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
  type FC,
  useEffect,
  useState
} from 'react'

import { invoke } from '@tauri-apps/api/core'

import { exportJSON } from '@/utils/exportJSON'
import { useSelectedItem } from './selectedItemContext'

interface MutationContextType {
  data: FileItem[] | null
  dataLength: number
  refetchAll: () => void
  refetchSelected: () => void
  vepSamplerCount: number
  vepInstanceCount: number
  nonVepSamplerCount: number
  //////////////////////////////////////////
  selectedItem: FileItem | null
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
    allItemsFromJSON: (data: any) => void
    track: (data: any) => void
    fullRange: (data: any) => void
    artListTog: (data: any) => void
    artListTap: (data: any) => void
    artLayer: (data: any) => void
    fadList: (data: any) => void
  }
  update: {
    track: (data: any) => void
    fullRange: (data: any) => void
    artListTog: (data: any) => void
    artListTap: (data: any) => void
    artLayer: (data: any) => void
    fadList: (data: any) => void
  }
  del: {
    track: (data: { itemId: string }) => void
    allTracks: () => void
    fullRange: (data: any) => void
    artListTog: (data: any) => void
    artListTap: (data: any) => void
    artLayer: (data: any) => void
    fadList: (data: any) => void
  }
  clear: {
    track: (data: any) => void
  }
  renumber: {
    allTracks: () => void
    artList: (data: any) => void
  }
  paste: {
    track: (data: any) => void
  }
}

const mutationContextDefaultValues: MutationContextType = {
  data: null,
  dataLength: 0,
  refetchAll: () => {},
  refetchSelected: () => {},
  vepSamplerCount: 0,
  vepInstanceCount: 0,
  nonVepSamplerCount: 0,
  //////////////////////////////////////////
  selectedItem: null,
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
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<FileItem[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null)

  useEffect(() => {
    setMounted(true)
    getData()
    getSelectedItem()
  }, [])

  //////////////////////////////////////////
  // initial queries
  const getData = useCallback(
    async () =>
      await invoke('list_fileitems').then((data) => {
        setData(data as FileItem[])
      }),
    []
  )

  const refetchAll = () => getData()

  const getSelectedItem = useCallback(
    async () =>
      await invoke('get_fileitem', { id: selectedItemId }).then((data) => {
        setSelectedItem(data as FileItem)
      }),
    []
  )

  const refetchSelected = () => getSelectedItem()
  //////////////////////////////////////////
  // logic to count vep samplers and instances
  const dataLength = data?.length ?? 0
  let vepSamplerCount = 0
  let nonVepSamplerCount = 0
  let vepInstanceCount = 0

  //const vepInstanceArray: string[] = []
  //for (const item of data ?? []) {
  //  vepInstanceArray.push(item.vepInstance)
  //}
  //const vepInstanceArraySet = new Set(
  //  vepInstanceArray.filter((item) => item !== '')
  //)
  //const vepInstanceArraySetArray = Array.from(vepInstanceArraySet)
  //const vepInstanceCount = vepInstanceArraySetArray.filter(
  //  (item) => item !== 'N/A'
  //).length

  //const instanceArraysObject: {
  //  [key: string]: string[]
  //} = {}

  //for (const element of vepInstanceArraySetArray) {
  //  Object.defineProperty(instanceArraysObject, element, {
  //    value: [],
  //    writable: true,
  //    enumerable: true,
  //    configurable: true
  //  })
  //}

  //for (const item of data ?? []) {
  //  const itemInstance = item.vepInstance
  //  if (itemInstance === '') continue

  //  if (itemInstance === 'N/A') {
  //    if (item.name === '') continue
  //    if (item.channel !== 1) continue
  //    nonVepSamplerCount++
  //    continue
  //  }

  //  if (vepInstanceArraySetArray.find((element) => element === itemInstance)) {
  //    instanceArraysObject[itemInstance]?.push(item.smpNumber)
  //  }
  //}

  //const eachInstanceArraySet: {
  //  [key: string]: Set<string>
  //} = {}

  //for (const [key, value] of Object.entries(instanceArraysObject)) {
  //  eachInstanceArraySet[key] = new Set(value)
  //}

  //const eachInstanceArraySetArray: {
  //  [key: string]: string[]
  //} = {}

  //for (const [key, value] of Object.entries(eachInstanceArraySet)) {
  //  eachInstanceArraySetArray[key] = Array.from(value)
  //}

  //const eachInstanceArraySetArrayLength: {
  //  [key: string]: number
  //} = {}

  //for (const [key, value] of Object.entries(eachInstanceArraySetArray)) {
  //  eachInstanceArraySetArrayLength[key] = value.length
  //}

  //const eachInstanceArraySetArrayLengthArray = Object.values(
  //  eachInstanceArraySetArrayLength
  //)

  //for (const element of eachInstanceArraySetArrayLengthArray) {
  //  vepSamplerCount += element
  //}

  //////////////////////////////////////////
  // logic to find previous and next item ids

  let selectedItemIndex = 0
  let previousItemId = ''
  let nextItemId = ''
  let selectedItemRangeCount = 0
  let selectedItemArtTogCount = 0
  let selectedItemArtTapCount = 0
  let selectedItemArtCount = 0
  let selectedItemLayerCount = 0
  let selectedItemFadCount = 0

  //const selectedItemIndex =
  //  data?.findIndex((item: any) => item.id === selectedItemId) ?? 0
  //const previousItemId = data?.[selectedItemIndex - 1]?.id ?? ''
  //const nextItemId = data?.[selectedItemIndex + 1]?.id ?? ''

  ////////////////////////////////////////////
  //// logic to count selected item's connected sub-items
  //const selectedItemRangeCount =
  //  data?.[selectedItemIndex]?._count?.fullRange ?? 0
  //const selectedItemArtTogCount =
  //  data?.[selectedItemIndex]?._count?.artListTog ?? 0
  //const selectedItemArtTapCount =
  //  data?.[selectedItemIndex]?._count?.artListTap ?? 0
  //const selectedItemArtCount = selectedItemArtTogCount + selectedItemArtTapCount
  //const selectedItemLayerCount =
  //  data?.[selectedItemIndex]?._count?.artLayers ?? 0
  //const selectedItemFadCount = data?.[selectedItemIndex]?._count?.fadList ?? 0

  //////////////////////////////////////////
  // EXPORT mutations
  const exportMutation = () => {
    console.log('exportMutation')
  }

  //const exportMutation = trpc.tauriMenuEvents.export.useMutation({
  //  onSuccess: (data) => {
  //    exportJSON(data)
  //    exportMutation.reset()
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})

  //////////////////////////////////////////
  // CREATE mutations
  const createAllItemsFromJSONMutation = (data: any) => {
    console.log('createAllItemsFromJSONMutation')
  }
  //const createAllItemsFromJSONMutation =
  //  trpc.items.createAllItemsFromJSON.useMutation({
  //    onSuccess: () => {
  //      createAllItemsFromJSONMutation.reset()
  //    },
  //    onError: (error) => {
  //      alert(error.message)
  //    }
  //  })
  const createSingleItemMutation = ({ count }: { count: number }) => {
    void invoke('create_fileitem', { count: count })
      .then(() => {
        refetchAll()
        refetchSelected()
      })
      .catch((error) => {
        console.log('create_fileitem error', error)
      })
  }
  const createSingleFullRangeMutation = (data: any) => {
    console.log('createSingleFullRangeMutation')
  }
  //const createSingleFullRangeMutation =
  //  trpc.items.createSingleFullRange.useMutation({
  //    onSuccess: () => {
  //      createSingleFullRangeMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const createSingleArtListTogMutation = (data: any) => {
    console.log('createSingleArtListTogMutation')
  }
  //const createSingleArtListTogMutation =
  //  trpc.items.createSingleArtListTog.useMutation({
  //    onSuccess: () => {
  //      createSingleArtListTogMutation.reset()
  //      //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const createSingleArtListTapMutation = (data: any) => {
    console.log('createSingleArtListTapMutation')
  }
  //const createSingleArtListTapMutation =
  //  trpc.items.createSingleArtListTap.useMutation({
  //    onSuccess: () => {
  //      createSingleArtListTapMutation.reset()
  //      //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const createSingleArtLayerMutation = (data: any) => {
    console.log('createSingleArtLayerMutation')
  }
  //const createSingleArtLayerMutation =
  //  trpc.items.createSingleArtLayer.useMutation({
  //    onSuccess: () => {
  //      createSingleArtLayerMutation.reset()
  //      //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const createSingleFadListMutation = (data: any) => {
    console.log('createSingleFadListMutation')
  }
  //const createSingleFadListMutation =
  //  trpc.items.createSingleFadList.useMutation({
  //    onSuccess: () => {
  //      createSingleFadListMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  ////////////////////////////////////////////
  //// UPDATE mutations
  const updateSingleItemMutation = (data: any) => {
    console.log('updateSingleItemMutation')
  }
  //const updateSingleItemMutation = trpc.items.updateSingleItem.useMutation({
  //  onSuccess: () => {
  //    updateSingleItemMutation.reset()
  //    refetchAll()
  //    refetchSelected()
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  const updateSingleFullRangeMutation = (data: any) => {
    console.log('updateSingleFullRangeMutation')
  }
  //const updateSingleFullRangeMutation =
  //  trpc.items.updateSingleFullRange.useMutation({
  //    onSuccess: () => {
  //      updateSingleFullRangeMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const updateSingleArtListTogMutation = (data: any) => {
    console.log('updateSingleArtListTogMutation')
  }
  //const updateSingleArtListTogMutation =
  //  trpc.items.updateSingleArtListTog.useMutation({
  //    onSuccess: () => {
  //      updateSingleArtListTogMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const updateSingleArtListTapMutation = (data: any) => {
    console.log('updateSingleArtListTapMutation')
  }
  //const updateSingleArtListTapMutation =
  //  trpc.items.updateSingleArtListTap.useMutation({
  //    onSuccess: () => {
  //      updateSingleArtListTapMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const updateSingleArtLayerMutation = (data: any) => {
    console.log('updateSingleArtLayerMutation')
  }
  //const updateSingleArtLayerMutation =
  //  trpc.items.updateSingleArtLayer.useMutation({
  //    onSuccess: () => {
  //      updateSingleArtLayerMutation.reset()
  //      //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const updateSingleFadListMutation = (data: any) => {
    console.log('updateSingleFadListMutation')
  }
  //const updateSingleFadListMutation =
  //  trpc.items.updateSingleFadList.useMutation({
  //    onSuccess: () => {
  //      updateSingleFadListMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  ////////////////////////////////////////////
  //// DELETE mutations
  const deleteAllItemsMutation = () => {
    console.log('deleteAllItemsMutation')
  }
  //const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
  //  onSuccess: () => {
  //    deleteAllItemsMutation.reset()
  //    createSingleItemMutation.mutate({
  //      count: 1
  //    })
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  const deleteSingleItemMutation = (data: any) => {
    console.log('deleteSingleItemMutation')
  }
  //const deleteSingleItemMutation = trpc.items.deleteSingleItem.useMutation({
  //  onSuccess: () => {
  //    deleteSingleItemMutation.reset()
  //    refetchAll()
  //    refetchSelected()
  //    setSelectedItemId(previousItemId)
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  const deleteSingleFullRangeMutation = (data: any) => {
    console.log('deleteSingleFullRangeMutation')
  }
  //const deleteSingleFullRangeMutation =
  //  trpc.items.deleteSingleFullRange.useMutation({
  //    onSuccess: () => {
  //      deleteSingleFullRangeMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const deleteSingleArtListTogMutation = (data: any) => {
    console.log('deleteSingleArtListTogMutation')
  }
  //const deleteSingleArtListTogMutation =
  //  trpc.items.deleteSingleArtListTog.useMutation({
  //    onSuccess: () => {
  //      deleteSingleArtListTogMutation.reset()
  //      //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const deleteSingleArtListTapMutation = (data: any) => {
    console.log('deleteSingleArtListTapMutation')
  }

  //const deleteSingleArtListTapMutation =
  //  trpc.items.deleteSingleArtListTap.useMutation({
  //    onSuccess: () => {
  //      deleteSingleArtListTapMutation.reset()
  //      //renumberArtListMutation.mutate({ itemId: selectedItemId ?? '' })
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const deleteSingleArtLayerMutation = (data: any) => {
    console.log('deleteSingleArtLayerMutation')
  }
  //const deleteSingleArtLayerMutation =
  //  trpc.items.deleteSingleArtLayer.useMutation({
  //    onSuccess: () => {
  //      deleteSingleArtLayerMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  const deleteSingleFadListMutation = (data: any) => {
    console.log('deleteSingleFadListMutation')
  }
  //const deleteSingleFadListMutation =
  //  trpc.items.deleteSingleFadList.useMutation({
  //    onSuccess: () => {
  //      deleteSingleFadListMutation.reset()
  //      refetchSelected()
  //    },
  //    onError: (error) => {
  //      alert(
  //        error.message ??
  //          'There was an error submitting your request. Please try again.'
  //      )
  //    }
  //  })
  ////////////////////////////////////////////
  //// CLEAR mutations
  const clearSingleItemMutation = (data: any) => {
    console.log('clearSingleItemMutation')
  }
  //const clearSingleItemMutation = trpc.items.clearSingleItem.useMutation({
  //  onSuccess: () => {
  //    clearSingleItemMutation.reset()
  //    refetchSelected()
  //    refetchAll()
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  ////////////////////////////////////////////
  //// RENUMBER/REORDER mutations
  const renumberAllItemsMutation = () => {
    console.log('renumberAllItemsMutation')
  }
  //const renumberAllItemsMutation = trpc.items.renumberAllItems.useMutation({
  //  onSuccess: () => {
  //    renumberAllItemsMutation.reset()
  //    refetchSelected()
  //    refetchAll()
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  const renumberArtListMutation = (data: any) => {
    console.log('renumberArtListMutation')
  }
  //const renumberArtListMutation = trpc.items.renumberArtList.useMutation({
  //  onSuccess: () => {
  //    renumberArtListMutation.reset()

  //    refetchSelected()
  //    refetchAll()
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  ////////////////////////////////////////////
  //// PASTE/DUPLICATE mutations
  const pasteSingleItemMutation = (data: any) => {
    console.log('pasteSingleItemMutation')
  }
  //const pasteSingleItemMutation = trpc.items.pasteSingleItem.useMutation({
  //  onSuccess: () => {
  //    pasteSingleItemMutation.reset()
  //    refetchAll()
  //    refetchSelected()
  //  },
  //  onError: () => {
  //    alert('There was an error submitting your request. Please try again.')
  //  }
  //})
  //////////////////////////////////////////
  const exportItems = {
    export: exportMutation
  }
  const create = {
    allItemsFromJSON: createAllItemsFromJSONMutation,
    track: createSingleItemMutation,
    fullRange: createSingleFullRangeMutation,
    artListTog: createSingleArtListTogMutation,
    artListTap: createSingleArtListTapMutation,
    artLayer: createSingleArtLayerMutation,
    fadList: createSingleFadListMutation
  }
  const update = {
    track: updateSingleItemMutation,
    fullRange: updateSingleFullRangeMutation,
    artListTog: updateSingleArtListTogMutation,
    artListTap: updateSingleArtListTapMutation,
    artLayer: updateSingleArtLayerMutation,
    fadList: updateSingleFadListMutation
  }
  const del = {
    track: deleteSingleItemMutation,
    allTracks: deleteAllItemsMutation,
    fullRange: deleteSingleFullRangeMutation,
    artListTog: deleteSingleArtListTogMutation,
    artListTap: deleteSingleArtListTapMutation,
    artLayer: deleteSingleArtLayerMutation,
    fadList: deleteSingleFadListMutation
  }
  const clear = {
    track: clearSingleItemMutation
  }
  const renumber = {
    allTracks: renumberAllItemsMutation,
    artList: renumberArtListMutation
  }
  const paste = {
    track: pasteSingleItemMutation
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

  if (!mounted) {
    return null
  }

  return (
    <mutationContext.Provider value={value}>
      {children}
    </mutationContext.Provider>
  )
}

export const useMutations = () => {
  return useContext(mutationContext)
}
