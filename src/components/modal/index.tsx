'use client'
// credit -> https://github.com/fireship-io/framer-demo/tree/framer-motion-demo/src

import { type ReactNode } from 'react'
import { LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { twMerge } from 'tailwind-merge'
import { useModal } from '@/components/context'
import { SettingsModal } from '@/components/modal/settingsModal'
import { AboutModal } from '@/components/modal/aboutModal'

const loadFeatures = () =>
  import('@/components/layout/motionFeatures').then((res) => res.default)

interface BackdropProps {
  onClick: () => void
  children: ReactNode
}

const Backdrop = ({ children, onClick }: BackdropProps) => {
  return (
    <LazyMotion
      features={loadFeatures}
      strict>
      <m.div
        onClick={onClick}
        className='absolute top-0 left-0 z-100 flex h-screen w-full items-center justify-center overflow-y-hidden bg-black/60'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        {children}
      </m.div>
    </LazyMotion>
  )
}

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

export const Modal = () => {
  const { close, modalOpen, modalType } = useModal()

  if (!modalOpen) return null
  return (
    <Backdrop onClick={close}>
      <LazyMotion
        features={loadFeatures}
        strict>
        <m.div
          onClick={(e) => e.stopPropagation()}
          className='bg-main m-auto flex flex-col items-center rounded-xl px-8 py-0 dark:shadow-lg dark:shadow-zinc-600'
          style={{
            width: 'clamp(50%, 700px, 90%)',
            height: 'min(60%, 800px)'
          }}
          variants={dropIn}
          initial='hidden'
          animate='visible'
          exit='exit'>
          {modalType === 'about' && <AboutModal />}
          {modalType === 'settings' && <SettingsModal />}

          <button
            onClick={close}
            type='button'
            className={twMerge(
              'relative bottom-6 mx-auto mt-auto mb-0 flex min-h-[48px] cursor-pointer items-center rounded-sm px-12 py-0 text-lg text-white',
              'bg-indigo-500',
              'sunrise:bg-red-800',
              'hover:bg-indigo-600',
              'sunrise:hover:bg-red-900',
              'focus-visible:bg-indigo-600 focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-hidden',
              'sunrise:focus-visible:ring-red-900'
            )}>
            Close
          </button>
        </m.div>
      </LazyMotion>
    </Backdrop>
  )
}
export { SettingsModal }

