import { FC, useState } from "react";

interface TdSwitchProps {
    id: string | undefined;
    title: string;
    a: string | number;
    b: string | number;
    defaultVal: string;
    showVals?: boolean;
}

export const TdSwitch: FC<TdSwitchProps> = ({ showVals, title, defaultVal, id, a, b }) => {

    const [isChecked, setChecked] = useState<boolean>(defaultVal === "b" ? true : false)

    //Need something to pass through for the function.
    const valChange = () => {
        if (isChecked) {
            setChecked(false)
        } else {
            setChecked(true)
        }
    }

    const valSpan1 =
        <span className={isChecked ? 'text-gray-400 transition-colors' : 'text-black transition-colors'}>{a}</span>

    const valSpan2 =
        <span className={!isChecked ? 'text-gray-400 transition-colors' : 'text-black transition-colors'}>{b}</span>

    return (
        <div
            title={title}
            className="flex justify-between items-center">
            {showVals ? valSpan1 : null}
            <label
                htmlFor={id}
                className="ml-auto mr-auto inline-flex relative items-center cursor-pointer">
                <input
                    type="checkbox"
                    value={isChecked ? b : a}
                    id={id}
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={valChange} />
                <div className="
                    w-11 
                    h-6 
                    bg-blue-500
                    peer-focus:outline-none 
                    rounded-full                                             
                    peer-checked:after:translate-x-full 
                    peer-checked:after:border-white 
                    after:content-[''] 
                    after:absolute 
                    after:top-[2px] 
                    after:left-[2px] 
                    after:bg-white 
                    after:border-gray-300 
                    after:border 
                    after:rounded-full 
                    after:h-5 
                    after:w-5
                    after:transition-all 
                    peer-checked:bg-green-500">
                </div>
            </label>
            {showVals ? valSpan2 : null}
        </div >
    )
}

const example =
    <TdSwitch id="exampleTdSwitch" title="Switch between VAL1 and VAL2" a="value 1" b="value 2" defaultVal="a"></TdSwitch>
