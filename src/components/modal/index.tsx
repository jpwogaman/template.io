import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Backdrop from './backdrop'
import useModal from '@/hooks/useModal'
//https://github.com/fireship-io/framer-demo/tree/framer-motion-demo/src

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    y: '100vh',
    opacity: 0
  }
}

type ModalProps = {
  handleClose: () => void
  modalText: string
}

function tw(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Modal = ({ handleClose, modalText }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [handleClose])

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className='bg-main m-auto flex flex-col items-center rounded-xl px-8 py-0 dark:shadow-lg dark:shadow-zinc-600'
        style={{
          width: 'clamp(50%, 700px, 90%)',
          height: 'min(50%, 300px)'
        }}
        variants={dropIn}
        initial='hidden'
        animate='visible'
        exit='exit'>
        {modalText === 'about' && (
          <div className='text-main relative top-12 w-full'>
            <h3 className='text-center text-2xl'>Template.io</h3>
            <div className='text-main mt-4 text-left font-mono text-base'>
              <p>
                Version: 0.1.0{' '}
                <a
                  className='text-blue-600 dark:text-blue-400'
                  href=''>
                  (check for updates)
                </a>
              </p>
              <p>Written by: JP Wogaman II</p>
              <p>
                Source code & Tutorials:{' '}
                <a
                  className='text-blue-600 dark:text-blue-400'
                  href='https://www.github.com/jpwogaman/template.io'
                  target='_blank'>
                  https://www.github.com/jpwogaman/template.io
                </a>
              </p>
            </div>
          </div>
        )}

        {modalText === 'settings' && (
          <div className='text-main relative top-12 w-full'>
            <h3 className='text-center text-2xl'>Settings</h3>
            <div className='text-main mt-4 text-left font-mono text-base'></div>
          </div>
        )}
        <button
          onClick={handleClose}
          type='button'
          className={tw(
            'relative bottom-6 mx-auto mb-0 mt-auto flex min-h-[48px] cursor-pointer items-center rounded px-12 py-0 text-lg text-white',
            'bg-indigo-500',
            'sunrise:bg-red-800',
            'hover:bg-indigo-600',
            'sunrise:hover:bg-red-900',
            'focus-visible:bg-indigo-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black',
            'sunrise:focus-visible:ring-red-900'
          )}>
          Close
        </button>
      </motion.div>
    </Backdrop>
  )
}

export default Modal
