import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

// Centralizes modal control

type modalProps = {
  route: string
  refreshAfterClose: boolean
}

const useModal = ({ route, refreshAfterClose }: modalProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { push } = useRouter()

  const close = () => {
    setModalOpen(false)

    if (refreshAfterClose) {
      push(route, undefined, { shallow: false }).catch((error) =>
        console.error(error)
      )
    }
  }
  const open = () => setModalOpen(true)

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [modalOpen])

  return { modalOpen, close, open }
}

export default useModal
