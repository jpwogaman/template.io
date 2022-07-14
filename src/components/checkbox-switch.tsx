import { FC, useState, ReactNode } from "react";

interface TdSwitchProps {
    id: string | undefined;
    title: string;
    a: string | number;
    b: string | number;
    defaultVal: string;
    artFad?: boolean | undefined;
    toggle?: boolean | undefined;
    showVals?: boolean;
    children?: ReactNode;
    onSwitch?: any;
}

export const TdSwitch: FC<TdSwitchProps> = ({ onSwitch, artFad, toggle, showVals, title, defaultVal, id, a, b }) => {

    const [isChecked, setChecked] = useState<boolean>(defaultVal === "b" ? true : false)

    const valChange = () => {
        onSwitch!(isChecked ? false : true)

        if (isChecked) {
            setChecked(false)
        } else {
            setChecked(true)
        }
    }

    let val1SpanTitle = "the DEFAULT value relates to the CODE itself (i.e. DEFAULT = CC11)"
    let val2SpanTitle = "the DEFAULT value relates to the CODE's second Value (i.e. CODE = C#3, DEFAULT = Velocity 20)"

    if (artFad && toggle) {
        val1SpanTitle = "the ON and OFF values relate to the CODE itself (i.e. ON = CC18, OFF = CC35)"
        val2SpanTitle = "the ON and OFF values relate to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20, OFF = Velocity 21)"
    }

    if (artFad && !toggle) {
        val1SpanTitle = "the ON value relates to the CODE itself (i.e. ON = CC18)"
        val2SpanTitle = "the ON value relates to the CODE's second Value (i.e. CODE = C#3, ON = Velocity 20)"
    }

    const valSpan1 =
        <span
            title={val1SpanTitle}
            className={isChecked ? 'text-zinc-400 dark:text-zinc-500 transition-colors cursor-default' :
                'transition-colors cursor-default'}>{a}</span>

    const valSpan2 =
        <span
            title={val2SpanTitle}
            className={!isChecked ? 'text-zinc-400  dark:text-zinc-500 transition-colors cursor-default' :
                'transition-colors cursor-default'}>{b}</span>

    return (
        <div
            className="flex justify-evenly items-center">
            {showVals ? valSpan1 : null}
            <label
                htmlFor={id}
                title={title}
                className="inline-flex relative items-center cursor-pointer">
                <input
                    type="checkbox"
                    value={isChecked ? b : a}
                    id={id}
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={valChange} />
                <div className="
                    w-8 
                    h-4
                    bg-blue-600 dark:bg-blue-800
                    peer-focus:outline-none                    
                    rounded-full                                             
                    peer-checked:after:translate-x-full 
                    peer-checked:after:border-white 
                    after:content-[''] 
                    after:absolute 
                    after:top-[0px] 
                    after:left-[0px] 
                    after:bg-white 
                    after:border-white                 
                    after:border 
                    after:rounded-full 
                    after:h-4 
                    after:w-4
                    after:transition-all 
                    peer-checked:bg-green-600 dark:peer-checked:bg-green-800">
                </div>
            </label>
            {showVals ? valSpan2 : null}
        </div >
    )
}

const example =
    <TdSwitch
        id="exampleTdSwitch"
        title="Switch between VAL1 and VAL2"
        a="value 1"
        b="value 2"
        defaultVal="a">
    </TdSwitch>
