import { TdSelect } from './td-select'
import { IconBtnToggle } from '../components/icon-btn-toggle'
import { TdInput } from './td-input'
import { type ChangeEvent, type FC, useState } from 'react'
import { FaderData } from '@/_OLD/data/track-settings/fad-data'
import {
  ArtToggleData,
  ArtSwitchData
} from '@/_OLD/data/track-settings/art-data'
import {
  type TrackListProps,
  useSelectedTrack,
  useSelectedArtListAdd,
  useSelectedArtList
} from '@/_OLD/data/track-list/track-context'
interface TrackSettingsProps {}

export const TrackSettings: FC<TrackSettingsProps> = () => {
  const ArtList = useSelectedArtList()
  const addArt = useSelectedArtListAdd()
  const selectedTrack = useSelectedTrack()

  const [FaderList, setFaders] = useState<TrackListProps['fadList']>(
    selectedTrack.fadList
  )

  const addFader = () => {
    const lastFadId = FaderList[FaderList?.length - 1]?.id

    if (FaderList.length > 11) {
      return alert('Are you sure you need this many faders?')
    }

    const newfadIdNumb: number = parseInt(lastFadId as string) + 1
    const newfadIdStr: string = newfadIdNumb.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })
    const newFader = {
      id: newfadIdStr,
      name: undefined,
      codeType: undefined,
      code: undefined,
      default: undefined,
      changeType: undefined
    }
    setFaders([...FaderList, newFader])
  }

  const [baseDelay, setBaseDelay] = useState<number>(0)
  const [avgTrkDel, setAvgTrkDel] = useState<number | string>(0)
  const [avgDelAvail, setAvgDelAvail] = useState<boolean>(false)

  const baseDelayChange = (event: ChangeEvent<HTMLInputElement>) => {
    const y = event.target.value
    const x: number = parseInt(y)
    const trkDelArray: number[] = [x]

    for (const element of ArtList) {
      trkDelArray.push(element?.delay)
    }

    const trkDelTotal: number = trkDelArray.reduce((a, b) => a + b, 0)
    const newAvgNumb: number = trkDelTotal / trkDelArray.length
    const newAvgStr: string =
      newAvgNumb % 1 === 0 ? newAvgNumb.toFixed(0) : newAvgNumb.toFixed(2)

    setAvgTrkDel(newAvgStr)
    setBaseDelay(x)

    // if (!avgDelAvail) {
    //     setSelectedDelay(`${trkDelTotal}`)
    // } else {
    //     setSelectedDelay(`~${newAvgStr}/${trkDelArray.length}`)
    // }
  }

  const delayChangeClickTest = () => {}

  const [FullRangeList, setFullRanges] = useState<TrackListProps['fullRange']>(
    selectedTrack.fullRange
  )

  const onlyRange: boolean = FullRangeList?.length > 1

  const addFullRange = (trkId: string, fullRangeId: string) => {
    const newFullRangeIdNumb: number = parseInt(fullRangeId) + 1

    const newFullRangeIdStr: string = newFullRangeIdNumb.toLocaleString(
      'en-US',
      {
        minimumIntegerDigits: 2,
        useGrouping: false
      }
    )
    const newFullRange = {
      id: newFullRangeIdStr,
      name: undefined,
      low: undefined,
      high: undefined,
      whiteKeysOnly: false
    }

    setFullRanges([...FullRangeList, newFullRange])
  }

  const removeFullRange = (artId: string, fullRangeId: string) => {
    if (FullRangeList?.length !== 1) {
      setFullRanges(
        FullRangeList?.filter((fullRange) => fullRange.id !== fullRangeId)
      )
    }
  }

  const closeSettingsWindow = () => {
    document
      .getElementById('TemplateTrackSettings')!
      .classList.replace('MSshow', 'MShide')
    document
      .getElementById('TemplateTracks')!
      .classList.replace('MSshowTemplateTracks', 'MShideTemplateTracks')
  }

  const toggleLock = () => {
    console.log('lock')
  }

  const settingsTh = `border-2 
        border-zinc-100 
        border-b-transparent 
        dark:border-zinc-400 
        dark:border-b-transparent
        bg-zinc-200 
        dark:bg-zinc-600
        font-bold 
        dark:font-normal
        p-1`

  const rangeTr = `bg-stone-300
        dark:bg-zinc-800
        ${onlyRange ? 'bg-zinc-300 dark:bg-stone-800' : null}`

  const rangeTd = `border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

  return (
    <div
      id='TemplateTrackSettings'
      className='MSshow z-50 h-[100%] overflow-y-scroll bg-stone-300 p-4 text-zinc-900 transition-all duration-1000 dark:bg-zinc-800 dark:text-zinc-200'>
      <div className='justify-space flex align-middle'>
        <button
          className='h-[40px] w-[40px] border-2 border-zinc-900 text-xl hover:scale-[1.15] hover:animate-pulse dark:border-zinc-200'
          title='Close the Track Settings Window.'
          id='editClose'
          onClick={closeSettingsWindow}>
          <i className='fa-solid fa-xmark'></i>
        </button>
        <IconBtnToggle
          classes='w-[40px] h-[40px] mx-2 border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse'
          titleA='Lock the Settings for this Track.'
          titleB='Unlock the Settings for this Track.'
          id='editLock'
          a='fa-solid fa-lock-open'
          b='fa-solid fa-lock'
          defaultIcon='a'
          onToggleA={toggleLock}
          onToggleB={toggleLock}></IconBtnToggle>
        <button
          className='h-[40px] w-[40px] border-2 border-zinc-900 hover:scale-[1.15] hover:animate-pulse dark:border-zinc-200'
          title='Save the Settings for this Track.'
          id='editSave'
          onClick={delayChangeClickTest}>
          <i className='fa-solid fa-save'></i>
        </button>
      </div>
      <h2
        id='trkEditDisplay'
        className='my-2'>{`Track ${parseInt(selectedTrack.id)}: ${
        selectedTrack.name ?? ''
      }`}</h2>
      <div
        className={`flex text-xs xl:text-lg ${
          onlyRange ? 'bg-zinc-300 dark:bg-stone-800' : null
        }`}>
        <p className='py-1'>Playable Ranges: </p>
        <table className=''>
          <tbody>
            {FullRangeList?.map((range) => (
              <tr
                key={`FullRange_trk_${parseInt(selectedTrack.id)}_${range.id}`}
                id={`FullRange_trk_${parseInt(selectedTrack.id)}_${range.id}`}
                className={`${rangeTr}`}>
                <td className={`pr-2`}>
                  <TdInput
                    td={true}
                    id={`FullRangeName_trk_${parseInt(selectedTrack.id)}_${
                      range.id
                    }`}
                    title='Describe this range-group. (i.e hits/rolls)'
                    placeholder='Range Description'
                    defaultValue={onlyRange ? undefined : 'Full Range'}
                    codeDisabled={false}></TdInput>
                </td>
                <td className={`${rangeTd}`}>
                  <TdSelect
                    id={`FullRngBot_trk_${parseInt(selectedTrack.id)}_${
                      range.id
                    }`}
                    options='allNoteList'></TdSelect>
                </td>
                <td className={`px-2 text-center`}>
                  <i className='fas fa-arrow-right-long' />
                </td>
                <td className={`${rangeTd}`}>
                  <TdSelect
                    id={`FullRngTop_trk_${parseInt(selectedTrack.id)}_${
                      range.id
                    }`}
                    options='allNoteList'></TdSelect>
                </td>
                <td className={`px-2 text-center`}>
                  <IconBtnToggle
                    classes='h-6 hover:scale-[1.15] hover:animate-pulse'
                    titleA='Add another set of playable ranges.'
                    titleB='Remove this set of playable ranges.'
                    id={`FullRangeAddButton_trk_${parseInt(selectedTrack.id)}_${
                      range.id
                    }`}
                    a='fa-solid fa-plus'
                    b='fa-solid fa-minus'
                    defaultIcon='a'
                    onToggleA={() =>
                      addFullRange(`${parseInt(selectedTrack.id)}`, range.id)
                    }
                    onToggleB={() =>
                      removeFullRange(`${parseInt(selectedTrack.id)}`, range.id)
                    }></IconBtnToggle>
                </td>
                <td>
                  <input
                    type='checkbox'
                    className='mt-[6px] h-4 min-w-full cursor-pointer'
                    checked={range.whiteKeysOnly}
                    onChange={toggleLock}
                    title='This playable range is white keys only. '
                    aria-label='This playable range is white keys only.'
                    id={`FullRangeWhiteKeysCheck_trk_${parseInt(
                      selectedTrack.id
                    )}_${range.id}`}></input>
                </td>
                <td className='px-2 text-xs'>
                  <p>white-keys-only</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='my-2 flex items-center text-xs xl:text-lg'>
        <p>Base Track Delay (ms):</p>
        <div>
          <TdInput
            td={false}
            id={`baseDelay_trk_${parseInt(selectedTrack.id)}`}
            title='Set the base track delay in ms for this track.'
            placeholder='0'
            valueType='number'
            onInput={baseDelayChange}></TdInput>
        </div>
      </div>
      <div
        className={`items-center text-xs xl:text-lg ${
          !avgDelAvail ? 'hidden' : 'flex'
        }`}>
        <p>Avg. Track Delay (ms):</p>
        <div>
          <TdInput
            id={`avgDelay_trk_${parseInt(selectedTrack.id)}`}
            title='The average delay in ms for this track.'
            placeholder={avgTrkDel as unknown as string}
            defaultValue={avgTrkDel as unknown as number}
            onReceive={avgTrkDel as unknown as number}
            td={true}
            valueType='number'
            codeDisabled={true}></TdInput>
        </div>
      </div>

      <h4 className='mb-2 mt-5'>Faders</h4>

      <table className='w-full table-fixed text-left md:text-xs xl:text-sm'>
        <thead>
          <tr>
            <th
              className={`${settingsTh} w-[05%]`}
              title='Fader Number'>
              No.
            </th>
            <th
              className={`${settingsTh} w-[20%]`}
              title='Set the NAME for this parameter. (i.e Dynamics)'>
              Name
            </th>
            <th
              className={`${settingsTh} w-[20%]`}
              title='Select the TYPE of code for this parameter.'>
              Code Type
            </th>
            <th
              className={`${settingsTh} w-[17.5%]`}
              title='Set the CODE for this patch. (i.e. CC11)'>
              Code
            </th>
            <th
              className={`${settingsTh} w-[17.5%]`}
              title='Set the default patch.'>
              Default
            </th>
            <th
              className={`${settingsTh} w-[15%]`}
              title='Switch between Value 1-Based and Value 2-Based Changes'>
              Change Type
            </th>
            <th
              className={`${settingsTh} w-[05%] text-center`}
              title=''>
              <button
                className='h-full w-full text-base hover:scale-[1.15] hover:animate-pulse'
                title='Add Another Fader.'
                id='addFader'
                onClick={addFader}>
                <i className='fa-solid fa-plus'></i>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <FaderData
            setFaders={setFaders}
            selectedTrack={selectedTrack}
          />
        </tbody>
      </table>
      <h4 className='mb-2 mt-5'>Articulations (toggle)</h4>
      <table className='w-full table-fixed text-left md:text-xs xl:text-sm'>
        <thead>
          <tr>
            <th
              className={`${settingsTh} w-[05%]`}
              title='Articulation Number'>
              No.
            </th>
            <th
              className={`${settingsTh} w-[20%]`}
              title='Set the NAME for this patch. (i.e Legato On/OFF)'>
              Name
            </th>
            <th
              className={`${settingsTh} w-[20%]`}
              title='Select the TYPE of code for this patch.'>
              Code Type
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the CODE for this patch. (i.e. CC58)'>
              Code
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the ON setting for this patch. (i.e. CC58, Value 76)'>
              {' '}
              On
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the OFF setting for this patch. (i.e. CC58, Value 81)'>
              {' '}
              Off
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the DEFAULT default setting for this patch.'>
              {' '}
              Default
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the track delay for this patch in ms.'>
              Delay
            </th>
            <th
              className={`${settingsTh} w-[15%]`}
              title='Switch between Value 1-Based and Value 2-Based Changes'>
              {' '}
              Change Type
            </th>
            <th
              className={`${settingsTh} w-[05%] text-center`}
              title=''>
              <button
                className='h-full w-full text-base hover:scale-[1.15] hover:animate-pulse'
                title='Add Another Toggle Articulation.'
                id='addToggleArticulation'
                onClick={() => addArt(true)}>
                <i className='fa-solid fa-plus'></i>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <ArtToggleData
            setAvgDelAvail={setAvgDelAvail}
            baseDelay={baseDelay}
          />
        </tbody>
      </table>
      <h4 className='mb-2 mt-5'>Articulations (switch)</h4>
      <table className='w-full table-fixed text-left md:text-xs xl:text-sm'>
        <thead>
          <tr>
            <th
              className={`${settingsTh} w-[05%]`}
              title='Articulation Number'>
              No.
            </th>
            <th
              className={`${settingsTh} w-[20%]`}
              title='Set the NAME for this patch. (i.e Staccato)'>
              Name
            </th>
            <th
              className={`${settingsTh} w-[20%]`}
              title='Select the TYPE of code for this patch.'>
              Code Type
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the CODE for this patch. (i.e. CC58)'>
              Code
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the ON setting for this patch. (i.e. CC58, Value 21)'>
              On
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the number of playable ranges for this patch.'>
              Range
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the default patch.'>
              Default
            </th>
            <th
              className={`${settingsTh} w-[07%]`}
              title='Set the track delay for this patch in ms.'>
              Delay
            </th>
            <th
              className={`${settingsTh} w-[15%]`}
              title='Switch between Value 1-Based and Value 2-Based Changes'>
              Change Type
            </th>
            <th
              className={`${settingsTh} w-[05%] text-center`}
              title=''>
              <button
                className='h-full w-full text-base hover:scale-[1.15] hover:animate-pulse'
                title='Add Another Switch Articulation.'
                id='addSwitchArticulation'
                onClick={() => addArt(false)}>
                <i className='fa-solid fa-plus'></i>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <ArtSwitchData
            setAvgDelAvail={setAvgDelAvail}
            baseDelay={baseDelay}
          />
        </tbody>
      </table>
    </div>
  )
}
