import { ReactNode, FC, useState } from "react";
interface IconBtnToggleProps {
    id: string;
    title: string;
    className: string;
    a: string;
    b: string;
    defaultIcon: string;
    children?: ReactNode;
}

const IconBtnToggle: FC<IconBtnToggleProps> = ({ className, defaultIcon, title, id, a, b }) => {

    const [isToggleOn, setToggle] = useState<boolean>(defaultIcon === "a" ? true : false)

    const handleClick = () => {
        if (isToggleOn) {
            setToggle(false)
        } else {
            setToggle(true)
        }
    }

    return (
        <button
            className={className}
            title={title}
            onClick={handleClick}
            id={id}>
            <i className={isToggleOn ? a : b}></i>
        </button>
    );
}

export { IconBtnToggle }

const example =
    <IconBtnToggle
        className="w-10 h-10 border border-black mr-1 hover:border-green-50"
        title="Close Track Settings Window"
        id="editLock"
        a="fa-solid fa-lock-open"
        b="fa-solid fa-lock"
        defaultIcon="a">
    </IconBtnToggle>