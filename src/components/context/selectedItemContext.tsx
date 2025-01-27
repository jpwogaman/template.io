'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type FC,
  type SetStateAction,
  type Dispatch,
  useState,
  useCallback,
  useEffect
} from 'react'
import { type Settings, commands } from '../backendCommands/backendCommands'

export type FileItemId = `T_${number}`
export type SubItemId =
  | `T_${number}_${'FR' | 'AT' | 'AL' | 'FL'}_${number}`
  | `T_${number}_notes`

type updateSettings = {
  key: keyof Settings
  value: Settings[keyof Settings]
}

interface SelectedItemContextType {
  copiedItemId: FileItemId | null
  copiedSubItemId: SubItemId | null

  selectedItemRangeCount: number
  selectedItemArtTogCount: number
  selectedItemArtTapCount: number
  selectedItemArtCount: number
  selectedItemLayerCount: number
  selectedItemFadCount: number

  setSelectedItemRangeCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtTogCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtTapCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtCount: Dispatch<SetStateAction<number>>
  setSelectedItemLayerCount: Dispatch<SetStateAction<number>>
  setSelectedItemFadCount: Dispatch<SetStateAction<number>>
  setCopiedItemId: Dispatch<SetStateAction<FileItemId | null>>
  setCopiedSubItemId: Dispatch<SetStateAction<SubItemId | null>>
  settings: Settings
  updateSettings: ({ key, value }: updateSettings) => Promise<void>
}

const selectedItemContextDefaultValues: SelectedItemContextType = {
  copiedItemId: null,
  copiedSubItemId: null,
  selectedItemRangeCount: 0,
  selectedItemArtTogCount: 0,
  selectedItemArtTapCount: 0,
  selectedItemArtCount: 0,
  selectedItemLayerCount: 0,
  selectedItemFadCount: 0,
  /* eslint-disable @typescript-eslint/no-empty-function */

  setSelectedItemRangeCount: () => {},
  setSelectedItemArtTogCount: () => {},
  setSelectedItemArtTapCount: () => {},
  setSelectedItemArtCount: () => {},
  setSelectedItemLayerCount: () => {},
  setSelectedItemFadCount: () => {},
  setCopiedItemId: () => {},
  setCopiedSubItemId: () => {},
  settings: {
    vep_out_settings: 128,
    smp_out_settings: 32,
    default_range_count: 1,
    default_art_tog_count: 2,
    default_art_tap_count: 4,
    default_art_layer_count: 1,
    default_fad_count: 4,
    track_add_count: 1,
    sub_item_add_count: 1,
    selected_item_id: 'T_0',
    selected_sub_item_id: 'T_0_notes',
    previous_item_id: null,
    next_item_id: null
  },
  /* eslint-disable @typescript-eslint/no-empty-function */
  updateSettings: async () => {}
}

export const SelectedItemContext = createContext<SelectedItemContextType>(
  selectedItemContextDefaultValues
)

interface SelectedItemProviderProps {
  children: ReactNode
}

export const SelectedItemProvider: FC<SelectedItemProviderProps> = ({
  children
}) => {
  const [copiedItemId, setCopiedItemId] = useState<FileItemId | null>(null)
  const [copiedSubItemId, setCopiedSubItemId] = useState<SubItemId | null>(null)

  const [selectedItemRangeCount, setSelectedItemRangeCount] = useState(0)
  const [selectedItemArtTogCount, setSelectedItemArtTogCount] = useState(0)
  const [selectedItemArtTapCount, setSelectedItemArtTapCount] = useState(0)
  const [selectedItemArtCount, setSelectedItemArtCount] = useState(0)
  const [selectedItemLayerCount, setSelectedItemLayerCount] = useState(0)
  const [selectedItemFadCount, setSelectedItemFadCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const [settings, setSettings] = useState<Settings>({
    vep_out_settings: 128,
    smp_out_settings: 32,
    default_range_count: 1,
    default_art_tog_count: 2,
    default_art_tap_count: 4,
    default_art_layer_count: 1,
    default_fad_count: 4,
    track_add_count: 1,
    sub_item_add_count: 1,
    selected_item_id: 'T_0',
    selected_sub_item_id: 'T_0_notes',
    previous_item_id: null,
    next_item_id: null
  })

  const updateSettings = useCallback(
    async ({ key, value }: updateSettings) => {
      setSettings((prevSettings) => {
        const updatedSettings = { ...prevSettings, [key]: value }
        void commands.setSettings(updatedSettings)
        return updatedSettings
      })
    },
    [commands, setSettings]
  )

  const getSettings = useCallback(
    async () =>
      await commands.getSettings().then((data: Settings) => {
        updateSettings({
          key: 'vep_out_settings',
          value: data.vep_out_settings
        })
        updateSettings({
          key: 'smp_out_settings',
          value: data.smp_out_settings
        })
        updateSettings({
          key: 'default_range_count',
          value: data.default_range_count
        })
        updateSettings({
          key: 'default_art_tog_count',
          value: data.default_art_tog_count
        })
        updateSettings({
          key: 'default_art_tap_count',
          value: data.default_art_tap_count
        })
        updateSettings({
          key: 'default_fad_count',
          value: data.default_fad_count
        })
        updateSettings({
          key: 'track_add_count',
          value: data.track_add_count
        })
        updateSettings({
          key: 'sub_item_add_count',
          value: data.sub_item_add_count
        })
        updateSettings({
          key: 'selected_item_id',
          value: data.selected_item_id
        })
        updateSettings({
          key: 'selected_sub_item_id',
          value: data.selected_sub_item_id
        })
        updateSettings({
          key: 'previous_item_id',
          value: data.previous_item_id
        })
        updateSettings({
          key: 'next_item_id',
          value: data.next_item_id
        })
      }),
    []
  )

  useEffect(() => {
    setMounted(true)
    getSettings().catch((e) => console.error(e))
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const value = useMemo(
    () => ({
      selectedItemRangeCount,
      selectedItemArtTogCount,
      selectedItemArtTapCount,
      selectedItemArtCount,
      selectedItemLayerCount,
      selectedItemFadCount,
      copiedItemId,
      copiedSubItemId,
      setSelectedItemRangeCount,
      setSelectedItemArtTogCount,
      setSelectedItemArtTapCount,
      setSelectedItemArtCount,
      setSelectedItemLayerCount,
      setSelectedItemFadCount,
      setCopiedItemId,
      setCopiedSubItemId,
      /////
      settings,
      updateSettings
    }),
    [
      selectedItemRangeCount,
      selectedItemArtTogCount,
      selectedItemArtTapCount,
      selectedItemArtCount,
      selectedItemLayerCount,
      selectedItemFadCount,
      copiedItemId,
      copiedSubItemId,
      setSelectedItemRangeCount,
      setSelectedItemArtTogCount,
      setSelectedItemArtTapCount,
      setSelectedItemArtCount,
      setSelectedItemLayerCount,
      setSelectedItemFadCount,
      setCopiedItemId,
      setCopiedSubItemId,
      /////
      settings,
      updateSettings
    ]
  )

  if (!mounted) {
    return null
  }

  return (
    <SelectedItemContext.Provider value={value}>
      {children}
    </SelectedItemContext.Provider>
  )
}

export const useSelectedItem = () => {
  return useContext(SelectedItemContext)
}
