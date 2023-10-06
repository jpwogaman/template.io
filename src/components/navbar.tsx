import { type FC, Fragment, useState } from 'react'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export const NavBar: FC = () => {
  const { setTheme } = useTheme()

  const Links = [{ name: 'TEST5', link: '/test5' }]

  const [open, setOpen] = useState(false)

  return (
    <Fragment>
      <div
        className={`
            bg-zinc-900 text-zinc-200 
            ${
              open
                ? `shadow-none`
                : `shadow-md shadow-zinc-600 dark:shadow-zinc-500`
            }
            duration-600 sticky left-0
            top-0 z-[1000] h-[60px] max-h-[60px] min-h-[60px]
            w-full transition-shadow ease-in`}>
        <div
          className='mx-auto max-h-[60px] max-w-[1700px] items-center justify-between bg-inherit px-7 py-4
                md:flex md:px-10'>
          <div className='flex cursor-pointer items-center text-2xl text-zinc-200'>
            <div>TEMPLATE.IO</div>
          </div>
          <div className='absolute right-8 top-[15px] cursor-pointer text-3xl md:hidden'>
            <IconBtnToggle
              classes='w-8'
              titleA=''
              titleB=''
              id='openMobileMenu'
              a='fa-solid fa-bars'
              b='fa-solid fa-xmark'
              defaultIcon='a'
              onToggleA={() => setOpen(!open)}
              onToggleB={() => setOpen(!open)}></IconBtnToggle>
          </div>
          <ul
            className={`
                    absolute 
                    left-0 z-[-1] 
                    w-full bg-zinc-900 
                    pl-9 shadow-md 
                    shadow-zinc-600 transition-all duration-500 
                    ease-in dark:shadow-zinc-500 
                    md:static md:z-auto md:flex 
                    md:w-auto md:items-center md:pl-0 md:shadow-none
                    ${open ? 'top-[60px] ' : 'top-[-490px]'}`}>
            {Links.map((link) => (
              <li
                key={link.name}
                className='my-7 text-xl md:my-0 md:ml-8'>
                <Link
                  href={link.link}
                  className='duration-500 hover:text-zinc-400 '>
                  {link.name}
                </Link>
              </li>
            ))}
            <li className='my-7 cursor-pointer text-xl md:my-0 md:ml-8'>
              <IconBtnToggle
                classes='hover:text-zinc-400 duration-500'
                titleA='Change to Dark Mode.'
                titleB='Change to Light Mode.'
                id='themeChange'
                a='fa-solid fa-circle-half-stroke fa-rotate-180'
                b='fa-solid fa-circle-half-stroke'
                defaultIcon='a'
                onToggleA={() => setTheme('dark')}
                onToggleB={() => setTheme('light')}
              />
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  )
}
