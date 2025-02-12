'use client'

import {
  type ReactNode,
  type FC,
  type SetStateAction,
  type Dispatch,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react'

import {
  type Settings,
  commands
} from '@/components/backendCommands/backendCommands'

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
  setCopiedItemId: Dispatch<SetStateAction<FileItemId | null>>
  setCopiedSubItemId: Dispatch<SetStateAction<SubItemId | null>>
  setSelectedItemRangeCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtTogCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtTapCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtCount: Dispatch<SetStateAction<number>>
  setSelectedItemLayerCount: Dispatch<SetStateAction<number>>
  setSelectedItemFadCount: Dispatch<SetStateAction<number>>
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
  setCopiedItemId: () => undefined,
  setCopiedSubItemId: () => undefined,
  setSelectedItemRangeCount: () => undefined,
  setSelectedItemArtTogCount: () => undefined,
  setSelectedItemArtTapCount: () => undefined,
  setSelectedItemArtCount: () => undefined,
  setSelectedItemLayerCount: () => undefined,
  setSelectedItemFadCount: () => undefined,
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
    next_item_id: null,
    track_options_layouts: {
      full_ranges: 'table',
      art_list_tap: 'table',
      art_list_tog: 'table',
      art_layers: 'table',
      fad_list: 'table'
    },
    default_colors: [
      '#F0D340',
      '#58FA3D',
      '#cd9323',
      '#9a2151',
      '#c034b5',
      '#224596',
      '#37bdb4'
    ]
  },
  updateSettings: async () => undefined
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

  const [settings, setSettings] = useState<Settings>(
    selectedItemContextDefaultValues.settings
  )

  const normalizeHex = (color: string): string | null => {
    const regex = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/
    const match = regex.exec(color)

    if (!match) return null

    let hex = match[1]?.toLowerCase()

    if (hex?.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    }

    return hex ? `#${hex}` : null
  }

  const updateSettings = useCallback(
    async ({ key, value }: updateSettings) => {
      setSettings((prevSettings) => {
        let updatedValue = value

        if (key === 'default_colors' && Array.isArray(value)) {
          const normalizedColors = new Set(
            value
              .map((color) => normalizeHex(color))
              .filter(Boolean) as string[]
          )
          updatedValue = Array.from(normalizedColors)
        }

        const updatedSettings = { ...prevSettings, [key]: updatedValue }
        void commands.setSettings(updatedSettings)
        return updatedSettings
      })
    },
    [setSettings]
  )

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await commands.getSettings()
        const settingsKeys = Object.keys(
          selectedItemContextDefaultValues.settings
        ) as (keyof Settings)[]

        settingsKeys.forEach((key) => {
          void updateSettings({
            key,
            value: data[key]
          })
        })
      } catch (error) {
        console.error(error)
      }
    }

    void fetchSettings()
  }, [updateSettings])

  const value = useMemo(
    () => ({
      copiedItemId,
      copiedSubItemId,
      selectedItemRangeCount,
      selectedItemArtTogCount,
      selectedItemArtTapCount,
      selectedItemArtCount,
      selectedItemLayerCount,
      selectedItemFadCount,
      setSelectedItemRangeCount,
      setSelectedItemArtTogCount,
      setSelectedItemArtTapCount,
      setSelectedItemArtCount,
      setSelectedItemLayerCount,
      setSelectedItemFadCount,
      setCopiedItemId,
      setCopiedSubItemId,
      settings,
      updateSettings
    }),
    [
      copiedItemId,
      copiedSubItemId,
      selectedItemRangeCount,
      selectedItemArtTogCount,
      selectedItemArtTapCount,
      selectedItemArtCount,
      selectedItemLayerCount,
      selectedItemFadCount,
      setSelectedItemRangeCount,
      setSelectedItemArtTogCount,
      setSelectedItemArtTapCount,
      setSelectedItemArtCount,
      setSelectedItemLayerCount,
      setSelectedItemFadCount,
      setCopiedItemId,
      setCopiedSubItemId,
      settings,
      updateSettings
    ]
  )

  return (
    <SelectedItemContext.Provider value={value}>
      {children}
    </SelectedItemContext.Provider>
  )
}

export const useSelectedItem = () => {
  return useContext(SelectedItemContext)
}
