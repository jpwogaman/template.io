import { type NextPage } from 'next'
import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'

const Home: NextPage = () => {
  return (
    <main className='flex h-[calc(100%-40px)]'>
      <TrackList />
      <TrackOptions />
    </main>
  )
}

export default Home
