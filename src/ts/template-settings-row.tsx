import { FC, useState, ChangeEvent, Fragment } from "react";
import { TdSelect } from "./td-selects";

interface SettingsRowProps {
    id: string;
    type: string;
    variant: string | undefined;
}

const SettingsRow: FC<SettingsRowProps> = ({ id, type, variant }) => {

    const [valueType, setType] = useState<string>("")
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

    const [valueMidi, setMidi] = useState<string>("numListMidi")
    const [valueCodeMidi, setCodeMidi] = useState<string>("numListMidi")

    const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value)

        if (event.target.value === "/note") {
            setMidi("numListCode")
            setCodeMidi("numListCode")
            setCodeDisabled(true)
        }
        else if (event.target.value === "/pitch") {
            setMidi("ptchListCode")
            setCodeDisabled(true)
        }
        else {
            setMidi("numListMidi")
            setCodeMidi("numListMidi")
            setCodeDisabled(false);
        };
    };

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const noteOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setCodeDisabled(true)
            setVelTitle('Switch to Velocity-Based Changes')
            setMidi("numListCode")
        } else {
            setChecked(true)
            setCodeDisabled(false)
            setVelTitle('Switch to Standard Note Changes')
            setMidi("numListMidi")
        }
    }
    const rangeOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setRngSelect(false)
            setRngTitle('Switch to independent playable range.')
        } else {
            setChecked(true)
            setRngSelect(true)
            setRngTitle('Switch to same playable range as default.')
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
            <TdSelect id="" options="numListAll" codeDisabled={codeDisabled}></TdSelect>
            <div className=''>
                <i className='fas fa-arrow-right-long' />
            </div>
            <TdSelect id="" options="numListAll" codeDisabled={codeDisabled}></TdSelect>
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

    const typeOption =
        <div title="Select the TYPE of code for this patch.">
            <TdSelect id={type + "Type_" + id} options='addressOptions'></TdSelect>
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
            <TdSelect id={type + "Code_" + id} options={valueCodeMidi} codeDisabled={codeDisabled}></TdSelect>
        </div>

    const onOption =
        <div title={artFad && togArt ? codeOnArt : codeOnArt2}>
            <TdSelect id={type + "On___" + id} options={valueMidi}></TdSelect>
            {valueType === "/note" ? noteOption : null}
        </div>

    const offOption =
        <div title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" >
            <TdSelect id={type + "Off__" + id} options={valueMidi}></TdSelect>
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
            <TdSelect id={type + "Deft_" + id} options={type === "art" ? "onOffOption" : valueMidi}></TdSelect>
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