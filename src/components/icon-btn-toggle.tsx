import { type FC, useState } from 'react'
import tw from '@/utils/tw'

interface IconBtnToggleProps {
  id: string
  titleA: string
  titleB: string
  classes: string
  a: string
  b: string
  defaultIcon: string
  onToggleA?: () => void | string | undefined
  onToggleB?: () => void | string | undefined
}

export const IconBtnToggle: FC<IconBtnToggleProps> = ({
  onToggleA,
  onToggleB,
  classes,
  defaultIcon,
  titleA,
  titleB,
  id,
  a,
  b
}) => {
  const [isToggleOn, setIsToggleOn] = useState<boolean>(defaultIcon === 'a')

  const handleClick = () => {
    if (isToggleOn) {
      setIsToggleOn(false)
      onToggleA!()
    } else {
      setIsToggleOn(true)
      onToggleB!()
    }
  }

  return (
    <button
      className={tw(
        'rounded-sm p-1 outline-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-600',
        classes
      )}
      title={isToggleOn ? titleA : titleB}
      onClick={handleClick}
      id={id}>
      <i
        id={id + '_icon'}
        className={isToggleOn ? a : b}></i>
    </button>
  )
}
