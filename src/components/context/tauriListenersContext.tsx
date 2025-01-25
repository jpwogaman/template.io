'use client'

import {
  createContext,
  useContext,
  type ReactNode,
  type FC,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo
} from 'react'

import { listen } from '@tauri-apps/api/event'
import { useModal } from '@/components/context'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  const { modalOpen, close, open, setModalType } = useModal()

  useEffect(() => {
    const refresh = listen('refresh', () => {
      location.reload()
    }).catch((e) => console.error(e))
    /////
    const aboutModal = listen('about', () => {
      if (modalOpen) {
        close()
      } else {
        open()
        setModalType('about')
      }
    }).catch((e) => console.error(e))
    /////
    const settingsModal = listen('settings', () => {
      if (modalOpen) {
        close()
      } else {
        open()
        setModalType('settings')
      }
    }).catch((e) => console.error(e))

    return () => {
      refresh
        .then((value) => {
          if (typeof value === 'function') {
            value()
          }
        })
        .catch((e) => console.error(e))
      aboutModal
        .then((value) => {
          if (typeof value === 'function') {
            value()
            close()
          }
        })
        .catch((e) => console.error(e))
      settingsModal
        .then((value) => {
          if (typeof value === 'function') {
            value()
            close()
          }
        })
        .catch((e) => console.error(e))
    }
  }, [])

  return (
    <TauriListenersContext.Provider value>
      {children}
    </TauriListenersContext.Provider>
  )
}

export const useTauriListeners = () => {
  return useContext(TauriListenersContext)
}
