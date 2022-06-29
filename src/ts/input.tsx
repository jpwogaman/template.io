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
            hover:placeholder-gray-200
            min-w-full 
            bg-inherit 
            placeholder-gray-500
            border 
            border-transparent
            outline-green-500
            outline-offset-4            
            hover:cursor-pointer                        
            focus:cursor-text 
            focus:bg-white  
            focus:placeholder-gray-500
            focus:text-black'
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