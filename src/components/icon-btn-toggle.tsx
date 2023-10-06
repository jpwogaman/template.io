import { type ReactNode, type FC, useState } from 'react'
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
  children?: ReactNode
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
  const [isToggleOn, setToggle] = useState<boolean>(defaultIcon === 'a')

  const handleClick = () => {
    if (isToggleOn) {
      setToggle(false)
      onToggleA!()
    } else {
      setToggle(true)
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
