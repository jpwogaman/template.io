import { FC, Fragment } from 'react'
import { Link } from 'react-router-dom'

export const Footer: FC = () => {
    let Links = [{ name: 'test5', link: '/test5' }]

    return (
        <Fragment>
            <div className='w-full min-h-[100px] h-[100px] max-h-[100px] px-2 bg-inherit'>
                <hr className='h-[2px] max-w-[95vw] mx-auto border-0 bg-zinc-900 dark:bg-zinc-200'></hr>
                <div className='md:flex md:items-top md:justify-between py-4 max-w-[95vw] mx-auto'>
                    <ul className='flex items-top gap-4'>
                        {Links.map((link) => (
                            <li key={link.name} className='my-0 text-sm md:text-base'>
                                <Link to={link.link} className='hover:text-zinc-400 duration-500 '>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className='mt-4 md:mt-0 text-sm md:text-base md:text-right'>
                        <p>Copyright ©2022 WOGAMUSIC. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
