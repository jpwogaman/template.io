import { useState, useEffect } from 'react'

const useContextMenu = () => {
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  const [contextMenuId, setContextMenuId] = useState('')
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0
  })

  const setContextMenuPositionHelper = (e: MouseEvent) => {
    if (e.pageX + 15 > window.innerWidth - 250) {
      setContextMenuPosition({
        left: e.pageX - 250,
        top: e.pageY - 15
      })
    }

    if (e.pageY - 15 > window.innerHeight - 250) {
      setContextMenuPosition({
        left: e.pageX + 15,
        top: e.pageY - 250
      })
    }

    if (
      e.pageX + 15 > window.innerWidth - 250 &&
      e.pageY - 15 > window.innerHeight - 250
    )
      setContextMenuPosition({
        left: e.pageX - 250,
        top: e.pageY - 250
      })

    if (
      e.pageX + 15 < window.innerWidth - 250 &&
      e.pageY - 15 < window.innerHeight - 250
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
    }
    const handleLeftClick = (e: MouseEvent) => {
      if (isContextMenuOpen) {
        setIsContextMenuOpen(false)
      }
    }

    window.addEventListener('click', handleLeftClick)

    window.addEventListener('contextmenu', handleRightClick)
    return () => {
      window.addEventListener('click', handleLeftClick)
      window.removeEventListener('contextmenu', handleRightClick)
    }
  }, [isContextMenuOpen])

  return {
    contextMenuPosition,
    isContextMenuOpen,
    setIsContextMenuOpen,
    contextMenuId,
    setContextMenuId
  }
}

export default useContextMenu
