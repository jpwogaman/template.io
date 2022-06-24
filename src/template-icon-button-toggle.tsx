import { ReactNode, FC, useState } from "react";
interface IconBtnToggleProps {
    defaultIcon: string;
    title: string;
    className: string;
    id: string;
    a: string;
    b: string;
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