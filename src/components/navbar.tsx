import { FC, Fragment, useState } from 'react'
import { IconBtnToggle } from '../components/icon-btn-toggle'
import { Link } from 'react-router-dom'
import { useThemeUpdate } from '../context/theme-context'

export const NavBar: FC = () => {
    const changeTheme = useThemeUpdate()

    let Links = [{ name: 'TEST5', link: '/test5' }]

    let [open, setOpen] = useState(false)

    return (
        <Fragment>
            <div
                className={`
            bg-zinc-900 text-zinc-200 
            ${open ? `shadow-none` : `shadow-md shadow-zinc-600 dark:shadow-zinc-500`}
            transition-shadow duration-600 ease-in
            w-full sticky top-0 left-0 z-[1000]
            min-h-[60px] h-[60px] max-h-[60px]`}>
                <div
                    className='md:flex items-center justify-between py-4 md:px-10 px-7 bg-inherit max-h-[60px]
                max-w-[1700px] mx-auto'>
                    <div className='text-2xl cursor-pointer flex items-center text-zinc-200'>
                        <div>TEMPLATE.IO</div>
                    </div>
                    <div className='text-3xl absolute right-8 top-[15px] cursor-pointer md:hidden'>
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
                    bg-zinc-900 
                    md:flex md:items-center 
                    absolute md:static 
                    md:z-auto z-[-1] 
                    left-0 w-full md:w-auto 
                    md:pl-0 pl-9 
                    transition-all duration-500 ease-in 
                    shadow-md shadow-zinc-600 dark:shadow-zinc-500 md:shadow-none
                    ${open ? 'top-[60px] ' : 'top-[-490px]'}`}>
                        {Links.map((link) => (
                            <li key={link.name} className='md:ml-8 text-xl md:my-0 my-7'>
                                <Link to={link.link} className='hover:text-zinc-400 duration-500 '>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                        <li className='md:ml-8 text-xl md:my-0 my-7 cursor-pointer'>
                            <IconBtnToggle
                                classes='hover:text-zinc-400 duration-500'
                                titleA='Change to Dark Mode.'
                                titleB='Change to Light Mode.'
                                id='themeChange'
                                a='fa-solid fa-circle-half-stroke fa-rotate-180'
                                b='fa-solid fa-circle-half-stroke'
                                defaultIcon='a'
                                onToggleA={changeTheme}
                                onToggleB={changeTheme}></IconBtnToggle>
                        </li>
                    </ul>
                </div>
            </div>
        </Fragment>
    )
}
