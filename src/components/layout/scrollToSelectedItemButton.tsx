'use client'

import { useCallback, useLayoutEffect, useState, type FC } from 'react'
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDoubleDown
} from 'react-icons/hi2'

import { twMerge } from 'tailwind-merge'
import { useSelectedItem } from '../context'

export const ScrollToSelectedItemButton: FC = () => {
  const [visible, setVisible] = useState(false)
  const [trackListWidth, setTrackListWidth] = useState(0)
  const [isAbove, setIsAbove] = useState(false)
  const { settings } = useSelectedItem()
  const { selected_item_id } = settings

  const scrollToSelectedItem = useCallback(() => {
    const trackList = document.getElementById('trackList') as HTMLDivElement
    const selectedItem = document.getElementById(
      selected_item_id + '_row'
    ) as HTMLDivElement | null

    if (!trackList || !selectedItem) return

    const trackListRect = trackList.getBoundingClientRect()
    const selectedItemRect = selectedItem.getBoundingClientRect()

    const isAbove = selectedItemRect.top < trackListRect.top
    const isBelow = selectedItemRect.bottom > trackListRect.bottom

    if (isAbove) {
      // Scroll so selected item is at the top of the visible area
      trackList.scrollTo({
        top: selectedItem.offsetTop - trackList.offsetTop - 200, // 200 vibes-based
        behavior: 'smooth'
      })
    } else if (isBelow) {
      // Scroll so selected item is at the bottom of the visible area
      const offsetBottom =
        selectedItem.offsetTop -
        trackList.offsetTop -
        (trackList.clientHeight - selectedItem.offsetHeight) +
        200 // 200 vibes-based

      trackList.scrollTo({
        top: offsetBottom,
        behavior: 'smooth'
      })
    }
  }, [selected_item_id])

  const toggleVisible = useCallback(() => {
    const trackList = document.getElementById('trackList') as HTMLDivElement
    const selectedItem = document.getElementById(
      selected_item_id + '_row'
    ) as HTMLDivElement | null

    if (!trackList || !selectedItem) {
      setVisible(false)
      return
    }

    const trackListRect = trackList.getBoundingClientRect()
    const selectedItemRect = selectedItem.getBoundingClientRect()

    const isAbove = selectedItemRect.top < trackListRect.top
    const isInView =
      selectedItemRect.top >= trackListRect.top &&
      selectedItemRect.bottom <= trackListRect.bottom

    setIsAbove(isAbove)
    setVisible(!isInView)
  }, [selected_item_id, setIsAbove, setVisible])

  const getTrackListWidth = useCallback(() => {
    const trackList = document.getElementById('trackList') as HTMLDivElement
    if (!trackList) return
    setTrackListWidth(trackList.getBoundingClientRect().width)
  }, [])

  useLayoutEffect(() => {
    const trackList = document.getElementById('trackList') as HTMLDivElement
    if (!trackList) return

    const handleScroll = () => {
      toggleVisible()
    }

    getTrackListWidth()
    toggleVisible()

    trackList.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', getTrackListWidth)

    return () => {
      trackList.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', getTrackListWidth)
    }
  }, [toggleVisible, getTrackListWidth])

  return (
    <button
      id='scrollToTopButton'
      style={{
        left: trackListWidth - 60
      }}
      className={twMerge(
        'fixed bottom-12 h-8 w-8 cursor-pointer',
        visible
          ? 'z-1000 translate-y-0 border-red-400 bg-zinc-800 text-zinc-200 shadow-md'
          : 'z-40 translate-y-24 border-transparent bg-transparent text-transparent',
        'items-center rounded-md border-2 transition-transform duration-500 ease-in-out',
        'focus-visible:translate-y-0 focus-visible:border-none focus-visible:border-red-400 focus-visible:bg-zinc-800 focus-visible:text-zinc-200 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-hidden focus-visible:ring-inset',
        'focus-visible:sunrise:ring-zinc-300',
        'shadow-zinc-600',
        'dark:shadow-zinc-500'
      )}
      onClick={scrollToSelectedItem}>
      <span className='sr-only'>Scroll to Top</span>
      {isAbove && <HiOutlineChevronDoubleUp className='mx-auto h-4 w-4' />}
      {!isAbove && <HiOutlineChevronDoubleDown className='mx-auto h-4 w-4' />}
    </button>
  )
}
