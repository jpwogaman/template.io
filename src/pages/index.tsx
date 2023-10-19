import { type NextPage } from 'next'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'

const Index: NextPage = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

  const { refetch } = trpc.items.getAllItems.useQuery()

  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      deleteAllItemsMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  return (
    <main>
      <div className='flex gap-2'>
        <button
          className='border border-black'
          onClick={() => deleteAllItemsMutation.mutate()}>
          clear
        </button>
      </div>
      <div className='flex'>
        <TrackList
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
        />
        <TrackOptions selectedItemId={selectedItemId} />
      </div>
    </main>
  )
}

export default Index
