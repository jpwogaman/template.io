import { FC, useState, ChangeEvent, ReactNode } from "react";

interface TdInputProps {
    id: string | undefined;
    title: string;
    placeholder: string;
    codeDisabled?: boolean;
    children?: ReactNode;
    defaultValue?: string;
    onSubmit?: (event: ChangeEvent<HTMLInputElement>) => void | undefined;
}

export const TdInput: FC<TdInputProps> = ({ defaultValue, id, placeholder, title, codeDisabled }) => {
    const [valueName, setName] = useState<string>(defaultValue ? defaultValue : "")

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    return (
        <input
            type="text"
            className='  
            hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600
            placeholder-zinc-400 dark:placeholder-zinc-500
            focus:placeholder-zinc-500
            focus:text-zinc-900
            pl-1 
            w-full 
            bg-inherit 
            border 
            border-transparent
            outline-green-600 dark:outline-green-800
            outline-offset-4            
            hover:cursor-pointer                        
            focus:cursor-text 
            focus:bg-white'
            id={id}
            title={title}
            placeholder={placeholder}
            disabled={codeDisabled}
            value={valueName}
            onChange={nameChange}>
        </input>
    );
};

export const Input: FC<TdInputProps> = ({ onSubmit, defaultValue, id, placeholder, title, codeDisabled }) => {
    const [valueName, setName] = useState<string>(defaultValue ? defaultValue : "")

    const nameChange = (event: ChangeEvent<HTMLInputElement> | any) => {
        setName(event.target.value)
        onSubmit!(event.target.value)
    }

    return (
        <input
            type="text"
            className='  
            hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600
            placeholder-zinc-400 dark:placeholder-zinc-500
            focus:placeholder-zinc-500
            focus:text-zinc-900
            pl-1 
            w-10
            mx-2 
            bg-inherit 
            border 
            border-transparent
            outline-green-600 dark:outline-green-800
            outline-offset-4            
            hover:cursor-pointer                        
            focus:cursor-text 
            focus:bg-white'
            id={id}
            title={title}
            placeholder={placeholder}
            disabled={codeDisabled}
            value={valueName}
            onChange={nameChange}>
        </input>
    );
};

const example =
    <TdInput
        id="id"
        title="title"
        placeholder="placeholder"
        codeDisabled={false}>
    </TdInput>