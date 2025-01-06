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

import { useSelectedItem } from './selectedItemContext'

interface MutationContextType {
  data: FullTrackWithCounts[] | null
  dataLength: number
  //refetchAll: () => void
  //refetchSelected: () => void
  vepSamplerCount: number
  vepInstanceCount: number
  nonVepSamplerCount: number
  //////////////////////////////////////////
  selectedItem: FullTrackForExport | null
  //////////////////////////////////////////
  create: {
    track: ({ count }: { count: number }) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullRange: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artListTog: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artListTap: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artLayer: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fadList: (data: any) => void
  }
  update: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullRange: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artListTog: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artListTap: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artLayer: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fadList: (data: any) => void
  }
  del: {
    track: (data: { itemId: string }) => void
    allTracks: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullRange: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artListTog: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artListTap: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artLayer: (data: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fadList: (data: any) => void
  }
  clear: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track: (data: any) => void
  }
  renumber: {
    allTracks: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    artList: (data: any) => void
  }
  paste: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track: (data: any) => void
  }
}

const mutationContextDefaultValues: MutationContextType = {
  data: null,
  dataLength: 0,
  //refetchAll: () => {},
  //refetchSelected: () => {},
  vepSamplerCount: 0,
  vepInstanceCount: 0,
  nonVepSamplerCount: 0,
  //////////////////////////////////////////
  selectedItem: null,
  //////////////////////////////////////////
  create: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    track: () => {},
    fullRange: () => {},
    artListTog: () => {},
    artListTap: () => {},
    artLayer: () => {},
    fadList: () => {}
  },
  update: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    track: () => {},
    fullRange: () => {},
    artListTog: () => {},
    artListTap: () => {},
    artLayer: () => {},
    fadList: () => {}
  },
  del: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    track: () => {},
    allTracks: () => {},
    fullRange: () => {},
    artListTog: () => {},
    artListTap: () => {},
    artLayer: () => {},
    fadList: () => {}
  },
  clear: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    track: () => {}
  },
  renumber: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    allTracks: () => {},
    artList: () => {}
  },
  paste: {
    /* eslint-disable @typescript-eslint/no-empty-function */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    selectedItemId,
    selectedSubItemId,
    nextItemId,
    previousItemId,
    selectedItemRangeCount,
    selectedItemArtTogCount,
    selectedItemArtTapCount,
    selectedItemArtCount,
    selectedItemLayerCount,
    selectedItemFadCount,
    copiedItemId,
    copiedSubItemId,
    setSelectedItemId,
    setSelectedSubItemId,
    setNextItemId,
    setPreviousItemId,
    setSelectedItemRangeCount,
    setSelectedItemArtTogCount,
    setSelectedItemArtTapCount,
    setSelectedItemArtCount,
    setSelectedItemLayerCount,
    setSelectedItemFadCount,
    setCopiedItemId,
    setCopiedSubItemId
  } = useSelectedItem()
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<FullTrackWithCounts[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<FullTrackForExport | null>(
    null
  )

  useEffect(() => {
    setMounted(true)
    getData().catch((error) => {
      console.log('getData_error', error)
    })
    getSelectedItem().catch((error) => {
      console.log('getSelectedItem_error', error)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //////////////////////////////////////////
  // initial queries
  const getData = useCallback(
    async () =>
      await invoke('list_all_fileitems_and_relation_counts').then((data) => {
        setData(data as FullTrackWithCounts[])
      }),
    []
  )

  //const refetchAll = () => getData()

  const getSelectedItem = useCallback(
    async () =>
      await invoke('get_fileitem_and_relations', { id: selectedItemId }).then(
        (data) => {
          setSelectedItem(data as FullTrackForExport)
        }
      ),
    [selectedItemId]
  )

  //const refetchSelected = () => getSelectedItem()
  //////////////////////////////////////////
  // logic to count vep samplers and instances
  const dataLength = data?.length ?? 0
  const vepSamplerCount = 0
  const nonVepSamplerCount = 0
  const vepInstanceCount = 0

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
  useEffect(() => {
    if (!data) return

    const index =
      data.findIndex(
        (item: FullTrackWithCounts) => item.id === selectedItemId
      ) ?? 0

    setPreviousItemId(data[index - 1]?.id ?? '')
    setNextItemId(data[index + 1]?.id ?? '')

    setSelectedItemRangeCount(data[index]?._count?.full_ranges ?? 0)
    setSelectedItemArtTogCount(data[index]?._count?.art_list_tog ?? 0)
    setSelectedItemArtTapCount(data[index]?._count?.art_list_tap ?? 0)
    setSelectedItemArtCount(
      (data[index]?._count?.art_list_tog ?? 0) +
        (data[index]?._count?.art_list_tap ?? 0)
    )
    setSelectedItemLayerCount(data[index]?._count?.art_layers ?? 0)
    setSelectedItemFadCount(data[index]?._count?.fad_list ?? 0)

    getSelectedItem().catch((error) => {
      console.log('getSelectedItem_error', error)
    })
  }, [selectedItemId, data])

  //////////////////////////////////////////
  // CREATE mutations

  const createSingleItemMutation = useCallback(
    ({ count }: { count: number }) => {
      void invoke('create_fileitem', { count: count })
        .then(() => {
          getData().catch((error) => {
            console.log('getData error', error)
          })
          getSelectedItem().catch((error) => {
            console.log('getSelectedItem error', error)
          })
        })
        .catch((error) => {
          console.log('create_fileitem error', error)
        })
    },
    [getData, getSelectedItem]
  )
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const createSingleFullRangeMutation = useCallback((data: any) => {
    console.log('createSingleFullRangeMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const createSingleArtListTogMutation = useCallback((data: any) => {
    console.log('createSingleArtListTogMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const createSingleArtListTapMutation = useCallback((data: any) => {
    console.log('createSingleArtListTapMutation', data)
  }, [])
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const createSingleArtLayerMutation = useCallback((data: any) => {
    console.log('createSingleArtLayerMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const createSingleFadListMutation = useCallback((data: any) => {
    console.log('createSingleFadListMutation', data)
  }, [])
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

  const updateSingleItemMutation = useCallback((data: Partial<FileItem>) => {
    void invoke('update_fileitem', { data: data })
      .then(() => {})
      .catch((error) => {
        console.log('update_fileitem error', error)
      })
    console.log('updateSingleItemMutation')
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const updateSingleFullRangeMutation = useCallback((data: any) => {
    console.log('updateSingleFullRangeMutation', data)
  }, [])
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const updateSingleArtListTogMutation = useCallback((data: any) => {
    console.log('updateSingleArtListTogMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const updateSingleArtListTapMutation = useCallback((data: any) => {
    console.log('updateSingleArtListTapMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const updateSingleArtLayerMutation = useCallback((data: any) => {
    console.log('updateSingleArtLayerMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const updateSingleFadListMutation = useCallback((data: any) => {
    console.log('updateSingleFadListMutation', data)
  }, [])
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
  const deleteAllItemsMutation = useCallback(() => {
    void invoke('delete_all_fileitems_and_relations')
      .then(() => {})
      .catch((error) => {
        console.log('create_fileitem error', error)
      })
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const deleteSingleItemMutation = useCallback((data: any) => {
    console.log('deleteSingleItemMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const deleteSingleFullRangeMutation = useCallback((data: any) => {
    console.log('deleteSingleFullRangeMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const deleteSingleArtListTogMutation = useCallback((data: any) => {
    console.log('deleteSingleArtListTogMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const deleteSingleArtListTapMutation = useCallback((data: any) => {
    console.log('deleteSingleArtListTapMutation', data)
  }, [])

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const deleteSingleArtLayerMutation = useCallback((data: any) => {
    console.log('deleteSingleArtLayerMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const deleteSingleFadListMutation = useCallback((data: any) => {
    console.log('deleteSingleFadListMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const clearSingleItemMutation = useCallback((data: any) => {
    console.log('clearSingleItemMutation', data)
  }, [])
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
  const renumberAllItemsMutation = useCallback(() => {
    console.log('renumberAllItemsMutation')
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const renumberArtListMutation = useCallback((data: any) => {
    console.log('renumberArtListMutation', data)
  }, [])
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const pasteSingleItemMutation = useCallback((data: any) => {
    console.log('pasteSingleItemMutation', data)
  }, [])
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
  const create = useMemo(
    () => ({
      track: createSingleItemMutation,
      fullRange: createSingleFullRangeMutation,
      artListTog: createSingleArtListTogMutation,
      artListTap: createSingleArtListTapMutation,
      artLayer: createSingleArtLayerMutation,
      fadList: createSingleFadListMutation
    }),
    [
      createSingleItemMutation,
      createSingleFullRangeMutation,
      createSingleArtListTogMutation,
      createSingleArtListTapMutation,
      createSingleArtLayerMutation,
      createSingleFadListMutation
    ]
  )
  const update = useMemo(
    () => ({
      track: updateSingleItemMutation,
      fullRange: updateSingleFullRangeMutation,
      artListTog: updateSingleArtListTogMutation,
      artListTap: updateSingleArtListTapMutation,
      artLayer: updateSingleArtLayerMutation,
      fadList: updateSingleFadListMutation
    }),
    [
      updateSingleItemMutation,
      updateSingleFullRangeMutation,
      updateSingleArtListTogMutation,
      updateSingleArtListTapMutation,
      updateSingleArtLayerMutation,
      updateSingleFadListMutation
    ]
  )

  const del = useMemo(
    () => ({
      track: deleteSingleItemMutation,
      allTracks: deleteAllItemsMutation,
      fullRange: deleteSingleFullRangeMutation,
      artListTog: deleteSingleArtListTogMutation,
      artListTap: deleteSingleArtListTapMutation,
      artLayer: deleteSingleArtLayerMutation,
      fadList: deleteSingleFadListMutation
    }),
    [
      deleteSingleItemMutation,
      deleteAllItemsMutation,
      deleteSingleFullRangeMutation,
      deleteSingleArtListTogMutation,
      deleteSingleArtListTapMutation,
      deleteSingleArtLayerMutation,
      deleteSingleFadListMutation
    ]
  )

  const clear = useMemo(
    () => ({
      track: clearSingleItemMutation
    }),
    [clearSingleItemMutation]
  )

  const renumber = useMemo(
    () => ({
      allTracks: renumberAllItemsMutation,
      artList: renumberArtListMutation
    }),
    [renumberAllItemsMutation, renumberArtListMutation]
  )

  const paste = useMemo(
    () => ({
      track: pasteSingleItemMutation
    }),
    [pasteSingleItemMutation]
  )

  const value = useMemo(
    () => ({
      data,
      dataLength,
      //refetchAll,
      //refetchSelected,
      vepSamplerCount,
      vepInstanceCount,
      nonVepSamplerCount,
      /////////////////////////////////
      selectedItem,
      /////////////////////////////////
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
      //refetchAll,
      //refetchSelected,
      vepSamplerCount,
      vepInstanceCount,
      nonVepSamplerCount,
      /////////////////////////////////
      selectedItem,
      /////////////////////////////////
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
