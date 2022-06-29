import { FC, useState, ChangeEvent, Fragment } from "react";
import { TdSwitch } from "./checkbox-switch";
import { TdSelect } from "./select";

interface SettingsRowProps {
    id: string;
    type: string;
    variant: string | undefined;
}

export const SettingsRow: FC<SettingsRowProps> = ({ id, type, variant }) => {

    const [valueType, setType] = useState<string>("")
    const [valueName, setName] = useState<string>("")
    const [checkRngTitle, setRngTitle] = useState<string>("Switch to independent playable range.")


    const [codeDisabled, setCodeDisabled] = useState<boolean>(false)
    const [showRngSelect, setRngSelect] = useState<boolean>(false)

    const [isChecked2, setChecked2] = useState<boolean>(false)
    const [isChecked3, setChecked3] = useState<boolean>(false)

    const nameArtTitle: string = "Set the NAME for this patch. (i.e Legato On/OFF)"
    const nameArtTitle2: string = "Set the NAME for this patch. (i.e Staccato)"
    const nameFadTitle: string = "Set the NAME for this parameter. (i.e Dynamics)"
    const codeArtTitle: string = "Set the CODE for this patch. (i.e. CC58)"
    const codeOnArt: string = "Set the ON setting for this patch. (i.e. CC58, Value 76)"
    const codeOnArt2: string = "Set the ON setting for this patch. (i.e. CC58, Value 21)"
    const codeFadTitle: string = "Set the CODE for this parameter. (i.e CC11)"

    const togArt: boolean = variant === "tog" ? true : false
    const artFad: boolean = type === "art" ? true : false

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const rangeOptionChange = () => {
        if (isChecked3) {
            setChecked3(false)
            setRngSelect(false)
            setRngTitle('Switch to independent playable range.')
        } else {
            setChecked3(true)
            setRngSelect(true)
            setRngTitle('Switch to same playable range as default.')
        }
    }

    const deftPatchChange = () => {
        if (isChecked2) {
            setChecked2(false)
        } else {
            setChecked2(true)
        }
    }

    const rangeRow =
        <Fragment>
            <td className="bg-gray-400 border-2 border-gray-400"></td>
            <td className="bg-gray-400 border-2 border-gray-400"></td>
            <td className="p-0.5 border-2 border-gray-400">
                <input
                    className='pl-1 min-w-full bg-inherit hover:cursor-pointer focus:cursor-text focus:bg-white placeholder-black focus:placeholder-gray-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus:outline-none'
                    title="Describe this range-group. (i.e hits/rolls)"
                    type="text"
                    placeholder="Range Description"
                    value={valueName}
                    id={`ArtRangeName_${id}`}
                    onChange={nameChange}>
                </input>
            </td>
            <td className="p-0.5 border-2 border-gray-400">
                <TdSelect id={`ArtRngBot_${id}`} options="allNoteList"></TdSelect>
            </td>
            <td className="p-0.5 border-2 border-gray-400">
                <TdSelect id={`ArtRngTop_${id}`} options="allNoteList"></TdSelect>
            </td>
            <td className="p-0.5 border-2 border-gray-400 text-center align-middle">
                <button
                    className="w-6 h-6 border border-black hover:border-green-50"
                    title="This patch has more than one set of playable ranges.">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </td>
            <td className="bg-gray-400 border-2 border-gray-400"></td>
            <td className="bg-gray-400 border-2 border-gray-400"></td>
        </Fragment>

    const rangeOption =
        <Fragment>
            <div title={checkRngTitle}>
                <input
                    className='min-w-full cursor-pointer'
                    checked={isChecked3}
                    onChange={rangeOptionChange}
                    type="checkbox"
                    title={checkRngTitle}
                    aria-label="Does this patch have the same playable range as the default?"
                    id={`ArtRangeOption_${id}`}>
                </input>
            </div>
        </Fragment>

    const nameOption =
        <div title={artFad && togArt ? nameArtTitle : artFad && !togArt ? nameArtTitle2 : nameFadTitle}>
            <input
                className='min-w-full bg-inherit hover:cursor-pointer focus:cursor-text focus:bg-white placeholder-black focus:placeholder-gray-400'
                type="text"
                placeholder={artFad ? 'Articulation Name' : 'Fader Name'}
                value={valueName}
                id={`${type}Name_${id}`}
                onChange={nameChange}>
            </input>
        </div >



    ////
    const [valueMidi, setMidi] = useState<string>("valMidiList")
    const [valueCodeMidi, setCodeMidi] = useState<string>("valMidiList")
    const [isChecked, setChecked] = useState<boolean>(true)
    const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value)
        setMidi("valMidiList")
        setCodeMidi("valMidiList")
        setCodeDisabled(false);

        if (event.target.value === "Note") {
            setMidi("valNoteList")
            setCodeMidi("valNoteList")
            setCodeDisabled(true)
        }
        if (event.target.value === "Pitch Wheel") {
            setMidi("valPtchList")
            setCodeMidi("valPtchList")
            setCodeDisabled(true)
        }

    };
    const switchTypeChange = () => {
        if (isChecked) {
            setCodeDisabled(true)
        } else {
            setCodeDisabled(false)
        }
    }
    const typeOption =
        <div title="Select the TYPE of code for this patch.">
            <TdSelect id={`${type}Type_${id}`} options='valAddrList'></TdSelect>
        </div>
    // needs to call typeChange()

    const changeOption =
        <TdSwitch
            id={`${type}switchTypes_${id}`}
            title="Switch between Value1-Based and Value2-Based Changes"
            a="V1"
            b="V2"
            defaultVal="b"
            showVals={true}>
        </TdSwitch>
    // needs to call switchTypeChange()
    // needs to call typeChange()

    const codeOption =
        <div title={artFad ? codeArtTitle : codeFadTitle}>
            <TdSelect id={`${type}Code_${id}`} options={valueCodeMidi} codeDisabled={codeDisabled}></TdSelect>
        </div>
    //needs to be affected by typeChange() 
    //needs to be affected by switchTypeChange() 

    const onOption =
        <div title={artFad && togArt ? codeOnArt : codeOnArt2}>
            <TdSelect id={`ArtOn___${id}`} options={valueMidi}></TdSelect>
        </div>
    //needs to be affected by typeChange() 

    const offOption =
        <div title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" >
            <TdSelect id={`ArtOff__${id}`} options={valueMidi}></TdSelect>
        </div >
    //needs to be affected by typeChange() 

    const deftSelect =
        <div title="Set the DEFAULT setting for this patch.">
            <TdSelect id={`${type}Deft_${id}`} options={type === "art" ? "valDeftList" : valueMidi}></TdSelect>
        </div >
    //needs to be affected by typeChange() 




















    const deftCheck =
        <div title="Set this as the default patch.">
            <input
                className='min-w-full cursor-pointer'
                type="checkbox"
                checked={isChecked2}
                onChange={deftPatchChange}
                title="Set this as the default patch."
                aria-label="Set this as the default patch."
                id={`${type}DeftOption_${id}`}>
            </input>
        </div>

    const deftOption =
        <Fragment>
            {artFad && !togArt ? deftCheck : deftSelect}
        </Fragment>

    const justArt =
        <Fragment>
            <td className='p-0.5 border-2 border-gray-400'>{onOption}</td>
            <td className='p-0.5 border-2 border-gray-400'>{togArt ? offOption : rangeOption}</td>
        </Fragment>

    // const justFad =
    //     <Fragment>
    //         <td className='p-0.5 border-2 border-gray-400'></td>
    //         <td className='p-0.5 border-2 border-gray-400'></td>
    //     </Fragment>

    return (
        <Fragment>
            <tr id={`${type}_${id}`} className="align-middle">
                <td className='p-0.5 border-2 border-gray-400' id={`${type}Numb_${id}`}>{parseInt(id)}</td>
                <td className='p-0.5 border-2 border-gray-400'>{nameOption}</td>
                <td className='p-0.5 border-2 border-gray-400'>{typeOption}</td>
                <td className='p-0.5 border-2 border-gray-400'>{codeOption}</td>
                {artFad ? justArt : null}
                <td className='p-0.5 border-2 border-gray-400'>{deftOption}</td>
                <td className='p-0.5 border-2 border-gray-400'>{changeOption}</td>
            </tr>
            <tr>{showRngSelect ? rangeRow : null}</tr>
        </Fragment>
    );
};