'use client'

import { type FC } from 'react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import { useMutations, useSelectedItem } from '@/components/context'
import tw from '../utils/tw'

export const NavBar: FC = () => {
  const { copiedItemId, copiedSubItemId } = useSelectedItem()
  const [mounted, setMounted] = useState(false)

  const {
    dataLength,
    vepSamplerCount,
    vepInstanceCount,
    nonVepSamplerCount,
    renumber
  } = useMutations()

  const { setTheme, resolvedTheme } = useTheme()

  const themeOrder = ['dark', 'light']
  const themeIndex = themeOrder.indexOf(resolvedTheme as string)
  const nextIndex = themeIndex === 1 ? 0 : themeIndex + 1

  const changeTheme = () => {
    setTheme(themeOrder[nextIndex] as string)
  }

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }

  return (
    <nav className='h-[40px] bg-zinc-900 text-zinc-200'>
      <ul className='flex h-full justify-between'>
        <li className='flex items-center gap-2 pl-5'>
          <span className='underline underline-offset-4'>
            {dataLength} {dataLength > 1 ? 'Tracks' : 'Track'}
          </span>
          <span>across</span>
          <span className='underline underline-offset-4'>
            {vepSamplerCount + nonVepSamplerCount}{' '}
            {vepSamplerCount + nonVepSamplerCount > 1 ? 'Samplers' : 'Sampler'}
          </span>
          <span>(</span>
          <span className='underline underline-offset-4'>
            {vepSamplerCount}
          </span>
          <span>across</span>
          <span className='underline underline-offset-4'>
            {vepInstanceCount}{' '}
            {vepInstanceCount > 1 ? 'VEP Instances' : 'VEP Instance'}
          </span>
          <span>and</span>
          <span className='underline underline-offset-4'>
            {nonVepSamplerCount}
          </span>
          <span>standalone in DAW)</span>
        </li>
        <li className='flex items-center gap-2 pl-5 text-left text-sm'>
          <button className='px-2'>{`Copied Item: ${copiedItemId}`}</button>
          <button className='px-2'>{`Copied SubItem: ${copiedSubItemId}`}</button>
        </li>
        <li className='flex items-center'>
          <button
            type='button'
            className={tw(
              'cursor-pointer rounded-lg p-2 text-zinc-200 transition-colors duration-300',
              'outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:outline-hidden focus-visible:ring-inset'
            )}
            onClick={changeTheme}>
            <span className='sr-only'>toggle themes</span>
            {resolvedTheme === 'dark' && (
              <HiOutlineMoon
                className='h-5 w-5'
                aria-hidden='true'
                style={{ transform: 'scale(-1,1)', rotate: '-25deg' }}
              />
            )}
            {resolvedTheme === 'light' && (
              <HiOutlineSun
                className='h-5 w-5'
                aria-hidden='true'
              />
            )}
          </button>
        </li>
      </ul>
    </nav>
  )
}
