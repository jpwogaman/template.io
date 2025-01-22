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

import { useSelectedItem } from './selectedItemContext'
import {
  commands,
  type Settings,
  type FullTrackWithCounts,
  type FullTrackForExport,
  type FileItemRequest,
  type ItemsFullRangesRequest,
  type ItemsArtListTogRequest,
  type ItemsArtListTapRequest,
  type ItemsArtLayersRequest,
  type ItemsFadListRequest
} from '../backendCommands/backendCommands'

type createSubItemArgs = {
  fileitemsItemId: string
  count: number
}

type deleteSubItemArgs = {
  id: string
  fileitemsItemId: string
}

type pasteItemArgs = {
  destinationItemId: string
  copiedItemId: string
}

interface MutationContextType {
  data: FullTrackWithCounts[] | null
  selectedItem: FullTrackForExport | null
  dataLength: number
  vepSamplerCount: number
  vepInstanceCount: number
  nonVepSamplerCount: number
  refetchAll: () => void
  refetchSelected: () => void
  //////////////////////////////////////////
  create: {
    track: (count: number) => void
    fullRange: (data: createSubItemArgs) => void
    artListTog: (data: createSubItemArgs) => void
    artListTap: (data: createSubItemArgs) => void
    artLayer: (data: createSubItemArgs) => void
    fadList: (data: createSubItemArgs) => void
  }
  update: {
    track: (data: FileItemRequest) => void
    fullRange: (data: ItemsFullRangesRequest) => void
    artListTog: (data: ItemsArtListTogRequest) => void
    artListTap: (data: ItemsArtListTapRequest) => void
    artLayer: (data: ItemsArtLayersRequest) => void
    fadList: (data: ItemsFadListRequest) => void
  }
  del: {
    track: (id: string) => void
    fullRange: (data: deleteSubItemArgs) => void
    artListTog: (data: deleteSubItemArgs) => void
    artListTap: (data: deleteSubItemArgs) => void
    artLayer: (data: deleteSubItemArgs) => void
    fadList: (data: deleteSubItemArgs) => void
  }
  clear: {
    track: (id: string) => void
  }
  renumber: {
    allTracks: () => void
  }
  paste: {
    track: (data: pasteItemArgs) => void
  }
  settings: {
    get: () => Promise<Settings> | void
    set: ({
      key,
      value
    }: {
      key: keyof Settings
      value: Settings[keyof Settings]
    }) => void
  }
}

const mutationContextDefaultValues: MutationContextType = {
  data: null,
  selectedItem: null,
  dataLength: 0,
  vepSamplerCount: 0,
  vepInstanceCount: 0,
  nonVepSamplerCount: 0,
  /* eslint-disable @typescript-eslint/no-empty-function */
  refetchAll: () => {},
  refetchSelected: () => {},
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
    allTracks: () => {}
  },
  paste: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    track: () => {}
  },
  settings: {
    /* eslint-disable @typescript-eslint/no-empty-function */
    get: () => {},
    set: () => {}
  }
}

export const mutationContext = createContext<MutationContextType>(
  mutationContextDefaultValues
)

interface MutationProviderProps {
  children: ReactNode
}

export const MutationProvider: FC<MutationProviderProps> = ({ children }) => {
  const {
    selectedItemId,
    previousItemId,
    setSelectedItemId,
    setNextItemId,
    setPreviousItemId,
    setSelectedItemRangeCount,
    setSelectedItemArtTogCount,
    setSelectedItemArtTapCount,
    setSelectedItemArtCount,
    setSelectedItemLayerCount,
    setSelectedItemFadCount
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
  const getData = useCallback(async () => {
    try {
      const data = await commands.listAllFileitemsAndRelationCounts()
      setData(data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }, [])

  const getSelectedItem = useCallback(async () => {
    if (!selectedItemId) return
    try {
      const data = await commands.getFileitemAndRelations(selectedItemId)
      setSelectedItem(data)
    } catch (error) {
      console.error('Error fetching selected item:', error)
    }
  }, [selectedItemId])

  const refetchAll = useCallback(() => {
    void getData()
  }, [getData])

  const refetchSelected = useCallback(() => {
    void getSelectedItem()
  }, [getSelectedItem])

  //////////////////////////////////////////

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSettings = useCallback(async () => {
    const settings = await commands.getSettings()
    return settings
  }, [])

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateSettings = useCallback(
    async ({
      key,
      value
    }: {
      key: keyof Settings
      value: Settings[keyof Settings]
    }) => {
      const settings = await commands.getSettings()
      void commands.setSettings({ ...settings, [key]: value })
    },
    []
  )

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
  //const instanceArraysObject: {
  //  [key: string]: string[]
  //} = {}

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
  //const eachInstanceArraySet: {
  //  [key: string]: Set<string>
  //} = {}

  for (const [key, value] of Object.entries(instanceArraysObject)) {
    eachInstanceArraySet[key] = new Set(value)
  }

  const eachInstanceArraySetArray: Record<string, Array<string>> = {}
  //const eachInstanceArraySetArray: {
  //  [key: string]: string[]
  //} = {}

  for (const [key, value] of Object.entries(eachInstanceArraySet)) {
    eachInstanceArraySetArray[key] = Array.from(value)
  }

  const eachInstanceArraySetArrayLength: Record<string, number> = {}
  //const eachInstanceArraySetArrayLength: {
  //  [key: string]: number
  //} = {}

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
  // logic to find previous and next item ids, as well as set some other counts
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

    refetchSelected()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [selectedItemId, data])
  //////////////////////////////////////////
  // CREATE mutations
  const createSingleItemMutation = useCallback(
    async (count: number) => {
      await commands
        .createFileitem(count)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('createFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const createSingleFullRangeMutation = useCallback(
    async ({ fileitemsItemId, count }: createSubItemArgs) => {
      await commands
        .createFullRange(fileitemsItemId, count)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('createFullRange error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const createSingleArtListTogMutation = useCallback(
    async ({ fileitemsItemId, count }: createSubItemArgs) => {
      await commands
        .createArtTog(fileitemsItemId, count)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('createArtTog error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const createSingleArtListTapMutation = useCallback(
    async ({ fileitemsItemId, count }: createSubItemArgs) => {
      await commands
        .createArtTap(fileitemsItemId, count)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('createArtTap error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const createSingleArtLayerMutation = useCallback(
    async ({ fileitemsItemId, count }: createSubItemArgs) => {
      await commands
        .createArtLayer(fileitemsItemId, count)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('createArtLayer error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const createSingleFadListMutation = useCallback(
    async ({ fileitemsItemId, count }: createSubItemArgs) => {
      await commands
        .createFad(fileitemsItemId, count)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('createFad error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  ////////////////////////////////////////////
  //// UPDATE mutations
  const updateSingleItemMutation = useCallback(
    async (data: FileItemRequest) => {
      await commands
        .updateFileitem(data)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('updateFileItem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const updateSingleFullRangeMutation = useCallback(
    async (data: ItemsFullRangesRequest) => {
      await commands
        .updateFullRange(data)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('updateFullRange error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const updateSingleArtListTogMutation = useCallback(
    async (data: ItemsArtListTogRequest) => {
      await commands
        .updateArtTog(data)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('updateArtTog error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const updateSingleArtListTapMutation = useCallback(
    async (data: ItemsArtListTapRequest) => {
      await commands
        .updateArtTap(data)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('updateArtTap error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const updateSingleArtLayerMutation = useCallback(
    async (data: ItemsArtLayersRequest) => {
      await commands
        .updateArtLayer(data)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('updateArtLayer error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const updateSingleFadListMutation = useCallback(
    async (data: ItemsFadListRequest) => {
      await commands
        .updateFad(data)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('updateFad error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  ////////////////////////////////////////////
  //// DELETE mutations
  const deleteSingleItemMutation = useCallback(
    async (id: string) => {
      await commands
        .deleteFileitemAndRelations(id)
        .then(() => {
          refetchAll()
          if (!previousItemId) return
          setSelectedItemId(previousItemId)
        })
        .catch((error) => {
          console.log('deleteFileitemAndRelations error', error)
        })
    },
    [refetchAll, setSelectedItemId, previousItemId]
  )
  const deleteSingleFullRangeMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      await commands
        .deleteFullRangeByFileitem(id, fileitemsItemId)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('deleteFullRangeByFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const deleteSingleArtListTogMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      await commands
        .deleteArtTogByFileitem(id, fileitemsItemId)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('deleteArtTogByFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const deleteSingleArtListTapMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      await commands
        .deleteArtTapByFileitem(id, fileitemsItemId)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('deleteArtTogByFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const deleteSingleArtLayerMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      await commands
        .deleteArtLayerByFileitem(id, fileitemsItemId)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('deleteArtLayerByFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  const deleteSingleFadListMutation = useCallback(
    async ({ id, fileitemsItemId }: deleteSubItemArgs) => {
      await commands
        .deleteFadByFileitem(id, fileitemsItemId)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('deleteFadByFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  ////////////////////////////////////////////
  //// CLEAR mutations
  const clearSingleItemMutation = useCallback(
    async (id: string) => {
      await commands
        .clearFileitem(id)
        .then(() => {
          refetchAll()
          refetchSelected()
        })
        .catch((error) => {
          console.log('clearFileitem error', error)
        })
    },
    [refetchAll, refetchSelected]
  )
  ////////////////////////////////////////////
  //// RENUMBER/REORDER mutations
  const renumberAllItemsMutation = useCallback(async () => {
    await commands
      .renumberAllFileitems()
      .then(() => {
        refetchAll()
        refetchSelected()
      })
      .catch((error) => {
        console.log('renumberAllItemsMutation error', error)
      })
  }, [refetchAll, refetchSelected])
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

  const settings = useMemo(
    () => ({
      get: getSettings,
      set: updateSettings
    }),
    [getSettings, updateSettings]
  )

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
      /////////////////////////////////
      create,
      update,
      del,
      clear,
      renumber,
      paste,
      settings
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
      /////////////////////////////////
      create,
      update,
      del,
      clear,
      renumber,
      paste,
      settings
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
