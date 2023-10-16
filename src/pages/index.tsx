import { Test5 } from '@/components/test5'
import { trpc } from '@/utils/trpc'
import { type NextPage } from 'next'

const Index: NextPage = () => {
  const { data, refetch } = trpc.items.getAllItems.useQuery()
  const createMutation = trpc.items.createSingleItem.useMutation({
    onSuccess: () => {
      createMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const createNewRangeMutation = trpc.items.addSingleFullRange.useMutation({
    onSuccess: () => {
      createNewRangeMutation.reset()
      refetch()
    },
    onError: () => {
      alert('There was an error submitting your request. Please try again.')
    }
  })

  const deleteSingleFullRangeMutation =
    trpc.items.deleteSingleFullRange.useMutation({
      onSuccess: () => {
        deleteSingleFullRangeMutation.reset()
        refetch()
      },
      onError: (error) => {
        alert(
          error ??
            'There was an error submitting your request. Please try again.'
        )
      }
    })

  const clearMutation = trpc.items.deleteAllItems.useMutation({
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
          onClick={() =>
            createNewRangeMutation.mutate({
              itemId: data![0]?.itemId ?? ''
            })
          }>
          new range
        </button>
        <button
          className='border border-black'
          onClick={() =>
            deleteSingleFullRangeMutation.mutate({
              rangeId: data![0]?.fullRange[0]?.rangeId ?? '',
              fileItemsItemId: data![0]?.itemId ?? ''
            })
          }>
          delete 1st range
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
