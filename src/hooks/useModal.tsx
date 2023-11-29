import { useState, useEffect } from 'react'

const useModal = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalText, setModalText] = useState('')

  const close = () => {
    setModalOpen(false)
  }

  const open = () => {
    setModalOpen(true)
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [modalOpen])

  return { modalOpen, close, open, modalText, setModalText }
}

export default useModal
