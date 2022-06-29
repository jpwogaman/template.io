import { FC, useState, ChangeEvent, ReactNode } from "react";

interface TdInputProps {
    id: string | undefined;
    title: string;
    placeholder: string;
    codeDisabled?: boolean;
    children?: ReactNode;
}

export const TdInput: FC<TdInputProps> = ({ id, placeholder, title, codeDisabled }) => {
    const [valueName, setName] = useState<string>("")

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    return (
        <input
            type="text"
            className='            
            hover:placeholder-zinc-200 dark:hover:placeholder-zinc-600
            min-w-full 
            bg-inherit 
            placeholder-zinc-500 dark:placeholder-zinc-500
            
            border 
            border-transparent
            outline-green-500
            outline-offset-4            
            hover:cursor-pointer                        
            focus:cursor-text 
            focus:bg-white  
            focus:placeholder-zinc-500
            focus:text-zinc-900'
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