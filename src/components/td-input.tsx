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
}

export const TdInput: FC<TdInputProps> = ({ td, onReceive, onInput, defaultValue, id, placeholder, title, codeDisabled }) => {
    const [valueName, setName] = useState<string | number>(defaultValue ? defaultValue : '')

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.value === '' && placeholder === '0') {
            event.target.value = '0'
        }

        setName(event.target.value)

        if (onInput) { onInput!(event) }
        else return
    }

    return (
        <input
            type="text"
            className=
            {`
            ${codeDisabled ? 'hover:placeholder-zinc-400 dark:hover:placeholder-zinc-500' : 'hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600'}
            placeholder-zinc-400 dark:placeholder-zinc-500
            focus:placeholder-zinc-500
            focus:text-zinc-900
            pl-1
           ${td ? 'w-full' : 'w-10'} 
            bg-inherit 
            border 
            border-transparent
            outline-green-600 dark:outline-green-800
            outline-offset-4
            ${codeDisabled ? 'hover:cursor-text' : 'hover:cursor-pointer'}
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