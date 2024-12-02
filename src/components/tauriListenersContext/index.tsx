'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
  type FC,
  useEffect,
  useState
} from 'react'

import { listen } from '@tauri-apps/api/event'
import { importJSON } from '@/components/tauriListenersContext/importJSON'
import { useModal } from '@/components/modal/modalContext'
import { useSelectedItem } from '../selectedItemContext'
import useMutations from '@/hooks/useMutations'

interface TauriListenersContextType {
  exportItems: {
    export: () => void
  }
  create: {
    allItemsFromJSON: (data: string) => void
  }
  del: {
    allTracks: () => void
  }
}

const tauriListenersContextDefaultValues: TauriListenersContextType = {
  exportItems: {
    export: () => {}
  },
  create: {
    allItemsFromJSON: () => {}
  },
  del: {
    allTracks: () => {}
  }
}

export const TauriListenersContext = createContext<TauriListenersContextType>(
  tauriListenersContextDefaultValues
)

interface TauriListenersProviderProps {
  children: ReactNode
}

export const TauriListenersProvider: FC<TauriListenersProviderProps> = ({
  children
}) => {
  const [mounted, setMounted] = useState(false)
  const { modalOpen, close, open, setModalType } = useModal()
  const { selectedItemId, setSelectedItemId } = useSelectedItem()
  const { exportItems, create, del } = useMutations({
    selectedItemId,
    setSelectedItemId
  })

  listen('export', () => {
    exportItems.export()
  })
  listen('import', () => {
    importJSON().then((data) => {
      create.allItemsFromJSON(data ?? '')
    })
  })
  listen('delete_all', () => {
    del.allTracks()
  })
  listen('about', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalType('about')
    }
  })
  listen('settings', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalType('settings')
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const value = useMemo(
    () => ({
      exportItems,
      create,
      del
    }),
    [exportItems, create, del]
  )

  if (!mounted) {
    return null
  }

  return (
    <TauriListenersContext.Provider value={value}>
      {children}
    </TauriListenersContext.Provider>
  )
}

export const useTauriListeners = () => {
  return useContext(TauriListenersContext)
}
