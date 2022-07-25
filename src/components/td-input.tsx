import { FC, useState, ChangeEvent, ReactNode } from "react";

interface TdInputProps {
    id: string | undefined;
    title: string;
    placeholder: string | number;
    codeDisabled?: boolean;
    children?: ReactNode;
    defaultValue?: string | number;
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void | undefined;
    onReceive?: string | number;
    td: boolean;
    valueType?: string;
}

export const TdInput: FC<TdInputProps> = ({ valueType, td, onReceive, onInput, defaultValue, id, placeholder, title, codeDisabled }) => {
    const [valueName, setName] = useState<string | number>(defaultValue ? defaultValue : '')

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {

        setName(event.target.value)

        if (onInput) { onInput!(event) }
        else return
    }

    return (
        <input
            type="text"
            className=
            {`
            ${codeDisabled ?
                    'hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500 hover:cursor-text' :
                    'hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600 hover:cursor-pointer'
                }
            ${td ?
                    'w-full' :
                    'w-10'
                } 
            placeholder-zinc-400 dark:placeholder-zinc-500
            focus:placeholder-zinc-500
            focus:text-zinc-900
            pl-1
            bg-inherit 
            border 
            border-transparent
            outline-green-600 dark:outline-green-800
            outline-offset-4
            focus:cursor-text 
            focus:bg-white`}
            id={id}
            title={title}
            placeholder={placeholder as string}
            disabled={codeDisabled}
            value={onReceive ? onReceive : valueName}
            onChange={nameChange}>
        </input>
    );
};