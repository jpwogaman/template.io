import { Test5 } from '@/components/test5'
import { trpc } from '@/utils/trpc'
import { type NextPage } from 'next'

const Index: NextPage = () => {
  const { data, refetch } = trpc.items.getAllItems.useQuery()
  const createMutation = trpc.items.createItem.useMutation({
    onSuccess: () => {
      createMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })
  const clearMutation = trpc.items.clearAllItems.useMutation({
    onSuccess: () => {
      clearMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  return (
    <main>
      <div>{data?.length}</div>
      <div className='flex gap-2'>
        <button
          className='border border-black'
          onClick={() => clearMutation.mutate()}>
          clear
        </button>
        <button
          className='border border-black'
          onClick={() => createMutation.mutate()}>
          new item
        </button>
      </div>
      <div>
        <h1>Items</h1>
        <pre className='text-xs'>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  )

  //<Test5 />
}

export default Index
