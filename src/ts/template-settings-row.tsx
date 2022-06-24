import { FC, useState, ChangeEvent, Fragment } from "react";
import { numListMidi, numListCode, ptchListCode, numListAll } from "./template-arrays";

interface SettingsRowProps {
    id: string;
    type: string;
    variant: string | undefined;
}

const SettingsRow: FC<SettingsRowProps> = ({ id, type, variant }) => {

    const [valueType, setType] = useState<string>("")
    const [valueCode, setCode] = useState<string>("")
    const [valueOn, setOn] = useState<string>("")
    const [valueOff, setOff] = useState<string>("")
    const [valueDeft, setDeft] = useState<string>("")
    const [valueName, setName] = useState<string>("")
    const [checkVelTitle, setVelTitle] = useState<string>("Switch to Velocity-Based Changes")
    const [checkRngTitle, setRngTitle] = useState<string>("Switch to independent playable range.")
    const [codeDisabled, setCodeDisabled] = useState<boolean>(false)
    const [showRngSelect, setRngSelect] = useState<boolean>(false)
    const [isChecked, setChecked] = useState<boolean>(false)
    const [isChecked2, setChecked2] = useState<boolean>(false)

    const nameArtTitle: string = "Set the NAME for this patch. (i.e Legato On/OFF)"
    const nameArtTitle2: string = "Set the NAME for this patch. (i.e Staccato)"
    const nameFadTitle: string = "Set the NAME for this parameter. (i.e Dynamics)"
    const codeArtTitle: string = "Set the CODE for this patch. (i.e. CC58)"
    const codeOnArt: string = "Set the ON setting for this patch. (i.e. CC58, Value 76)"
    const codeOnArt2: string = "Set the ON setting for this patch. (i.e. CC58, Value 21)"
    const codeFadTitle: string = "Set the CODE for this parameter. (i.e CC11)"
    const togArt: boolean = variant === "tog" ? true : false
    const artFad: boolean = type === "art" ? true : false

    const [valueMidi, setMidi] = useState<JSX.Element>(numListMidi)
    const [valueCodeMidi, setCodeMidi] = useState<JSX.Element>(numListMidi)

    const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value)

        if (event.target.value === "/note") {
            setMidi(numListCode)
            setCodeMidi(numListCode)
            setCodeDisabled(true)
        }
        else if (event.target.value === "/pitch") {
            setMidi(ptchListCode)
            setCodeDisabled(true)
        }
        else {
            setMidi(numListMidi)
            setCodeMidi(numListMidi)
            setCodeDisabled(false);
        };
    };

    const codeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCode(event.target.value)
    }
    const onValChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOn(event.target.value)
    }
    const offChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOff(event.target.value)
    }
    const deftChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDeft(event.target.value)
    }
    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const noteOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setVelTitle('Switch to Velocity-Based Changes')
            setCodeDisabled(true)
            setMidi(numListCode)
        } else {
            setChecked(true)
            setVelTitle('Switch to Standard Note Changes')
            setCodeDisabled(false)
            setMidi(numListMidi)
        }
    }
    const rangeOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setRngTitle('Switch to independent playable range.')
            setRngSelect(false)
        } else {
            setChecked(true)
            setRngTitle('Switch to same playable range as default.')
            setRngSelect(true)
        }
    }

    const deftPatchChange = () => {
        console.log('default')
        if (isChecked2) {
            setChecked2(false)
        } else {
            setChecked2(true)
        }
    }

    const rangeSelects =
        <div className="flex justify-evenly min-w-full">
            <select className="">
                {numListAll}
            </select>
            <div className=''>
                <i className='fas fa-arrow-right-long' />
            </div>
            <select className="">
                {numListAll}
            </select>
            <input
                className=''
                title="Describe this range-group. (i.e hits/rolls)"
                type="text"
                value={valueName}
                id={type + "Name_" + id}
                onChange={nameChange}>
            </input>
            <button
                className=''
                title="This patch has more than one set of playable ranges.">
                <i className="fa-solid fa-plus"></i>
            </button>
        </div>

    const naOption =
        <option>N/A</option>

    const onOffOption =
        <Fragment>
            <option value="On">On</option>
            <option value="Off">Off</option>
        </Fragment>

    const typeOption =
        <div title="Select the TYPE of code for this patch.">
            <select
                className='min-w-full'
                value={valueType}
                id={type + "Type_" + id}
                onChange={typeChange}>
                <option value="/control">Control Code</option>
                <option value="/note" >Note</option>
                <option value="/program">Program Change</option>
                <option value="/pitch">PitchWheel</option>
                <option value="/sysex">Sysex</option>
                <option value="/mtc">MTC</option>
                <option value="/channel_pressure">Channel Pressure</option>
                <option value="/key_pressure">Polyphonic Key Pressure</option>
            </select>
        </div>

    const noteOption =
        <div title={checkVelTitle}>
            <input
                className='min-w-full'
                checked={isChecked}
                onChange={noteOptionChange}
                type="checkbox"
                title={checkVelTitle}
                aria-label="Switch Between Velocity-Based and Standard Note Changes"
                id={type + "NoteOption_" + id}>
            </input>
        </div >

    const rangeOption =
        <Fragment>
            <div title={checkRngTitle}>
                <input
                    className='min-w-full'
                    checked={isChecked}
                    onChange={rangeOptionChange}
                    type="checkbox"
                    title={checkRngTitle}
                    aria-label="Does this patch have the same playable range as the default?"
                    id={type + "RangeOption_" + id}>
                </input>
            </div >
            {showRngSelect ? rangeSelects : null}
        </Fragment>

    const codeOption =
        <div title={artFad ? codeArtTitle : codeFadTitle}>
            <select
                className='min-w-full'
                disabled={codeDisabled}
                value={!codeDisabled ? valueCode : "N/A"}
                id={type + "Code_" + id}
                onChange={codeChange}>
                {!codeDisabled ? valueCodeMidi : naOption}
            </select>
        </div>

    const onOption =
        <div title={artFad && togArt ? codeOnArt : codeOnArt2}>
            <select
                className='min-w-full'
                value={valueOn}
                id={type + "On___" + id}
                onChange={onValChange}>
                {numListMidi}
            </select>
            {valueType === "/note" ? noteOption : null}
        </div>

    const offOption =
        <div title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" >
            <select
                className='min-w-full'
                value={valueOff}
                id={type + "Off__" + id}
                onChange={offChange}>
                {numListMidi}
            </select>
            {valueType === "/note" ? noteOption : null}
        </div >

    const deftCheck =
        <div title="Set this as the default patch.">
            <input
                className='min-w-full'
                type="checkbox"
                checked={isChecked2}
                onChange={deftPatchChange}
                title="Set this as the default patch."
                aria-label="Set this as the default patch."
                id={type + "DeftOption_" + id}>
            </input>
        </div>

    const deftSelect =
        <div title="Set the DEFAULT setting for this patch.">
            <select
                className='min-w-full'
                value={valueDeft}
                id={type + "Deft_" + id}
                onChange={deftChange}>
                {type === "art" ? onOffOption : valueMidi}
            </select >
        </div >

    const nameOption =
        <div title={artFad && togArt ? nameArtTitle : artFad && !togArt ? nameArtTitle2 : nameFadTitle}>
            <input
                className='min-w-full'
                type="text"
                value={valueName}
                id={type + "Name_" + id}
                onChange={nameChange}>
            </input>
        </div >

    const deftOption =
        <Fragment>
            {artFad && !togArt ? deftCheck : deftSelect}
            {type !== "art" && valueType === "/note" ? noteOption : null}
        </Fragment>

    const justArt =
        <Fragment>
            <td className='p-0.5'> {onOption} </td>
            <td className='p-0.5'> {togArt ? offOption : rangeOption} </td>
        </Fragment>

    return (
        <tr id={type + "_" + id} className="align-middle">
            <td className='p-0.5' id={type + "Numb_" + id}>{parseInt(id)}</td>
            <td className='p-0.5'>{typeOption}</td>
            <td className='p-0.5'>{codeOption}</td>
            {artFad ? justArt : null}
            <td className='p-0.5'>{deftOption}</td>
            <td className='p-0.5'>{nameOption}</td>
        </tr>
    );
};

export {
    SettingsRow
}