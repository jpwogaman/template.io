import { TrackListTable } from '@/_OLD/track-list'
import { TrackSettings } from '@/_OLD/track-settings'
import { TemplateNavbar } from '@/_OLD/template-navbar'
import { TrackListProvider } from '@/_OLD/data/track-list/track-context'
import { Test5 } from '@/components/test5'

import { type NextPage } from 'next'

const Index: NextPage = () => {
  return (
    <Test5 />
    //<TrackListProvider>
    //  <TemplateNavbar />
    //  <div
    //    id='TemplateData'
    //    className='w-100 h-[calc(100vh-40px)]'>
    //    <TrackListTable />
    //    <TrackSettings />
    //  </div>
    //</TrackListProvider>
  )
}

export default Index
