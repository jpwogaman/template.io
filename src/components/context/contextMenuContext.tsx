'use client'

import {
  type ReactNode,
  type FC,
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react'

import { type FileItemId, type SubItemId } from './selectedItemContext'

export type contextMenuType = FileItemId | SubItemId | null

interface ContextMenuType {
  isContextMenuOpen: boolean
  contextMenuId: contextMenuType
  contextMenuPosition: {
    top: number
    left: number
  }
  close: () => void
  open: () => void
  setContextMenuId: Dispatch<SetStateAction<contextMenuType>>
  setIsContextMenuOpen: (isOpen: boolean) => void
  setContextMenuPosition: (position: { top: number; left: number }) => void
}

const contextMenuContextDefaultValues: ContextMenuType = {
  isContextMenuOpen: false,
  contextMenuId: null,
  contextMenuPosition: {
    top: 0,
    left: 0
  },
  close: () => undefined,
  open: () => undefined,
  setContextMenuId: () => undefined,
  setIsContextMenuOpen: () => undefined,
  setContextMenuPosition: () => undefined
}

export const ContextMenuContext = createContext<ContextMenuType>(
  contextMenuContextDefaultValues
)

interface ContextMenuProviderProps {
  children: ReactNode
}

export const ContextMenuProvider: FC<ContextMenuProviderProps> = ({
  children
}) => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  const [contextMenuId, setContextMenuId] = useState<contextMenuType>(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0
  })
  const close = useCallback(() => {
    setIsContextMenuOpen(false)
  }, [setIsContextMenuOpen])

  const open = useCallback(() => {
    setIsContextMenuOpen(true)
  }, [setIsContextMenuOpen])

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
      const contextMenu = document.getElementById('contextMenuCountInput')
      if (contextMenu && !contextMenu.contains(e.target as Node)) {
        close()
      }
    }

    window.addEventListener('click', handleLeftClick)
    window.addEventListener('contextmenu', handleRightClick)
    return () => {
      window.addEventListener('click', handleLeftClick)
      window.removeEventListener('contextmenu', handleRightClick)
    }
  }, [isContextMenuOpen, open, close])

  const value = useMemo(
    () => ({
      isContextMenuOpen,
      setIsContextMenuOpen,
      contextMenuId,
      setContextMenuId,
      contextMenuPosition,
      setContextMenuPosition,
      close,
      open
    }),
    [
      isContextMenuOpen,
      setIsContextMenuOpen,
      contextMenuId,
      setContextMenuId,
      contextMenuPosition,
      setContextMenuPosition,
      close,
      open
    ]
  )

  return (
    <ContextMenuContext.Provider value={value}>
      {children}
    </ContextMenuContext.Provider>
  )
}

export const useContextMenu = () => {
  return useContext(ContextMenuContext)
}
