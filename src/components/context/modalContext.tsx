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

interface ModalMessage {
  loadingMessage: string
  successMessage: string
  errorMessage: string
}

type status = 'success' | 'error' | null

interface ModalContextType {
  modalOpen: boolean
  modalMessage: ModalMessage
  modalType: 'about' | 'settings'
  loading: boolean
  status: status
  close: () => void
  open: () => void
  setModalType: Dispatch<SetStateAction<'about' | 'settings'>>
  setModalMessage: Dispatch<SetStateAction<ModalMessage>>
  setLoading: Dispatch<SetStateAction<boolean>>
  setStatus: Dispatch<SetStateAction<status>>
}

const modalContextDefaultValues: ModalContextType = {
  modalOpen: false,
  modalMessage: {
    loadingMessage: '',
    successMessage: '',
    errorMessage: ''
  },
  modalType: 'about',
  loading: false,
  status: null,
  /* eslint-disable @typescript-eslint/no-empty-function */
  close: () => {},
  open: () => {},
  setModalType: () => {},
  setModalMessage: () => {},
  setLoading: () => {},
  setStatus: () => {}
}

export const ModalContext = createContext<ModalContextType>(
  modalContextDefaultValues
)

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState<ModalMessage>({
    loadingMessage: '',
    successMessage: '',
    errorMessage: ''
  })
  const [modalType, setModalType] = useState<'about' | 'settings'>('about')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<status>(null)

  const close = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const open = useCallback(() => {
    setModalOpen(true)
  }, [setModalOpen])

  const handleEsc = (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.key === 'Escape') {
      close()
    }
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('overflow-hidden')
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.classList.remove('overflow-hidden')
      window.removeEventListener('keydown', handleEsc)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen])

  const value = useMemo(
    () => ({
      modalOpen,
      close,
      open,
      loading,
      setLoading,
      status,
      setStatus,
      modalMessage,
      modalType,
      setModalType,
      setModalMessage
    }),
    [
      modalOpen,
      close,
      open,
      loading,
      setLoading,
      status,
      setStatus,
      modalMessage,
      modalType,
      setModalType,
      setModalMessage
    ]
  )

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export const useModal = () => {
  return useContext(ModalContext)
}
