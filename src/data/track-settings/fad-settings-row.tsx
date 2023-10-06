import { type FC, useState, type ChangeEvent, Fragment } from 'react'
import { IconBtnToggle } from '@/components/icon-btn-toggle'
import { TdSwitch } from '@/components/td-switch'
import { TdInput } from '@/components/td-input'
import { TdSelect } from '@/components/td-select'

interface FadSettingsRowProps {
  id: string
  onDelete?: () => void | undefined
}

export const FadSettingsRow: FC<FadSettingsRowProps> = ({ onDelete, id }) => {
  const [codeDisabled, setCodeDisabled] = useState<boolean>(false)
  const nameFadTitle: string = 'Set the NAME for this parameter. (i.e Dynamics)'
  const typeCodeFad: string = 'Select the TYPE of code for this parameter.'
  const codeFadTitle: string = 'Set the CODE for this parameter. (i.e CC11)'
  const deftTitleFad: string = 'Set the DEFAULT value for this parameter.'

  const [valueMidi, setMidi] = useState<string>('valMidiList')
  const [valueCodeMidi, setCodeMidi] = useState<string>('valMidiList')

  const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const switchChecked = document.getElementById(
      `fadSwitchTypes_${id}`
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
      `fadType_${id}`
    ) as HTMLSelectElement

    if (isChecked) {
      setCodeDisabled(false)
      if (typeValue.value === '/note') {
        setMidi('valMidiList')
      }
    } else {
      setCodeDisabled(true)
      if (typeValue.value === '/note') {
        setMidi('valNoteList')
      }
    }
  }

  const nameOption = (
    <TdInput
      td={true}
      id={`fadName_${id}`}
      title={nameFadTitle}
      placeholder='Fader Name'
      codeDisabled={false}></TdInput>
  )

  const typeOption = (
    <div title={typeCodeFad}>
      <TdSelect
        id={`fadType_${id}`}
        options='valAddrList'
        onSelect={typeChange}></TdSelect>
    </div>
  )

  const changeOption = (
    <TdSwitch
      id={`fadSwitchTypes_${id}`}
      title='Switch between Value 1-Based and Value 2-Based Changes.'
      a='V1'
      b='V2'
      defaultVal='b'
      showVals={true}
      onSwitch={switchTypeChange}></TdSwitch>
  )

  const codeOption = (
    <div title={codeFadTitle}>
      <TdSelect
        id={`fadCode_${id}`}
        options={valueCodeMidi}
        codeDisabled={codeDisabled}></TdSelect>
    </div>
  )

  const deftSelect = (
    <div title={deftTitleFad}>
      <TdSelect
        id={`fadDeft_${id}`}
        options={valueMidi}></TdSelect>
    </div>
  )

  const addFaders = (
    <div className='text-center'>
      <button
        className='h-6 w-6 hover:scale-[1.15] hover:animate-pulse'
        title='Remove This Fader.'
        id={`AddFaderButton_${id}`}
        onClick={onDelete}>
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
        id={`$fad_${id}`}
        className={`${settingsTr}`}
        draggable>
        <td
          className={`${settingsTd}`}
          id={`FadNumb_${id}`}
          title={`Fader No. ${parseInt(id)}`}>
          {parseInt(id)}
        </td>
        <td className={`${settingsTd}`}>{nameOption}</td>
        <td className={`${settingsTd}`}>{typeOption}</td>
        <td className={`${settingsTd}`}>{codeOption}</td>
        <td className={`${settingsTd}`}>{deftSelect}</td>
        <td className={`${settingsTd}`}>{changeOption}</td>
        <td className={`${settingsTd}`}>{addFaders}</td>
      </tr>
    </Fragment>
  )
}
