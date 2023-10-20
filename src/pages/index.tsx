import { type NextPage } from 'next'
import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import TrackList from '@/components/trackList'
import TrackOptions from '@/components/trackOptions'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { useTheme } from 'next-themes'

const Index: NextPage = () => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const { setTheme } = useTheme()

  const { refetch: allRefetch, data } = trpc.items.getAllItems.useQuery()
  const { refetch: selectedRefetch } = trpc.items.getSingleItem.useQuery({
    itemId: selectedItemId ?? ''
  })

  const dataLength = data?.length ?? 0

  const deleteAllItemsMutation = trpc.items.deleteAllItems.useMutation({
    onSuccess: () => {
      deleteAllItemsMutation.reset()
      allRefetch()
      selectedRefetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  return (
    <div className='h-screen'>
      <nav className='container sticky top-0 z-50 max-h-[40px] min-w-full items-center bg-zinc-900'>
        <ul className='flex justify-between'>
          <li className='block w-60 p-2 pl-5 text-left text-zinc-200'>
            {dataLength} {dataLength > 1 ? 'Tracks' : 'Track'}
          </li>
          <li className='block w-60 p-2 pl-5 text-left text-zinc-200'>
            <button
              className='border px-2'
              onClick={() => deleteAllItemsMutation.mutate()}>
              Flush DB / Clear All
            </button>
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
              onToggleB={() => setTheme('light')}
            />
          </li>
        </ul>
      </nav>
      <main className='flex h-[calc(100%-40px)]'>
        <TrackList
          selectedItemId={selectedItemId}
          setSelectedItemId={setSelectedItemId}
        />
        <TrackOptions selectedItemId={selectedItemId} />
      </main>
    </div>
  )
}

export default Index
