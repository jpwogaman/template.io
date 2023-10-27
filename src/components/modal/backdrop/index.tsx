import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
//https://github.com/fireship-io/framer-demo/blob/framer-motion-demo/src

interface BackdropProps {
  onClick: () => void
  children: ReactNode
}

const Backdrop = ({ children, onClick }: BackdropProps) => {
  return (
    <motion.div
      onClick={onClick}
      className='absolute left-0 top-0 z-[500] flex h-screen w-full items-center justify-center overflow-y-hidden bg-black bg-opacity-50'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {children}
    </motion.div>
  )
}

export default Backdrop
