'use client'

import {
  type ReactNode,
  type FC,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react'

import {
  useSelectedItem,
  type FileItemId,
  type SubItemId
} from './selectedItemContext'
import {
  commands,
  type FullTrackWithCounts,
  type FullTrackForExport,
  type FileItemRequest,
  type ItemsFullRangesRequest,
  type ItemsArtListTogRequest,
  type ItemsArtListTapRequest,
  type ItemsArtLayersRequest,
  type ItemsFadListRequest
} from '@/components/backendCommands/backendCommands'

type createSubItemArgs = {
  fileitemsItemId: FileItemId
}

type deleteSubItemArgs = {
  id: SubItemId
  fileitemsItemId: FileItemId
}

type pasteItemArgs = {
  destinationItemId: FileItemId | SubItemId
  copiedItemId: FileItemId | SubItemId
}

interface MutationContextType {
  data: FullTrackWithCounts[] | null
  selectedItem: FullTrackForExport | null
  previousItemLocked: boolean
  nextItemLocked: boolean
  dataLength: number
  vepSamplerCount: number
  vepInstanceCount: number
  nonVepSamplerCount: number
  getData: () => void
  getSelectedItem: () => void
  //////////////////////////////////////////
  create: {
    track: () => void
    fullRange: (data: createSubItemArgs) => void
    artListTog: (data: createSubItemArgs) => void
    artListTap: (data: createSubItemArgs) => void
    artLayer: (data: createSubItemArgs) => void
    fadList: (data: createSubItemArgs) => void
  }
  update: {
    track: (data: FileItemRequest, refetch: boolean) => void
    fullRange: (data: ItemsFullRangesRequest, refetch: boolean) => void
    artListTog: (data: ItemsArtListTogRequest, refetch: boolean) => void
    artListTap: (data: ItemsArtListTapRequest, refetch: boolean) => void
    artLayer: (data: ItemsArtLayersRequest, refetch: boolean) => void
    fadList: (data: ItemsFadListRequest, refetch: boolean) => void
  }
  del: {
    track: (id: FileItemId) => void
    fullRange: (data: deleteSubItemArgs) => void
    artListTog: (data: deleteSubItemArgs) => void
    artListTap: (data: deleteSubItemArgs) => void
    artLayer: (data: deleteSubItemArgs) => void
    fadList: (data: deleteSubItemArgs) => void
  }
  clear: {
    track: (id: FileItemId) => void
  }
  renumber: {
    allTracks: () => void
  }
  paste: {
    track: (data: pasteItemArgs) => void
  }
}

const mutationContextDefaultValues: MutationContextType = {
  data: null,
  selectedItem: null,
  previousItemLocked: false,
  nextItemLocked: false,
  dataLength: 0,
  vepSamplerCount: 0,
  vepInstanceCount: 0,
  nonVepSamplerCount: 0,
  getData: () => undefined,
  getSelectedItem: () => undefined,
  //////////////////////////////////////////
  create: {
    track: () => undefined,
    fullRange: () => undefined,
    artListTog: () => undefined,
    artListTap: () => undefined,
    artLayer: () => undefined,
    fadList: () => undefined
  },
  update: {
    track: () => undefined,
    fullRange: () => undefined,
    artListTog: () => undefined,
    artListTap: () => undefined,
    artLayer: () => undefined,
    fadList: () => undefined
  },
  del: {
    track: () => undefined,
    fullRange: () => undefined,
    artListTog: () => undefined,
    artListTap: () => undefined,
    artLayer: () => undefined,
    fadList: () => undefined
  },
  clear: {
    track: () => undefined
  },
  renumber: {
    allTracks: () => undefined
  },
  paste: {
    track: () => undefined
  }
}

export const mutationContext = createContext<MutationContextType>(
  mutationContextDefaultValues
)

interface MutationProviderProps {
  children: ReactNode
}

export const MutationProvider: FC<MutationProviderProps> = ({ children }) => {
  const { setSelectedItemSubItemCounts, settings, updateSettings } =
    useSelectedItem()

  const { selected_item_id, previous_item_id } = settings

  const [data, setData] = useState<FullTrackWithCounts[] | null>(null)
  const [selectedItem, setSelectedItem] = useState<FullTrackForExport | null>(
    null
  )
  const [previousItemLocked, setPreviousItemLocked] = useState(false)
  const [nextItemLocked, setNextItemLocked] = useState(false)
  // Initial queries
  const getData = useCallback(async () => {
    try {
      const data = await commands.listAllFileitemsAndRelationCounts()
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [setData])

  const getSelectedItem = useCallback(async () => {
    if (!selected_item_id) return
    try {
      const data = await commands.getFileitemAndRelations(selected_item_id)
      setSelectedItem(data)
    } catch (error) {
      console.error('Error fetching selected item:', error)
    }
  }, [selected_item_id, setSelectedItem])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getData()
        await getSelectedItem()
      } catch (error) {
        console.error('Error during data fetching:', error)
      }
    }
    void fetchData()
  }, [getData, getSelectedItem])

  useEffect(() => {
    if (!data || !selected_item_id) return

    const index = data.findIndex((item) => item.id === selected_item_id)
    if (index === -1) return

    const currentItem = data[index]

    void updateSettings({
      key: 'previous_item_id',
      value: data[index - 1]?.id ?? null
    })
    void updateSettings({
      key: 'next_item_id',
      value: data[index + 1]?.id ?? null
    })

    const previousItemLocked = data.find(
      (item) => item.id === data[index - 1]?.id
    )?.locked
    const nextItemLocked = data.find(
      (item) => item.id === data[index + 1]?.id
    )?.locked

    setPreviousItemLocked(previousItemLocked ?? false)
    setNextItemLocked(nextItemLocked ?? false)

    setSelectedItemSubItemCounts({
      full_ranges: currentItem?._count?.full_ranges ?? 0,
      art_list_tap: currentItem?._count?.art_list_tog ?? 0,
      art_list_tog: currentItem?._count?.art_list_tap ?? 0,
      art_list_both:
        (currentItem?._count?.art_list_tog ?? 0) +
        (currentItem?._count?.art_list_tap ?? 0),
      fad_list: currentItem?._count?.fad_list ?? 0,
      art_layers: currentItem?._count?.art_layers ?? 0
    })
  }, [
    data,
    selected_item_id,
    updateSettings,
    setSelectedItemSubItemCounts,
    setPreviousItemLocked,
    setNextItemLocked
  ])

  //////////////////////////////////////////
  // logic to count vep samplers and instances
  const dataLength = data?.length ?? 0
  let vepSamplerCount = 0
  let nonVepSamplerCount = 0
  let vepInstanceCount = 0

  const vepInstanceArray: string[] = []
  for (const item of data ?? []) {
    vepInstanceArray.push(item.vep_instance)
  }
  const vepInstanceArraySet = new Set(
    vepInstanceArray.filter((item) => item !== '')
  )
  const vepInstanceArraySetArray = Array.from(vepInstanceArraySet)

  vepInstanceCount = vepInstanceArraySetArray.filter(
    (item) => item !== 'N/A'
  ).length

  const instanceArraysObject: Record<string, Array<string>> = {}

  for (const element of vepInstanceArraySetArray) {
    Object.defineProperty(instanceArraysObject, element, {
      value: [],
      writable: true,
      enumerable: true,
      configurable: true
    })
  }

  for (const item of data ?? []) {
    const itemInstance = item.vep_instance
    if (itemInstance === '') continue

    if (itemInstance === 'N/A') {
      if (item.name === '') continue
      if (item.channel !== 1) continue
      nonVepSamplerCount++
      continue
    }

    if (vepInstanceArraySetArray.find((element) => element === itemInstance)) {
      instanceArraysObject[itemInstance]?.push(item.smp_number)
    }
  }

  const eachInstanceArraySet: Record<string, Set<string>> = {}

  for (const [key, value] of Object.entries(instanceArraysObject)) {
    eachInstanceArraySet[key] = new Set(value)
  }

  const eachInstanceArraySetArray: Record<string, Array<string>> = {}

  for (const [key, value] of Object.entries(eachInstanceArraySet)) {
    eachInstanceArraySetArray[key] = Array.from(value)
  }

  const eachInstanceArraySetArrayLength: Record<string, number> = {}

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

  // CREATE mutations
  const createSingleItemMutation = useCallback(async () => {
    await commands
      .createFileitem()
      .then(() => {
        void getData()
        void getSelectedItem()
      })
      .catch((error) => {
        console.log('createFileitem error', error)
      })
  }, [getData, getSelectedItem])
  const createSingleFullRangeMutation = useCallback(
    async ({ fileitemsItemId }: createSubItemArgs) => {
      await commands
        .createFullRange(fileitemsItemId)
        .then(() => {
          void getData()
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('createFullRange error', error)
        })
    },
    [getData, getSelectedItem]
  )
  const createSingleArtListTogMutation = useCallback(
    async ({ fileitemsItemId }: createSubItemArgs) => {
      await commands
        .createArtTog(fileitemsItemId)
        .then(() => {
          void getData()
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('createArtTog error', error)
        })
    },
    [getData, getSelectedItem]
  )
  const createSingleArtListTapMutation = useCallback(
    async ({ fileitemsItemId }: createSubItemArgs) => {
      await commands
        .createArtTap(fileitemsItemId)
        .then(() => {
          void getData()
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('createArtTap error', error)
        })
    },
    [getData, getSelectedItem]
  )
  const createSingleArtLayerMutation = useCallback(
    async ({ fileitemsItemId }: createSubItemArgs) => {
      await commands
        .createArtLayer(fileitemsItemId)
        .then(() => {
          void getData()
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('createArtLayer error', error)
        })
    },
    [getData, getSelectedItem]
  )
  const createSingleFadListMutation = useCallback(
    async ({ fileitemsItemId }: createSubItemArgs) => {
      await commands
        .createFad(fileitemsItemId)
        .then(() => {
          void getData()
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('createFad error', error)
        })
    },
    [getData, getSelectedItem]
  )
  ////////////////////////////////////////////
  //// UPDATE mutations
  const updateSingleItemMutation = useCallback(
    async (data: FileItemRequest, refetch: boolean) => {
      await commands
        .updateFileitem(data)
        .then(() => {
          if (refetch) {
            void getData()
          }
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('updateFileItem error', error)
        })
    },
    [getData, getSelectedItem]
  )
  const updateSingleFullRangeMutation = useCallback(
    async (data: ItemsFullRangesRequest, refetch: boolean) => {
      await commands
        .updateFullRange(data)
        .then(() => {
          if (refetch) {
            void getSelectedItem()
          }
        })
        .catch((error) => {
          console.log('updateFullRange error', error)
        })
    },
    [getSelectedItem]
  )
  const updateSingleArtListTogMutation = useCallback(
    async (data: ItemsArtListTogRequest, refetch: boolean) => {
      await commands
        .updateArtTog(data)
        .then(() => {
          if (refetch) {
            void getSelectedItem()
          }
        })
        .catch((error) => {
          console.log('updateArtTog error', error)
        })
    },
    [getSelectedItem]
  )
  const updateSingleArtListTapMutation = useCallback(
    async (data: ItemsArtListTapRequest, refetch: boolean) => {
      try {
        const result = await commands.updateArtTap(data)

        if (result.status === 'ok') {
          if (refetch) {
            void getSelectedItem()
          }
        } else {
          console.error(`Error updating Tap Articulation: ${result.error}`)
          alert(`Error updating Tap Articulation: ${result.error}`)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`Error: ${errorMessage}`)
        alert(`Error: ${errorMessage}`)
      }
    },
    [getSelectedItem]
  )
  const updateSingleArtLayerMutation = useCallback(
    async (data: ItemsArtLayersRequest, refetch: boolean) => {
      await commands
        .updateArtLayer(data)
        .then(() => {
          if (refetch) {
            void getSelectedItem()
          }
        })
        .catch((error) => {
          console.log('updateArtLayer error', error)
        })
    },
    [getSelectedItem]
  )
  const updateSingleFadListMutation = useCallback(
    async (data: ItemsFadListRequest, refetch: boolean) => {
      await commands
        .updateFad(data)
        .then(() => {
          if (refetch) {
            void getSelectedItem()
          }
        })
        .catch((error) => {
          console.log('updateFad error', error)
        })
    },
    [getSelectedItem]
  )
  ////////////////////////////////////////////
  //// DELETE mutations
  const deleteSingleItemMutation = useCallback(
    async (id: FileItemId) => {
      await commands
        .deleteFileitemAndRelations(id)
        .then(() => {
          void getData()
          if (!previous_item_id) return
          void updateSettings({
            key: 'selected_item_id',
            value: previous_item_id
          })
        })
        .catch((error) => {
          console.log('deleteFileitemAndRelations error', error)
        })
    },
    [getData, updateSettings, previous_item_id]
  )
  const deleteSingleFullRangeMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      try {
        const result = await commands.deleteFullRangeByFileitem(
          id,
          fileitemsItemId
        )

        if (result.status === 'ok') {
          void getData()
          void getSelectedItem()
        } else {
          console.error(`Error deleting Full Range: ${result.error}`)
          alert(`Error deleting Full Range: ${result.error}`)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`Error: ${errorMessage}`)
        alert(`Error: ${errorMessage}`)
      }
    },
    [getData, getSelectedItem]
  )
  const deleteSingleArtListTogMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      try {
        const result = await commands.deleteArtTogByFileitem(
          id,
          fileitemsItemId
        )

        if (result.status === 'ok') {
          void getData()
          void getSelectedItem()
        } else {
          console.error(`Error deleting Toggle Articulation: ${result.error}`)
          alert(`Error deleting Toggle Articulation: ${result.error}`)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`Error: ${errorMessage}`)
        alert(`Error: ${errorMessage}`)
      }
    },
    [getData, getSelectedItem]
  )
  const deleteSingleArtListTapMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      try {
        const result = await commands.deleteArtTapByFileitem(
          id,
          fileitemsItemId
        )

        if (result.status === 'ok') {
          void getData()
          void getSelectedItem()
        } else {
          console.error(`Error deleting Tap Articulation: ${result.error}`)
          alert(`Error deleting Tap Articulation: ${result.error}`)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`Error: ${errorMessage}`)
        alert(`Error: ${errorMessage}`)
      }
    },
    [getData, getSelectedItem]
  )
  const deleteSingleArtLayerMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      try {
        const result = await commands.deleteArtLayerByFileitem(
          id,
          fileitemsItemId
        )

        if (result.status === 'ok') {
          void getData()
          void getSelectedItem()
        } else {
          console.error(`Error deleting Articulation Layer: ${result.error}`)
          alert(`Error deleting Articulation Layer: ${result.error}`)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`Error: ${errorMessage}`)
        alert(`Error: ${errorMessage}`)
      }
    },
    [getData, getSelectedItem]
  )
  const deleteSingleFadListMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      try {
        const result = await commands.deleteFadByFileitem(id, fileitemsItemId)

        if (result.status === 'ok') {
          void getData()
          void getSelectedItem()
        } else {
          console.error(`Error deleting Fader: ${result.error}`)
          alert(`Error deleting Fader: ${result.error}`)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        console.error(`Error: ${errorMessage}`)
        alert(`Error: ${errorMessage}`)
      }
    },
    [getData, getSelectedItem]
  )
  ////////////////////////////////////////////
  //// CLEAR mutations
  const clearSingleItemMutation = useCallback(
    async (id: FileItemId) => {
      await commands
        .clearFileitem(id)
        .then(() => {
          void getData()
          void getSelectedItem()
        })
        .catch((error) => {
          console.log('clearFileitem error', error)
        })
    },
    [getData, getSelectedItem]
  )
  ////////////////////////////////////////////
  //// RENUMBER/REORDER mutations
  const renumberAllItemsMutation = useCallback(async () => {
    await commands
      .renumberAllFileitems()
      .then(() => {
        void getData()
        void getSelectedItem()
      })
      .catch((error) => {
        console.log('renumberAllItemsMutation error', error)
      })
  }, [getData, getSelectedItem])
  ////////////////////////////////////////////
  //// PASTE/DUPLICATE mutations
  const pasteSingleItemMutation = useCallback((data: pasteItemArgs) => {
    console.log('pasteSingleItemMutation', data)
  }, [])
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
      fullRange: deleteSingleFullRangeMutation,
      artListTog: deleteSingleArtListTogMutation,
      artListTap: deleteSingleArtListTapMutation,
      artLayer: deleteSingleArtLayerMutation,
      fadList: deleteSingleFadListMutation
    }),
    [
      deleteSingleItemMutation,
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
      allTracks: renumberAllItemsMutation
    }),
    [renumberAllItemsMutation]
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
      getData,
      getSelectedItem,
      vepSamplerCount,
      vepInstanceCount,
      nonVepSamplerCount,
      /////////////////////////////////
      selectedItem,
      previousItemLocked,
      nextItemLocked,
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
      getData,
      getSelectedItem,
      vepSamplerCount,
      vepInstanceCount,
      nonVepSamplerCount,
      /////////////////////////////////
      selectedItem,
      previousItemLocked,
      nextItemLocked,
      /////////////////////////////////
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
