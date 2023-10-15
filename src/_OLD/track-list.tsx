import { type ChangeEvent, type FC, useState } from 'react'
import { TdInput } from './td-input'
import { TrackRows } from '@/_OLD/data/track-list/track-rows'
import {
  useTrackList,
  useTrackListAdd
} from '@/_OLD/data/track-list/track-context'

interface TrackListTableProps {}

export const TrackListTable: FC<TrackListTableProps> = () => {
  const [addMltTrkInput, setMltTrkInput] = useState<number>(1)

  const TrackList = useTrackList()
  const setTracks = useTrackListAdd()

  const setTrackAddNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value as unknown as number
    if (input > 1) {
      setMltTrkInput(input)
    } else {
      setMltTrkInput(1)
    }
  }

  const trackTh = `border-[1.5px]
        border-b-transparent
        border-zinc-100
        dark:border-zinc-400
        bg-zinc-200
        dark:bg-zinc-600
        font-bold
        z-50
        dark:font-normal
        p-1
        sticky top-[1rem]
        `

  return (
    <div
      id='TemplateTracks'
      className='MSshowTemplateTracks float-left h-[100%] overflow-y-scroll transition-all duration-1000'>
      <div className='sticky top-0 h-[1rem] w-full bg-stone-300 dark:bg-zinc-800'></div>
      <div className='bg-stone-300 px-4 pb-4 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200'>
        <div
          id='trackList_toolbar'
          className='sticky top-[1rem]'>
          <div className='mb-2 flex h-[35px] max-h-[35px] justify-between align-middle'>
            <button
              className='border-2 border-zinc-900 px-4 text-lg hover:scale-[1.15] hover:animate-pulse hover:border-red-600 dark:border-zinc-200 dark:hover:border-red-600'
              title='Re-number Tracks. CAREFUL'
              id='renumberTracks'
              //onClick={renumberTracks}
            >
              <i className='fa-solid fa-arrow-down-1-9'></i>
            </button>
          </div>
        </div>

        <table className='w-full table-auto border-separate border-spacing-0 text-left md:text-xs lg:text-sm'>
          <thead>
            <tr>
              <th
                className={`${trackTh} w-[05%]`}
                title='Unique Track Number'>
                No.
              </th>
              <th
                className={`${trackTh} w-[45%]`}
                title='Set the MIDI channel for this track or multi.'>
                Name
              </th>
              <th
                className={`${trackTh} w-[10%]`}
                title='Set the NAME for this track or multi.'>
                MIDI Channel
              </th>
              {/*<th
                className={`${trackTh} w-[10%]`}
                title='Set the sampler outputs for this track or multi.'>
                Sampler Outputs
              </th>
              <th
                className={`${trackTh} w-[10%]`}
                title='Set the instance outputs for this track or multi.'>
                Instance Outputs
              </th>*/}
              <th
                className={`${trackTh} w-[10%]`}
                title='Track Delay in ms (may be average)'>
                Delay (ms)
              </th>
              <th
                className={`${trackTh} w-[10%]`}
                title='Edit Track Parameters'>
                <div className='text-center text-xl hover:scale-[1.15] hover:animate-pulse'>
                  <button
                    className=''
                    title={`Add Tracks. (${addMltTrkInput})`}
                    id='addMultipleTracks'
                    onClick={() => setTracks(addMltTrkInput)}>
                    <i className='fa-solid fa-plus mr-2 pl-2'></i>
                  </button>
                  <TdInput
                    td={false}
                    id='addMltTrkInput'
                    title='Set the number of tracks to add.'
                    placeholder='1'
                    onInput={setTrackAddNumber}></TdInput>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {TrackList.map((track) => (
              <TrackRows
                key={track.id}
                id={track.id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
