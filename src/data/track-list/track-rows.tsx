import { type FC, type ReactNode } from 'react'
import { TdSelect } from '@/components/td-select'
import { TdInput } from '@/components/td-input'
import { useSelectedTrackUpdate, useTrackListRemove } from './track-context'
interface TrackRowProps {
  id: string
  children?: ReactNode
}

export const TrackRows: FC<TrackRowProps> = ({ id }) => {
  const changeSelectedTrack = useSelectedTrackUpdate()
  const removeSelectedTrack = useTrackListRemove()

  const nameOption = (
    <TdInput
      td={true}
      id={`trkName_${id}`}
      title='Set the NAME for this track or multi.'
      placeholder='Track Name'
      codeDisabled={false}></TdInput>
  )

  const chnOption = (
    <div title='Set the MIDI channel for this track or multi.'>
      <TdSelect
        id={`trkChn_${id}`}
        options='chnMidiList'></TdSelect>
    </div>
  )

  // const smpOutOption =
  //     <div title="Set the sampler outputs for this track or multi." >
  //         <TdSelect
  //             id={`trkSmpOut_${id}`}
  //             options="smpOutsList">
  //         </TdSelect>
  //     </div >

  // const vepOutOption =
  //     <div title="Set the instance outputs for this track or multi.">
  //         <TdSelect
  //             id={`trkVepOut_${id}`}
  //             options="vepOutsList">
  //         </TdSelect>
  //     </div >

  const trkDelay = <div title='Track Delay in ms (may be average)'></div>
  //will need to brought over from track-settings

  const editTrack = (
    <div className='flex justify-evenly'>
      <button
        className='mr-1 h-6 w-6 hover:border-green-50'
        title='Edit Track Parameters'
        onClick={() => changeSelectedTrack(id)}>
        <i className='fa-solid fa-pen-to-square'></i>
      </button>
      <button
        className='h-6 w-6 hover:scale-[1.15] hover:animate-pulse'
        title='Remove This Track.'
        id={`AddTrackButton_${id}`}
        onClick={() => removeSelectedTrack(id)}>
        <i className='fa-solid fa-minus'></i>
      </button>
    </div>
  )

  const trackTr = `bg-zinc-300        
        dark:bg-stone-800 
        hover:bg-zinc-500 
        dark:hover:bg-zinc-400 
	    hover:text-zinc-50 
        dark:hover:text-zinc-50`

  const trackTd = `border-[1.5px]
        border-zinc-400 
        dark:border-zinc-600
	    p-0.5`

  return (
    <tr
      id={`trk_${id}`}
      className={`${trackTr}`}
      draggable>
      <td
        className={`${trackTd}`}
        id={`trkNumb_${id}`}
        title='Unique Track Number'>
        {parseInt(id)}
      </td>
      <td className={`${trackTd}`}>{nameOption}</td>
      <td className={`${trackTd}`}>{chnOption}</td>
      <td className={`${trackTd}`}>{trkDelay}</td>
      {/* <td className={`${trackTd}`}>{smpOutOption}</td>
            <td className={`${trackTd}`}>{vepOutOption}</td> */}
      <td className={`${trackTd}`}>{editTrack}</td>
    </tr>
  )
}
