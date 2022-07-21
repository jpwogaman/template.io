import { ReactNode, FC, useState } from "react";
interface IconBtnToggleProps {
    id: string;
    titleA: string;
    titleB: string;
    classes: string;
    a: string;
    b: string;
    defaultIcon: string;
    onToggleA?: () => void | void | undefined;
    onToggleB?: () => void | void | undefined;
    children?: ReactNode;
}

export const IconBtnToggle: FC<IconBtnToggleProps> = ({ onToggleA, onToggleB, classes, defaultIcon, titleA, titleB, id, a, b }) => {

    const [isToggleOn, setToggle] = useState<boolean>(defaultIcon === "a" ? true : false)

    const handleClick = () => {

        if (isToggleOn) {
            setToggle(false)
            onToggleA!()
        } else {
            setToggle(true)
            onToggleB!()
        }
    }

    return (
        <button
            className={`transition-all duration-100 ${classes}`}
            title={isToggleOn ? titleA : titleB}
            onClick={handleClick}
            id={id} >
            <i className={isToggleOn ? a : b}></i>
        </button >
    );
}