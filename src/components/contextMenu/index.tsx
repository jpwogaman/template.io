import tw from '@/utils/tw'
import { FC } from 'react'

type ContextMenuProps = {
  contextMenuId: string
  contextMenuPosition: {
    top: number
    left: number
  }
}

const ContextMenu: FC<ContextMenuProps> = ({
  contextMenuId,
  contextMenuPosition
}) => {
  return (
    <div
      className={tw(
        'absolute z-[100] rounded-sm border border-zinc-200 bg-white shadow-md dark:bg-zinc-900',
        'min-h-40 p-4',
        'border border-gray-200 text-xs dark:border-zinc-800'
      )}
      style={{
        top: contextMenuPosition.top,
        left: contextMenuPosition.left
      }}>
      <h3 className='mx-auto'>{`Selected: ${contextMenuId}`}</h3>
      <hr className='my-2' />
      {/*{contextMenuIsOverTrackOptions &&
          TrackOptionsContextMenu.map((item) => {
            const { id, label, icon1, icon2 } = item
  
            let newId = id
            let newLabel = label
  
            if (contextMenuId.includes('FR_')) {
              newId = id.replace('Item', 'Range')
              newLabel = label?.replace('Item', 'Range')
            }
            if (contextMenuId.includes('AL_')) {
              newId = id.replace('Item', 'Articulation')
              newLabel = label?.replace('Item', 'Articulation')
            }
            if (contextMenuId.includes('FL_')) {
              newId = id.replace('Item', 'Fader')
              newLabel = label?.replace('Item', 'Fader')
            }
  
            if (id.includes('break'))
              return (
                <hr
                  key={id}
                  className='my-2'
                />
              )
  
            return (
              <button
                key={newId}
                onClick={() => {
                  setIsContextMenuOpen(false)
                }}
                className='flex items-center gap-2 whitespace-nowrap'>
                <p>{newLabel}</p>
                <i className={`fa-solid ${icon1}`} />
                {icon2 && <i className={`fa-solid ${icon2}`} />}
              </button>
            )
          })}*/}
    </div>
  )
}

export default ContextMenu
