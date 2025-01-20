'use client'

import {
  createContext,
  useContext,
  type ReactNode,
  type FC,
  useEffect,
  useState
} from 'react'

import { listen } from '@tauri-apps/api/event'
import { useModal } from '@/components/context'

interface TauriListenersContextType {}

const tauriListenersContextDefaultValues: TauriListenersContextType = {}

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
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  listen('refresh', () => {
    location.reload()
  }).catch((e) => console.error(e))

  listen('about', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalType('about')
    }
  }).catch((e) => console.error(e))
  listen('settings', () => {
    if (modalOpen) {
      close()
    } else {
      open()
      setModalType('settings')
    }
  }).catch((e) => console.error(e))

  return (
    <TauriListenersContext.Provider value>
      {children}
    </TauriListenersContext.Provider>
  )
}

export const useTauriListeners = () => {
  return useContext(TauriListenersContext)
}
