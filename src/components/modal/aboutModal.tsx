'use client'

import Link from 'next/link'

export const AboutModal = () => {
  return (
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
  )
}
