import { FC, useState, ChangeEvent, ReactNode } from "react";
import { selectArrays } from "./select-arrays";

interface TdSelectProps {
    id: string | undefined;
    options: string | number;
    codeDisabled?: boolean;
    onSelect?: (event: ChangeEvent<HTMLSelectElement>) => void | undefined;
    children?: ReactNode;
}

export const TdSelect: FC<TdSelectProps> = ({ onSelect, codeDisabled, id, options }) => {

    const [val, setVal] = useState<string>("")

    let optionElements: string | JSX.Element | undefined

    for (const array in selectArrays) {
        if (options === selectArrays[array].name) {
            optionElements = selectArrays[array].array
        }
    }

    const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVal(event.target.value)
        if (onSelect) { onSelect!(event) }
        else return
    }

    return (
        <select
            className="        
            w-full                                 
            cursor-pointer 
            overflow-scroll 
            bg-inherit  
            outline-green-600 dark:outline-green-800
            outline-offset-4
            focus:text-zinc-900
            focus:bg-white"
            value={!codeDisabled ? val : undefined}
            disabled={codeDisabled}
            id={id}
            onChange={valChange}>
            {!codeDisabled ? optionElements : selectArrays.valNoneList.array}
        </select>
    );
};