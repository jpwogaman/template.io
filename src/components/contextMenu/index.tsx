import tw from '@/utils/tw'
import { type Dispatch, type FC, type SetStateAction } from 'react'

type ContextMenuProps = {
  contextMenuPosition: {
    top: number
    left: number
  }
  setIsContextMenuOpen: Dispatch<SetStateAction<boolean>>
}

const ContextMenu: FC<ContextMenuProps> = ({
  contextMenuPosition,
  setIsContextMenuOpen
}) => {
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
      <h1>Test</h1>
    </div>
  )
}

export default ContextMenu
