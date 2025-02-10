'use client'
// credit -> https://github.com/fireship-io/framer-demo/tree/framer-motion-demo/src

import { type ChangeEvent, Fragment, type ReactNode } from 'react'
import { LazyMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useModal, useSelectedItem } from '@/components/context'
import Link from 'next/link'
import { type Settings } from '../backendCommands/backendCommands'

const loadFeatures = () =>
  import('@/components/layout/motionFeatures').then((res) => res.default)

import { twMerge } from 'tailwind-merge'

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
  const { settings, updateSettings } = useSelectedItem()

  type SettingsMenuOptions = Record<
    string,
    Partial<
      Record<
        keyof Settings,
        {
          label: string
          input: string
          max: number
        }
      >
    >
  >

  const SettingsMenuOptions: SettingsMenuOptions = {
    outputs: {
      vep_out_settings: {
        label: 'Number of VEP Outs',
        input: 'number',
        max: 256
      },
      smp_out_settings: {
        label: 'Number of Sampler Outs',
        input: 'number',
        max: 128
      }
    },
    counts: {
      default_range_count: {
        label: 'Default Number of Ranges for a New Track',
        input: 'number',
        max: 10
      },
      default_art_tog_count: {
        label: 'Default Number of Toggle Articulations for a New Track',
        input: 'number',
        max: 10
      },
      default_art_tap_count: {
        label: 'Default Number of Tap Articulations for a New Track',
        input: 'number',
        max: 10
      },
      default_art_layer_count: {
        label: 'Default Number of Articulation Layers for a New Track',
        input: 'number',
        max: 10
      },
      default_fad_count: {
        label: 'Default Number of Faders for a New Track',
        input: 'number',
        max: 10
      }
    },
    additions: {
      track_add_count: {
        label: 'Number of Tracks to Add at a Time',
        input: 'number',
        max: 10
      },
      sub_item_add_count: {
        label: 'Number of Ranges/Articulations/Faders to Add at a Time',
        input: 'number',
        max: 10
      }
    }
  }

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
          {modalType === 'about' && (
            <div className='text-main relative top-12 w-full'>
              <h3 className='text-center text-2xl'>Template.io</h3>
              <div className='text-main font-code mt-4 text-left text-base'>
                <p>
                  Version: 0.1.0{' '}
                  <Link
                    className='text-blue-600 dark:text-blue-400'
                    href=''>
                    (check for updates)
                  </Link>
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

          {modalType === 'settings' && (
            <div className='text-main relative top-12 w-full'>
              <h3 className='text-center text-2xl'>Settings</h3>
              <div className='text-main font-code mt-4 text-left text-base'>
                {Object.entries(SettingsMenuOptions).map(([key, item]) => {
                  type subItemMap = [
                    keyof Settings,
                    (typeof item)[keyof Settings]
                  ][]

                  return (
                    <Fragment key={key}>
                      <hr className='my-2' />

                      {(Object.entries(item) as subItemMap).map(
                        ([subKey, subItem]) => {
                          if (!subItem) return null

                          const { label, input, max } = subItem

                          return (
                            <div
                              key={subKey}
                              className='flex items-center'>
                              <label className='mr-4'>{`${label}:`}</label>
                              <div className='w-[60px]'>
                                {input === 'number' && (
                                  <input
                                    type='number'
                                    id='contextMenuCountInput'
                                    max={max}
                                    min={1}
                                    value={settings[subKey] as number}
                                    onChange={(
                                      e: ChangeEvent<HTMLInputElement>
                                    ) => {
                                      e.stopPropagation()
                                      e.preventDefault()
                                      const newValue =
                                        parseInt(e.target.value) || 1

                                      void updateSettings({
                                        key: subKey,
                                        value: newValue
                                      })
                                    }}
                                    className={twMerge(
                                      'h-full w-full',
                                      'hover:cursor-text',
                                      'rounded-xs bg-inherit p-1 outline-hidden',
                                      'focus-visible:cursor-text focus-visible:bg-white focus-visible:text-zinc-900 focus-visible:placeholder-zinc-500 focus-visible:ring-4 focus-visible:ring-indigo-600 focus-visible:outline-hidden'
                                    )}
                                  />
                                )}
                              </div>
                            </div>
                          )
                        }
                      )}
                    </Fragment>
                  )
                })}
              </div>
            </div>
          )}

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
