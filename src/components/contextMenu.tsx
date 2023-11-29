//import tw from '@/utils/tw'
//import React, { useState, useEffect } from 'react'

//export const ContextMenu = ({ id, children, classes, ...props }) => {
//  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
//  const [contextMenuPosition, setContextMenuPosition] = useState({
//    top: 0,
//    left: 0
//  })
//  const handleContextMenu = (event) => {
//    event.preventDefault()
//    setIsContextMenuOpen(true)
//    setContextMenuPosition({
//      left: event.pageX,
//      top: event.pageY
//    })
//  }
//  const handleClick = () => {
//    setIsContextMenuOpen(false)
//  }
//  useEffect(() => {
//    document.addEventListener('click', handleClick)
//    return () => {
//      document.removeEventListener('click', handleClick)
//    }
//  })

//  return React.createElement(
//    'div',
//    Object.assign(
//      {
//        id: id,
//        className: tw('relative', classes),
//        onContextMenu: handleContextMenu
//      },
//      props
//    ),
//    children,
//    isContextMenuOpen &&
//      React.createElement(
//        'div',
//        {
//          className: tw(
//            'absolute z-50 bg-white dark:bg-zinc-900 rounded-sm shadow-md',
//            'p-1',
//            'border border-gray-200 dark:border-zinc-800'
//          ),
//          style: {
//            top: contextMenuPosition.top,
//            left: contextMenuPosition.left
//          }
//        },
//        props.children
//      )
//  )
//}
