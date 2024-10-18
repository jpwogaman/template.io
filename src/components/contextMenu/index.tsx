import tw from '@/utils/tw'
import { type Dispatch, type FC, type SetStateAction } from 'react'
import { ContextMenuOptions } from '../utils/contextMenuOptions'
import useMutations from '@/hooks/useMutations'

type ContextMenuProps = {
  contextMenuId: string
  contextMenuPosition: {
    top: number
    left: number
  }
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
}

const ContextMenu: FC<ContextMenuProps> = ({
  contextMenuId,
  contextMenuPosition,
  setIsContextMenuOpen
}) => {
  //const { } = useMutations()

  const handleClick = (newMenuId: string) => {
    setIsContextMenuOpen(false)
  }

  return (
    <div
      className={tw(
        'absolute z-[100] rounded-sm border border-zinc-200 bg-white shadow-md dark:bg-zinc-900',
        'min-h-[15rem] min-w-[10rem] p-4',
        'border border-gray-200 text-xs dark:border-zinc-800'
      )}
      style={{
        top: contextMenuPosition.top,
        left: contextMenuPosition.left
      }}>
      <h1>hello</h1>
    </div>
  )
}

export default ContextMenu
