import { FC, useState, ChangeEvent, Fragment, ReactNode } from "react";
import { IconBtnToggle } from "./button-icon-toggle";
import { TdSwitch } from "./checkbox-switch";
import { TdInput } from "./input";
import { TdSelect } from "./select";





interface RangeRowProps {
    id: string;
    children?: ReactNode;
}

const RangeRows: FC<RangeRowProps> = ({ id }) => {

    const [RangeList, setRanges] = useState<any[]>([
        {
            id: "01"
        },
    ])

    const addRange = (artId: string, rangeId: string) => {

        let newRangeIdNumb: number = parseInt(rangeId) + 1

        let newRangeIdStr: string = newRangeIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newRange = { id: newRangeIdStr }
        setRanges([...RangeList, newRange])
    }

    const removeRange = (artId: string, rangeId: string) => {

        if (RangeList.length !== 1) {
            setRanges(RangeList.filter((range) => range.id !== rangeId));
        }
    }

    return (
        <Fragment>
            {RangeList.map((range) => (
                <tr key={`ArtRange_${id}_${range.id}`} id={`ArtRange_${id}_${range.id}`} className="rangeTr">
                    <td colSpan={2} className="rangeTdEmpty"></td>
                    <td className="rangeTd">
                        <TdInput
                            id={`ArtRangeName_${id}_${range.id}`}
                            title="Describe this range-group. (i.e hits/rolls)"
                            placeholder="Range Description"
                            codeDisabled={false}>
                        </TdInput>
                    </td>
                    <td className="rangeTd">
                        <TdSelect id={`ArtRngBot_${id}_${range.id}`} options="allNoteList"></TdSelect>
                    </td>
                    <td className="rangeTd text-center">
                        <i className='fas fa-arrow-right-long' />
                    </td>
                    <td className="rangeTd">
                        <TdSelect id={`ArtRngTop_${id}_${range.id}`} options="allNoteList"></TdSelect>
                    </td>
                    <td className="rangeTd text-center">
                        <IconBtnToggle
                            classes="w-6 h-6 hover:scale-[1.15] hover:animate-pulse"
                            titleA="Add another set of playable ranges."
                            titleB="Remove this set of playable ranges."
                            id={`ArtRangeAddButton_${id}_${range.id}`}
                            a="fa-solid fa-plus"
                            b="fa-solid fa-minus"
                            defaultIcon="a"
                            onToggleA={() => addRange(id, range.id)}
                            onToggleB={() => removeRange(id, range.id)}>
                        </IconBtnToggle>
                    </td>
                    <td className="rangeTdEmpty"></td>
                </tr>
            ))}
        </Fragment >
    )
}


























interface SettingsRowProps {
    id: string;
    type: string;
    variant: string | undefined;
}

export const SettingsRow: FC<SettingsRowProps> = ({ id, type, variant }) => {


    const [checkRngTitle, setRngTitle] = useState<string>("Switch to independent playable range.")


    const [codeDisabled, setCodeDisabled] = useState<boolean>(false)
    const [showRngSelect, setRngSelect] = useState<boolean>(false)

    const [isChecked2, setChecked2] = useState<boolean>(false)
    const [isChecked3, setChecked3] = useState<boolean>(false)

    const nameArtTitle: string = "Set the NAME for this patch. (i.e Legato On/OFF)"
    const nameArtTitle2: string = "Set the NAME for this patch. (i.e Staccato)"
    const nameFadTitle: string = "Set the NAME for this parameter. (i.e Dynamics)"

    const typeCodeFad: string = "Select the TYPE of code for this parameter."
    const typeCodeArt: string = "Select the TYPE of code for this patch."

    const codeArtTitle: string = "Set the CODE for this patch. (i.e. CC58)"
    const codeFadTitle: string = "Set the CODE for this parameter. (i.e CC11)"

    const codeOnArt: string = "Set the ON setting for this patch. (i.e. CC58, Value 76)"
    const codeOnArt2: string = "Set the ON setting for this patch. (i.e. CC58, Value 21)"


    const deftTitleFad: string = "Set the DEFAULT value for this parameter."
    const deftTitleArt: string = "Set the DEFAULT setting for this patch."


    const togArt: boolean = variant === "tog" ? true : false
    const artFad: boolean = type === "art" ? true : false



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

    const rangeOption =
        <Fragment>
            <div title={checkRngTitle}>
                <input
                    type="checkbox"
                    className='min-w-full cursor-pointer'
                    checked={isChecked3}
                    onChange={rangeOptionChange}
                    title={checkRngTitle}
                    aria-label="Does this patch have the same playable range as the default?"
                    id={`ArtRangeOption_${id}`}>
                </input>
            </div>
        </Fragment>

    const nameOption =
        <TdInput
            id={`${type}Name_${id}`}
            title={artFad && togArt ? nameArtTitle : artFad && !togArt ? nameArtTitle2 : nameFadTitle}
            placeholder={artFad ? 'Articulation Name' : 'Fader Name'}
            codeDisabled={false}>
        </TdInput>


    ////
    const [valueMidi, setMidi] = useState<string>("valMidiList")
    const [valueCodeMidi, setCodeMidi] = useState<string>("valMidiList")

    const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {

        const switchChecked = document.getElementById(`${type}switchTypes_${id}`) as HTMLInputElement
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

        const typeValue = document.getElementById(`${type}Type_${id}`) as HTMLSelectElement

        if (isChecked) {
            setCodeDisabled(false)
            if (typeValue.value === "/note") {
                setMidi("valMidiList")
            }
        } else {
            setCodeDisabled(true)
            if (typeValue.value === "/note") {
                setMidi("valNoteList")
            }
        }

    }

    const typeOption =
        <div title={artFad ? typeCodeArt : typeCodeFad}>
            <TdSelect id={`${type}Type_${id}`} options='valAddrList' onSelect={typeChange}></TdSelect>
        </div>

    const changeOption =
        <TdSwitch
            id={`${type}switchTypes_${id}`}
            title="Switch between Value 1-Based and Value 2-Based Changes."
            a="V1"
            b="V2"
            defaultVal="b"
            artFad={artFad}
            togArt={togArt}
            showVals={true}
            onSwitch={switchTypeChange}>
        </TdSwitch>
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
        <div title={artFad ? deftTitleArt : deftTitleFad}>
            <TdSelect id={`${type}Deft_${id}`} options={type === "art" ? "valDeftList" : valueMidi}></TdSelect>
        </div >
    //needs to be affected by typeChange() 




















    const deftCheck =
        <div title="Set this as the default patch.">
            <input
                type="checkbox"
                className='min-w-full cursor-pointer'
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
            <td className='settingsTd'>{onOption}</td>
            <td className='settingsTd'>{togArt ? offOption : rangeOption}</td>
        </Fragment>

    // const justFad =
    //     <Fragment>
    //         <td className='settingsTd'></td>
    //         <td className='settingsTd'></td>
    //     </Fragment>

    return (
        <Fragment>
            <tr id={`${type}_${id}`} className="settingsTr">
                <td className='settingsTd' id={`${type}Numb_${id}`} title={`${artFad ? "Articulation" : "Fader"} No. ${parseInt(id)}`}>{parseInt(id)}</td>
                <td className='settingsTd'>{nameOption}</td>
                <td className='settingsTd'>{typeOption}</td>
                <td className='settingsTd'>{codeOption}</td>
                {artFad ? justArt : null}
                <td className='settingsTd'>{deftOption}</td>
                <td className='settingsTd'>{changeOption}</td>
            </tr>
            {showRngSelect ? <RangeRows id={id}></RangeRows> : null}
        </Fragment>
    );
};