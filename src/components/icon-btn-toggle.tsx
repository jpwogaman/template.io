import { type FC, useState } from 'react'
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
      className={`transition-transform duration-200 ${classes}`}
      title={isToggleOn ? titleA : titleB}
      onClick={handleClick}
      id={id}>
      <i className={isToggleOn ? a : b}></i>
    </button>
  )
}
