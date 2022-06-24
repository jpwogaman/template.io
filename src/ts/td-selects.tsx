import { FC, useState, ChangeEvent } from "react";
import { listArraysJsx, listArraysStr } from "./template-arrays";

interface TdSelectProps {
    id: any;
    options: string | number;
    codeDisabled?: boolean;

}

export const TdSelect: FC<TdSelectProps> = ({ codeDisabled, id, options }) => {

    const [val, setVal] = useState<string>("")
    const naOption: JSX.Element = <option>N/A</option>

    let optionElements: JSX.Element = listArraysJsx[0]

    for (var i in listArraysJsx) {
        if (options === listArraysStr[i]) {
            optionElements = listArraysJsx[i]
        }
    }

    const valChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVal(event.target.value)
    }

    return (
        <select
            className="min-w-full"
            value={!codeDisabled ? val : "N/A"}
            disabled={codeDisabled}
            id={id}
            onChange={valChange}>
            {!codeDisabled ? optionElements : naOption}
        </select>
    );
};
