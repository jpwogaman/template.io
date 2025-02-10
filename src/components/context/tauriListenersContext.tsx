'use client'

import {
  type ReactNode,
  type FC,
  createContext,
  useContext,
  useEffect,
  useMemo
} from 'react'

import { listen } from '@tauri-apps/api/event'
import { useModal } from '@/components/context'

const tauriListenersContextDefaultValues: Record<string, unknown> = {}

export const TauriListenersContext = createContext<Record<string, unknown>>(
  tauriListenersContextDefaultValues
)

interface TauriListenersProviderProps {
  children: ReactNode
}

export const TauriListenersProvider: FC<TauriListenersProviderProps> = ({
  children
}) => {
  const { modalOpen, close, open, setModalType } = useModal()

  useEffect(() => {
    const refreshListener = listen('refresh', () => {
      location.reload()
    }).catch((e) => console.error('Error in refresh listener:', e))

    const aboutModalListener = listen('about', () => {
      if (modalOpen) {
        close()
      } else {
        open()
        setModalType('about')
      }
    }).catch((e) => console.error('Error in about modal listener:', e))

    const settingsModalListener = listen('settings', () => {
      if (modalOpen) {
        close()
      } else {
        open()
        setModalType('settings')
      }
    }).catch((e) => console.error('Error in settings modal listener:', e))

    return () => {
      // Ensure that the unlisten function exists before calling it
      refreshListener
        .then((unlisten) => unlisten && unlisten()) // Check if unlisten is a function
        .catch((e) => console.error('Error cleaning up refresh listener:', e))

      aboutModalListener
        .then((unlisten) => unlisten && unlisten()) // Check if unlisten is a function
        .catch((e) =>
          console.error('Error cleaning up about modal listener:', e)
        )

      settingsModalListener
        .then((unlisten) => unlisten && unlisten()) // Check if unlisten is a function
        .catch((e) =>
          console.error('Error cleaning up settings modal listener:', e)
        )
    }
  }, [modalOpen, close, open, setModalType])

  const value: Record<string, unknown> = useMemo(() => ({}), [])

  return (
    <TauriListenersContext.Provider value={value}>
      {children}
    </TauriListenersContext.Provider>
  )
}

export const useTauriListeners = () => {
  return useContext(TauriListenersContext)
}
