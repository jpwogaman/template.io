import { FC, useState, ChangeEvent } from "react";
import { selectArrays } from "./select-arrays";

interface TdSelectProps {
    id: string | undefined;
    options: string | number;
    codeDisabled?: boolean;

}

export const TdSelect: FC<TdSelectProps> = ({ codeDisabled, id, options }) => {

    const [val, setVal] = useState<string>("")
    //This NEEDS to be a function!
    let optionElements: JSX.Element | undefined

    if (options === "setOutsList") {
        optionElements = selectArrays.setOutsList
    }
    if (options === "setNoteList") {
        optionElements = selectArrays.setNoteList
    }
    if (options === "chnMidiList") {
        optionElements = selectArrays.chnMidiList
    }
    if (options === "smpTypeList") {
        optionElements = selectArrays.smpTypeList
    }
    if (options === "smpOutsList") {
        optionElements = selectArrays.smpOutsList
    }
    if (options === "vepOutsList") {
        optionElements = selectArrays.vepOutsList
    }
    if (options === "valAddrList") {
        optionElements = selectArrays.valAddrList
    }
    if (options === "valMidiList") {
        optionElements = selectArrays.valMidiList
    }
    if (options === "valNoteList") {
        optionElements = selectArrays.valNoteList
    }
    if (options === "valPtchList") {
        optionElements = selectArrays.valPtchList
    }
    if (options === "valDeftList") {
        optionElements = selectArrays.valDeftList
    }
    if (options === "allNoteList") {
        optionElements = selectArrays.allNoteList
    }







    //Need something to pass through for instances where changing one select affects the other selects as well.
    const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVal(event.target.value)
    }











    return (
        <select
            className="min-w-full cursor-pointer overflow-scroll bg-inherit focus:bg-white"
            value={!codeDisabled ? val : undefined}
            disabled={codeDisabled}
            id={id}
            onChange={valChange}

        >
            {!codeDisabled ? optionElements : selectArrays.valNoneList}
        </select>
    );
};
const example =
    <TdSelect id="exampleTdSelect" options="setOutsList" codeDisabled={false}></TdSelect>