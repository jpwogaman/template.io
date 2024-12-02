'use client'

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
  type FC,
  useEffect,
  useState
} from 'react'

interface ContextMenuType {
  isContextMenuOpen: boolean
  contextMenuId: string
  contextMenuPosition: {
    top: number
    left: number
  }
  close: () => void
  open: () => void  
  setContextMenuId: (id: string) => void
  setIsContextMenuOpen: (isOpen: boolean) => void
  setContextMenuPosition: (position: { top: number, left: number }) => void
}

const contextMenuContextDefaultValues: ContextMenuType = {
  isContextMenuOpen: false,
  contextMenuId: '',
  contextMenuPosition: {
    top: 0,
    left: 0
  },
  /* eslint-disable @typescript-eslint/no-empty-function */
  close: () => {},
  open: () => {},  
  setContextMenuId: () => {},
  setIsContextMenuOpen: () => {},
  setContextMenuPosition: () => {}
}

export const ContextMenuContext = createContext<ContextMenuType>(
  contextMenuContextDefaultValues
)

interface ContextMenuProviderProps {
  children: ReactNode
}

export const ContextMenuProvider: FC<ContextMenuProviderProps> = ({
  children,
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  const [contextMenuId, setContextMenuId] = useState('')
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0
  })
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const close = useCallback(() => {
    setIsContextMenuOpen(false)
  }, [isContextMenuOpen])

  const open = useCallback(() => {
    setIsContextMenuOpen(true)
  }, [isContextMenuOpen])

  const setContextMenuPositionHelper = (e: MouseEvent) => {
    if (e.pageX + 15 > window.innerWidth - 250) {
      setContextMenuPosition({
        left: e.pageX - 250,
        top: e.pageY - 15
      })
    }

    if (e.pageY - 15 > window.innerHeight - 375) {
      setContextMenuPosition({
        left: e.pageX + 15,
        top: e.pageY - 375
      })
    }

    if (
      e.pageX + 15 > window.innerWidth - 250 &&
      e.pageY - 15 > window.innerHeight - 375
    )
      setContextMenuPosition({
        left: e.pageX - 250,
        top: e.pageY - 375
      })

    if (
      e.pageX + 15 < window.innerWidth - 250 &&
      e.pageY - 15 < window.innerHeight - 375
    ) {
      setContextMenuPosition({
        left: e.pageX + 15,
        top: e.pageY - 15
      })
    }
  }

  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault()
      setContextMenuPositionHelper(e)
      open()
    }
    const handleLeftClick = (e: MouseEvent) => {
      if (isContextMenuOpen) {
        close()
      }
    }

    window.addEventListener('click', handleLeftClick)
    window.addEventListener('contextmenu', handleRightClick)
    return () => {
      window.addEventListener('click', handleLeftClick)
      window.removeEventListener('contextmenu', handleRightClick)
    }
  }, [isContextMenuOpen])

  const value = useMemo(
    () => ({
      isContextMenuOpen,
      setIsContextMenuOpen,
      contextMenuId,
      setContextMenuId,
      contextMenuPosition,
      setContextMenuPosition,
      close,
      open,
    }),
    [
      isContextMenuOpen,
      setIsContextMenuOpen,
      contextMenuId,
      setContextMenuId,
      contextMenuPosition,
      setContextMenuPosition,
      close,
      open,
    ]
  )

  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>
}

export const useContextMenu = () => {
  return useContext(ContextMenuContext)
}
