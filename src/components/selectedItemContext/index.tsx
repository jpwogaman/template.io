'use client'

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
  type FC,
  type SetStateAction,
  type Dispatch,
  useEffect,
  useState
} from 'react'

interface SelectedItemContextType {
   selectedItemId: string | null
    selectedSubItemId: string | null
    copiedItemId: string | null
    copiedSubItemId: string | null
    setSelectedItemId: Dispatch<SetStateAction<string | null>>
    setSelectedSubItemId: Dispatch<SetStateAction<string | null>>
    setCopiedItemId: Dispatch<SetStateAction<string | null>>
    setCopiedSubItemId: Dispatch<SetStateAction<string | null>>
}

const selectedItemContextDefaultValues: SelectedItemContextType = {
  selectedItemId: 'T_0',
  selectedSubItemId: 'T_0_notes',
  copiedItemId: null,
  copiedSubItemId: null,
  /* eslint-disable @typescript-eslint/no-empty-function */
  setSelectedItemId: () => {},
  setSelectedSubItemId: () => {},
  setCopiedItemId: () => {},
  setCopiedSubItemId: () => {},  
}

export const SelectedItemContext = createContext<SelectedItemContextType>(
  selectedItemContextDefaultValues
)

interface SelectedItemProviderProps {
  children: ReactNode
}

export const SelectedItemProvider: FC<SelectedItemProviderProps> = ({
  children,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>('T_0')
  const [selectedSubItemId, setSelectedSubItemId] = useState<null | string>(
    'T_0_notes'
  )
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  const [copiedSubItemId, setCopiedSubItemId] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      selectedItemId,
      selectedSubItemId,
      copiedItemId,
      copiedSubItemId,
      setSelectedItemId,
      setSelectedSubItemId,
      setCopiedItemId,
      setCopiedSubItemId
    }),
    [
      selectedItemId,
      selectedSubItemId,
      copiedItemId,
      copiedSubItemId,
      setSelectedItemId,
      setSelectedSubItemId,
      setCopiedItemId,
      setCopiedSubItemId      
    ]
  )

  return <SelectedItemContext.Provider value={value}>{children}</SelectedItemContext.Provider>
}

export const useSelectedItem = () => {
  return useContext(SelectedItemContext)
}
