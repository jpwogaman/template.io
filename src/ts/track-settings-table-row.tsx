import { FC, useState, ChangeEvent, Fragment } from "react";
import { TdSwitch } from "./checkbox-switch";
import { TdInput } from "./input";
import { TdSelect } from "./select";





interface RangeRowProps {
    id: string;
}

const RangeRows: FC<RangeRowProps> = (id) => {

    const [valueName, setName] = useState<string>("")
    const [RangeList, setRanges] = useState<any[]>([
        {
            id: "01"
        },
    ])

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const addRange = (id: string) => {

        const rangeIndex: number = RangeList.findIndex(i => i.id === id)
        const selectedRange: string = 'trk_' + id

        let newIdNumb: number = parseInt(id) + 1

        let newIdStr: string = newIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

        console.log(`selectedRange: ${selectedRange} RangeList[Index]: ${rangeIndex}`)
        console.log(`nextRangeId: ${newIdStr}`)

        // const newRange = { newIdStr }
        // setRanges([...RangeList, newRange])
    }

    const removeRange = (id: string) => {
        console.log('remove range', id);

        if (RangeList.length !== 1) {
            setRanges(RangeList.filter((range) => range.id !== id));
        }
    }

    return (
        <Fragment>
            {RangeList.map((range) => (
                <tr key={`ArtRange_${id}_${range.id}`} id={`ArtRange_${id}_${range.id}`} className="">
                    <td className="p-0.5 rangeRow"></td>
                    <td className="p-0.5 rangeRow"></td>
                    <td className="p-0.5 pl-1">
                        <TdInput
                            id={`ArtRangeName_${id}_${range.id}`}
                            title="Describe this range-group. (i.e hits/rolls)"
                            placeholder="Range Description"
                            codeDisabled={false}>
                        </TdInput>
                    </td>
                    <td className="p-0.5">
                        <TdSelect id={`ArtRngBot_${id}_${range.id}`} options="allNoteList"></TdSelect>
                    </td>
                    <td className="p-0.5">
                        <TdSelect id={`ArtRngTop_${id}_${range.id}`} options="allNoteList"></TdSelect>
                    </td>
                    <td className="p-0.5 text-center align-middle">
                        <button
                            className="w-6 h-6 border border-black hover:border-green-50"
                            title="This patch has more than one set of playable ranges."
                        // onDelete={() => removeRange(range.id)}
                        // onAdd={() => addRange(range.id)} 
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </td>
                    <td className="p-0.5 rangeRow"></td>
                    <td className="p-0.5 rangeRow"></td>
                </tr>
            ))}
        </Fragment >
    )
}


























interface SettingsRowProps {
    id: string;
    type: string;
    variant: string | undefined;
    onDelete?: any;
    onAdd?: any;
    // onDelete: (id: string) => MouseEventHandler<HTMLButtonElement>;
    // onAdd: (id: string) => MouseEventHandler<HTMLButtonElement>;
}

export const SettingsRow: FC<SettingsRowProps> = ({ id, type, variant }) => {


    const [valueName, setName] = useState<string>("")
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

        const isChecked = document.getElementById(`${type}switchTypes_${id}`) as HTMLInputElement
        console.log('typeChange: ', isChecked.checked)
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
        console.log('typeChange: ', isChecked.checked)
        switchTypeChange(isChecked.checked)
    };
    const switchTypeChange = (isChecked: boolean) => {
        console.log('switchTypeChange: ', isChecked)
        if (isChecked) {
            setCodeDisabled(false)
        } else {
            setCodeDisabled(true)
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
            <td className='p-0.5'>{onOption}</td>
            <td className='p-0.5'>{togArt ? offOption : rangeOption}</td>
        </Fragment>

    // const justFad =
    //     <Fragment>
    //         <td className='p-0.5'></td>
    //         <td className='p-0.5'></td>
    //     </Fragment>

    return (
        <Fragment>
            <tr id={`${type}_${id}`} className="">
                <td className='p-0.5' id={`${type}Numb_${id}`} title={`${artFad ? "Articulation" : "Fader"} No. ${parseInt(id)}`}>{parseInt(id)}</td>
                <td className='p-0.5'>{nameOption}</td>
                <td className='p-0.5'>{typeOption}</td>
                <td className='p-0.5'>{codeOption}</td>
                {artFad ? justArt : null}
                <td className='p-0.5'>{deftOption}</td>
                <td className='p-0.5'>{changeOption}</td>
            </tr>
            {showRngSelect ? <RangeRows id={id}></RangeRows> : null}
        </Fragment>
    );
};