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
import { useModal, useMutations } from '@/components/context'

interface TauriListenersContextType {
  del: {
    allTracks: () => void
  }
}

const tauriListenersContextDefaultValues: TauriListenersContextType = {
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
  const { del } = useMutations()
  useEffect(() => {
    setMounted(true)
  }, [])

  const value = useMemo(
    () => ({
      del
    }),
    [del]
  )
  if (!mounted) {
    return null
  }

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

  return (
    <TauriListenersContext.Provider value={value}>
      {children}
    </TauriListenersContext.Provider>
  )
}

export const useTauriListeners = () => {
  return useContext(TauriListenersContext)
}
