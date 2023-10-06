import {
  type FC,
  useState,
  ChangeEvent,
  Fragment,
  type Dispatch,
  type SetStateAction
} from 'react'
import { TdSwitch } from '@/components/td-switch'
import { TdInput } from '@/components/td-input'
import { TdSelect } from '@/components/td-select'
import { RangeRows } from './range-rows'
import {
  useSelectedArtList,
  useSelectedArtListRemove
} from '@/data/track-list/track-context'

interface ArtSettingsRowProps {
  id: string
  toggle?: boolean
  setAvgDelAvail: Dispatch<SetStateAction<boolean>>
  baseDelay: number
}

export const ArtSettingsRow: FC<ArtSettingsRowProps> = ({
  baseDelay,
  setAvgDelAvail,
  id,
  toggle
}) => {
  const ArtList = useSelectedArtList()
  const removeArt = useSelectedArtListRemove()

  const [rngTitle, setRngTitle] = useState<string>(
    'Switch to independent playable range.'
  )
  const [rngVisible, setRngVisible] = useState<boolean>(false)
  const [rngChecked, setRngChecked] = useState<boolean>(false)

  const [valueMidi, setMidi] = useState<string>('valMidiList')
  const [valueCodeMidi, setCodeMidi] = useState<string>('valMidiList')

  const [artCodeDisabled, setArtCodeDisabled] = useState<boolean>(false)

  const artTypeTitle: string = 'Select the TYPE of code for this patch.'
  const artCodeTitle: string = 'Set the CODE for this patch. (i.e. CC58)'
  const artDeftTitle: string = 'Set the DEFAULT setting for this patch.'

  const artToggleNameTitle: string =
    'Set the NAME for this patch. (i.e Legato On/OFF)'
  const artToggleOnTitle: string =
    'Set the ON setting for this patch. (i.e. CC58, Value 76)'

  const artSwitchNameTitle: string =
    'Set the NAME for this patch. (i.e Staccato)'
  const artSwitchOnTitle: string =
    'Set the ON setting for this patch. (i.e. CC58, Value 21)'

  // const artDeftChecked: boolean =
  //     ArtList![ArtList!.findIndex(function (art) { return art.id === id })].default

  const rangeOptionChange = () => {
    if (rngChecked) {
      setRngChecked(false)
      setRngVisible(false)
      setRngTitle('Switch to independent playable range.')
    } else {
      setRngChecked(true)
      setRngVisible(true)
      setRngTitle('Switch to same playable range as default.')
    }
  }

  const deftPatchChange = () => {
    // setArts!(prevState => {
    //     const newState = prevState.map(obj => {
    //         if (obj.id === id) {
    //             return { ...obj, default: true };
    //         }
    //         if (obj.default === true) { //some obj.default will be 'on' or 'off'
    //             return { ...obj, default: false };
    //         }
    //         return obj;
    //     });
    //     return newState;
    // });
  }

  const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const switchChecked = document.getElementById(
      `artSwitchTypes_${id}`
    ) as HTMLInputElement
    setMidi('valMidiList')
    setCodeMidi('valMidiList')

    if (event.target.value === '/note') {
      setMidi('valNoteList')
      setCodeMidi('valNoteList')
    }
    if (event.target.value === '/pitch') {
      setMidi('valPtchList')
      setCodeMidi('valPtchList')
    }

    switchTypeChange(switchChecked.checked)
  }

  const switchTypeChange = (isChecked: boolean) => {
    const typeValue = document.getElementById(
      `artType_${id}`
    ) as HTMLSelectElement

    if (isChecked) {
      setArtCodeDisabled(false)
      if (typeValue.value === '/note') {
        setMidi('valMidiList')
      }
    } else {
      setArtCodeDisabled(true)
      if (typeValue.value === '/note') {
        setMidi('valNoteList')
      }
    }
  }

  const delayChange = (event: ChangeEvent<HTMLInputElement>) => {
    const y = event.target.value
    const x: number = parseInt(y)

    // setArts!(prevState => {
    //     const newState = prevState.map(obj => {
    //         if (obj.id === id) {
    //             return { ...obj, delay: x };
    //         }
    //         return obj;
    //     });
    //     return newState;
    // });
    setAvgDelAvail(true)
  }

  const rangeOption = (
    <Fragment>
      <div title={rngTitle}>
        <input
          type='checkbox'
          className='min-w-full cursor-pointer'
          checked={rngChecked}
          onChange={rangeOptionChange}
          title={rngTitle}
          id={`ArtRangeOption_${id}`}></input>
      </div>
    </Fragment>
  )

  const nameOption = (
    <TdInput
      td={true}
      id={`artName_${id}`}
      title={toggle ? artToggleNameTitle : artSwitchNameTitle}
      placeholder='Articulation Name'
      codeDisabled={false}></TdInput>
  )

  const typeOption = (
    <div title={artTypeTitle}>
      <TdSelect
        id={`artType_${id}`}
        options='valAddrList'
        onSelect={typeChange}></TdSelect>
    </div>
  )

  const changeOption = (
    <TdSwitch
      id={`artSwitchTypes_${id}`}
      title='Switch between Value 1-Based and Value 2-Based Changes.'
      a='V1'
      b='V2'
      defaultVal='b'
      artFad={true}
      toggle={toggle}
      showVals={true}
      onSwitch={switchTypeChange}></TdSwitch>
  )

  const codeOption = (
    <div title={artCodeTitle}>
      <TdSelect
        id={`artCode_${id}`}
        options={valueCodeMidi}
        codeDisabled={artCodeDisabled}></TdSelect>
    </div>
  )

  const onOption = (
    <div title={toggle ? artToggleOnTitle : artSwitchOnTitle}>
      <TdSelect
        id={`ArtOn___${id}`}
        options={valueMidi}></TdSelect>
    </div>
  )

  const offOption = (
    <div title='Set the OFF setting for this patch. (i.e. CC58, Value 81)'>
      <TdSelect
        id={`ArtOff__${id}`}
        options={valueMidi}></TdSelect>
    </div>
  )

  const deftSelect = (
    <div title={artDeftTitle}>
      <TdSelect
        id={`artDeft_${id}`}
        options={'valDeftList'}></TdSelect>
    </div>
  )

  const deftCheck = (
    <div title='Set this as the default patch.'>
      <input
        type='checkbox'
        className='min-w-full cursor-pointer'
        checked={
          ArtList![
            ArtList!.findIndex(function (art) {
              return art.id === id
            })
          ]?.default as boolean
        }
        onChange={deftPatchChange}
        title='Set this as the default patch.'
        aria-label='Set this as the default patch.'
        id={`artDeftOption_${id}`}></input>
    </div>
  )

  const trkDelay = (
    <div>
      <TdInput
        td={true}
        id={`trkDelay_art_${id}`}
        title='Set the track delay for this patch in ms.'
        placeholder={`${baseDelay}`}
        valueType='number'
        onInput={delayChange}></TdInput>
    </div>
  )

  const addArts = (
    <div className='text-center'>
      <button
        className='h-6 w-6 hover:scale-[1.15] hover:animate-pulse'
        title='Remove This Articulation.'
        id={`AddArtButton_${id}`}
        onClick={() => removeArt(id)}>
        <i className='fa-solid fa-minus'></i>
      </button>
    </div>
  )

  const settingsTr = `bg-zinc-300 
        dark:bg-stone-800 
        hover:bg-zinc-500 
        dark:hover:bg-zinc-400 
        hover:text-zinc-50 
        dark:hover:text-zinc-50`

  const settingsTd = `border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

  return (
    <Fragment>
      <tr
        id={`art_${id}`}
        className={`${settingsTr}`}
        draggable>
        <td
          className={`${settingsTd}`}
          id={`artNumb_${id}`}
          title={`Articulation No. ${parseInt(id)}`}>
          {parseInt(id)}
        </td>
        <td className={`${settingsTd}`}>{nameOption}</td>
        <td className={`${settingsTd}`}>{typeOption}</td>
        <td className={`${settingsTd}`}>{codeOption}</td>
        <td className={`${settingsTd}`}>{onOption}</td>
        <td className={`${settingsTd}`}>{toggle ? offOption : rangeOption}</td>
        <td className={`${settingsTd}`}>{toggle ? deftSelect : deftCheck}</td>
        <td className={`${settingsTd}`}>{trkDelay}</td>
        <td className={`${settingsTd}`}>{changeOption}</td>
        <td className={`${settingsTd}`}>{addArts}</td>
      </tr>
      {rngVisible ? <RangeRows id={id} /> : null}
    </Fragment>
  )
}
