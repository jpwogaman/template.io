import { type NextPage } from 'next'
import { TrackList } from '@/components/layout/trackList'
import { TrackOptions } from '@/components/layout/trackOptions'

const Home: NextPage = () => {
  return (
    <main className='flex h-[calc(100%-40px)] overflow-hidden'>
      <TrackList />
      <TrackOptions />
    </main>
  )
}

export default Home
