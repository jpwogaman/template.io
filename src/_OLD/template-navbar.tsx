import { type FC, useEffect, useState } from 'react'
import { IconBtnToggle } from '../components/icon-btn-toggle'
import { useTrackListCount } from '@/_OLD/data/track-list/track-context'
import { useTheme } from 'next-themes'
interface TemplateNavbarProps {}

export const TemplateNavbar: FC<TemplateNavbarProps> = () => {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const trackCount = useTrackListCount()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className='container sticky top-0 z-50 h-[40px] max-h-[40px] min-h-[40px] min-w-full items-center bg-zinc-900'>
      <ul className='flex justify-between'>
        {/*<li className="block w-60 py-2 text-zinc-200">0 VEP Instances</li>
        <li className="block w-60 py-2 text-zinc-200">0 Samplers</li>*/}
        <li className='block w-60 p-2 pl-5 text-left text-zinc-200'>
          {trackCount} {trackCount > 1 ? 'Tracks' : 'Track'}
        </li>
        <li className='block w-60 cursor-pointer p-2 text-right text-zinc-200'>
          <IconBtnToggle
            classes='w-10'
            titleA='Change to Dark Mode.'
            titleB='Change to Light Mode.'
            id='themeChange'
            a='fa-solid fa-circle-half-stroke fa-rotate-180'
            b='fa-solid fa-circle-half-stroke'
            defaultIcon='a'
            onToggleA={() => setTheme('dark')}
            onToggleB={() => setTheme('light')}></IconBtnToggle>
        </li>
      </ul>
    </div>
  )
}
