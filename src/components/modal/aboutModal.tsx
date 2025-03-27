'use client'

import Link from 'next/link'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'

export const AboutModal = () => {
  const checkForUpdates = async () => {
    const update = await check()
    if (update) {
      console.log(
        `found update ${update.version} from ${update.date} with notes ${update.body}`
      )
      let downloaded = 0
      let contentLength = 0
      // alternatively we could also call update.download() and update.install() separately
      await update.download((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength ?? 0
            console.log(`started downloading ${event.data.contentLength} bytes`)
            break
          case 'Progress':
            downloaded += event.data.chunkLength
            console.log(`downloaded ${downloaded} from ${contentLength}`)
            break
          case 'Finished':
            console.log('download finished')
            break
        }
      })

      console.log('update downloaded')
      //await relaunch()
    }
  }

  return (
    <div className='text-main relative w-full'>
      <h3 className='text-center text-2xl'>Template.io</h3>
      <div className='text-main font-code mt-4 text-left text-base'>
        <p>
          Version: 0.0.0{' '}
          <button
            className='text-blue-600 dark:text-blue-400'
            onClick={checkForUpdates}
            type='button'>
            (check for updates)
          </button>
        </p>
        <p>Written by: JP Wogaman II</p>
        <p>
          Source code & Tutorials:{' '}
          <Link
            className='text-blue-600 dark:text-blue-400'
            href='https://www.github.com/jpwogaman/template.io'
            target='_blank'>
            https://www.github.com/jpwogaman/template.io
          </Link>
        </p>
      </div>
    </div>
  )
}
