import { FC, useState, ChangeEvent } from "react";
import { selectArrays } from "./select-arrays";

interface TdSelectProps {
    id: string | undefined;
    options: string | number;
    codeDisabled?: boolean;
    onSelect?: (event: ChangeEvent<HTMLSelectElement>) => void | undefined;
}

export const TdSelect: FC<TdSelectProps> = ({ onSelect, codeDisabled, id, options }) => {

    const [val, setVal] = useState<string>("")

    let optionElements: string | JSX.Element | undefined

    for (const array in selectArrays) {
        if (options === selectArrays[array].name) {
            optionElements = selectArrays[array].array
        }
    }

    //Need something to pass through for instances where changing one select affects the other selects as well.
    const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVal(event.target.value)
        onSelect!(event)
    }

    return (
        <select
            className="
            min-w-full                        
            cursor-pointer 
            overflow-scroll 
            bg-inherit  
            border 
            border-transparent  
            outline-green-500
            outline-offset-4
            focus:text-black
            focus:bg-white"
            value={!codeDisabled ? val : undefined}
            disabled={codeDisabled}
            id={id}
            onChange={valChange}>
            {!codeDisabled ? optionElements : selectArrays.valNoneList.array}
        </select>
    );
};


const example =
    <TdSelect id="exampleTdSelect" options="setOutsList" codeDisabled={false}></TdSelect>