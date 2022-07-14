import { FC, useState, ChangeEvent, Fragment, Dispatch, SetStateAction } from "react";
import { TdSwitch } from "../../components/checkbox-switch";
import { TdInput } from "../../components/input";
import { TdSelect } from "../../components/select";
import { RangeRows } from "./art-rows-ranges"

interface ArtSettingsRowProps {
    id: string;
    toggle?: boolean;
    setDelays?: Dispatch<SetStateAction<any[]>>;
    delayList?: any[];
}

export const ArtSettingsRow: FC<ArtSettingsRowProps> = ({ delayList, setDelays, id, toggle }) => {

    const [rngTitle, setRngTitle] = useState<string>("Switch to independent playable range.")
    const [rngVisible, setRngVisible] = useState<boolean>(false)
    const [rngChecked, setRngChecked] = useState<boolean>(false)

    const [valueMidi, setMidi] = useState<string>("valMidiList")
    const [valueCodeMidi, setCodeMidi] = useState<string>("valMidiList")

    const [artCodeDisabled, setArtCodeDisabled] = useState<boolean>(false)
    const [artDeftChecked, setArtDeftChecked] = useState<boolean>(false)
    const artTypeTitle: string = "Select the TYPE of code for this patch."
    const artCodeTitle: string = "Set the CODE for this patch. (i.e. CC58)"
    const artDeftTitle: string = "Set the DEFAULT setting for this patch."

    const artToggleNameTitle: string = "Set the NAME for this patch. (i.e Legato On/OFF)"
    const artToggleOnTitle: string = "Set the ON setting for this patch. (i.e. CC58, Value 76)"

    const artSwitchNameTitle: string = "Set the NAME for this patch. (i.e Staccato)"
    const artSwitchOnTitle: string = "Set the ON setting for this patch. (i.e. CC58, Value 21)"

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
        if (artDeftChecked) {
            setArtDeftChecked(false)
        } else {
            setArtDeftChecked(true)
        }
    }

    const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {

        const switchChecked = document.getElementById(`artSwitchTypes_${id}`) as HTMLInputElement
        setMidi("valMidiList")
        setCodeMidi("valMidiList")

        if (event.target.value === "/note") {
            setMidi("valNoteList")
            setCodeMidi("valNoteList")
        }
        if (event.target.value === "/pitch") {
            setMidi("valPtchList")
            setCodeMidi("valPtchList")
        }

        switchTypeChange(switchChecked.checked)
    };

    const switchTypeChange = (isChecked: boolean) => {

        const typeValue = document.getElementById(`artType_${id}`) as HTMLSelectElement

        if (isChecked) {
            setArtCodeDisabled(false)
            if (typeValue.value === "/note") {
                setMidi("valMidiList")
            }
        } else {
            setArtCodeDisabled(true)
            if (typeValue.value === "/note") {
                setMidi("valNoteList")
            }
        }
    }

    const delayChange = (event: ChangeEvent<HTMLInputElement>) => {

        const newDelay = { id: `art_${id}`, delay: event.target.value as unknown as number }
        if (setDelays) { setDelays!([...(delayList || []), newDelay]) }
        else return
    }

    const rangeOption =
        <Fragment>
            <div title={rngTitle}>
                <input
                    type="checkbox"
                    className='min-w-full cursor-pointer'
                    checked={rngChecked}
                    onChange={rangeOptionChange}
                    title={rngTitle}
                    aria-label="Does this patch have the same playable range as the default?"
                    id={`ArtRangeOption_${id}`}>
                </input>
            </div>
        </Fragment>

    const nameOption =
        <TdInput
            id={`artName_${id}`}
            title={toggle ? artToggleNameTitle : artSwitchNameTitle}
            placeholder='Articulation Name'
            codeDisabled={false}>
        </TdInput>

    const typeOption =
        <div title={artTypeTitle}>
            <TdSelect id={`artType_${id}`} options='valAddrList' onSelect={typeChange}></TdSelect>
        </div>

    const changeOption =
        <TdSwitch
            id={`artSwitchTypes_${id}`}
            title="Switch between Value 1-Based and Value 2-Based Changes."
            a="V1"
            b="V2"
            defaultVal="b"
            artFad={true}
            toggle={toggle}
            showVals={true}
            onSwitch={switchTypeChange}>
        </TdSwitch>

    const codeOption =
        <div title={artCodeTitle}>
            <TdSelect id={`artCode_${id}`} options={valueCodeMidi} codeDisabled={artCodeDisabled}></TdSelect>
        </div>

    const onOption =
        <div title={toggle ? artToggleOnTitle : artSwitchOnTitle}>
            <TdSelect id={`ArtOn___${id}`} options={valueMidi}></TdSelect>
        </div>

    const offOption =
        <div title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" >
            <TdSelect id={`ArtOff__${id}`} options={valueMidi}></TdSelect>
        </div >

    const deftSelect =
        <div title={artDeftTitle}>
            <TdSelect id={`artDeft_${id}`} options={"valDeftList"}></TdSelect>
        </div >

    const deftCheck =
        <div title="Set this as the default patch.">
            <input
                type="checkbox"
                className='min-w-full cursor-pointer'
                checked={artDeftChecked}
                onChange={deftPatchChange}
                title="Set this as the default patch."
                aria-label="Set this as the default patch."
                id={`artDeftOption_${id}`}>
            </input>
        </div>

    const trkDelay =
        <div>
            <TdInput
                id={`trkDelay_art_${id}`}
                title="Set the track delay for this patch."
                placeholder="0"
                onInput={delayChange}>
            </TdInput>
        </div>

    const settingsTr =
        `bg-zinc-300 
        dark:bg-stone-800 
        hover:bg-zinc-500 
        dark:hover:bg-zinc-400 
        hover:text-zinc-50 
        dark:hover:text-zinc-50`

    const settingsTd =
        `border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

    return (
        <Fragment>
            <tr id={`art_${id}`} className={`${settingsTr}`}>
                <td className={`${settingsTd}`} id={`artNumb_${id}`} title={`Articulation No. ${parseInt(id)}`}>{parseInt(id)}</td>
                <td className={`${settingsTd}`}>{nameOption}</td>
                <td className={`${settingsTd}`}>{typeOption}</td>
                <td className={`${settingsTd}`}>{codeOption}</td>
                <td className={`${settingsTd}`}>{onOption}</td>
                <td className={`${settingsTd}`}>{toggle ? offOption : rangeOption}</td>
                <td className={`${settingsTd}`}>{toggle ? deftSelect : deftCheck}</td>
                <td className={`${settingsTd}`}>{trkDelay}</td>
                <td className={`${settingsTd}`}>{changeOption}</td>
            </tr>
            {rngVisible ? <RangeRows id={id}></RangeRows> : null}
        </Fragment>
    );
};