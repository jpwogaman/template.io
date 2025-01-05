'use client'

import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  type ReactNode,
  type FC,
  type SetStateAction,
  type Dispatch,
  useState
} from 'react'

interface SelectedItemContextType {
  selectedItemId: string
  selectedSubItemId: string
  copiedItemId: string | null
  copiedSubItemId: string | null
  nextItemId: string | null
  previousItemId: string | null
  selectedItemRangeCount: number
  selectedItemArtTogCount: number
  selectedItemArtTapCount: number
  selectedItemArtCount: number
  selectedItemLayerCount: number
  selectedItemFadCount: number
  setSelectedItemId: Dispatch<SetStateAction<string>>
  setSelectedSubItemId: Dispatch<SetStateAction<string>>
  setNextItemId: Dispatch<SetStateAction<string | null>>
  setPreviousItemId: Dispatch<SetStateAction<string | null>>
  setSelectedItemRangeCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtTogCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtTapCount: Dispatch<SetStateAction<number>>
  setSelectedItemArtCount: Dispatch<SetStateAction<number>>
  setSelectedItemLayerCount: Dispatch<SetStateAction<number>>
  setSelectedItemFadCount: Dispatch<SetStateAction<number>>
  setCopiedItemId: Dispatch<SetStateAction<string | null>>
  setCopiedSubItemId: Dispatch<SetStateAction<string | null>>
}

const selectedItemContextDefaultValues: SelectedItemContextType = {
  selectedItemId: 'T_0',
  selectedSubItemId: 'T_0_notes',
  nextItemId: 'T_1',
  previousItemId: null,
  copiedItemId: null,
  copiedSubItemId: null,
  selectedItemRangeCount: 0,
  selectedItemArtTogCount: 0,
  selectedItemArtTapCount: 0,
  selectedItemArtCount: 0,
  selectedItemLayerCount: 0,
  selectedItemFadCount: 0,
  /* eslint-disable @typescript-eslint/no-empty-function */
  setSelectedItemId: () => {},
  setSelectedSubItemId: () => {},
  setNextItemId: () => {},
  setPreviousItemId: () => {},
  setSelectedItemRangeCount: () => {},
  setSelectedItemArtTogCount: () => {},
  setSelectedItemArtTapCount: () => {},
  setSelectedItemArtCount: () => {},
  setSelectedItemLayerCount: () => {},
  setSelectedItemFadCount: () => {},
  setCopiedItemId: () => {},
  setCopiedSubItemId: () => {}
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
  const [selectedItemId, setSelectedItemId] = useState('T_12')
  const [selectedSubItemId, setSelectedSubItemId] = useState('T_12_notes')
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  const [copiedSubItemId, setCopiedSubItemId] = useState<string | null>(null)

  const [previousItemId, setPreviousItemId] = useState<string | null>('T_11')
  const [nextItemId, setNextItemId] = useState<string | null>('T_13')

  const [selectedItemRangeCount, setSelectedItemRangeCount] = useState(0)
  const [selectedItemArtTogCount, setSelectedItemArtTogCount] = useState(0)
  const [selectedItemArtTapCount, setSelectedItemArtTapCount] = useState(0)
  const [selectedItemArtCount, setSelectedItemArtCount] = useState(0)
  const [selectedItemLayerCount, setSelectedItemLayerCount] = useState(0)
  const [selectedItemFadCount, setSelectedItemFadCount] = useState(0)

  const value = useMemo(
    () => ({
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
    }),
    [
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
