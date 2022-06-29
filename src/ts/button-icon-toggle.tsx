import { ReactNode, FC, useState } from "react";
interface IconBtnToggleProps {
    id: string;
    title: string;
    classes: string;
    a: string;
    b: string;
    defaultIcon: string;
    onToggle?: () => void | void | undefined;
    children?: ReactNode;
}

const IconBtnToggle: FC<IconBtnToggleProps> = ({ onToggle, classes, defaultIcon, title, id, a, b }) => {

    const [isToggleOn, setToggle] = useState<boolean>(defaultIcon === "a" ? true : false)

    const handleClick = () => {
        onToggle!()

        if (isToggleOn) {
            setToggle(false)
        } else {
            setToggle(true)
        }
    }

    return (
        <button
            className={`transition-all duration-100 ${classes}`}
            title={title}
            onClick={handleClick}
            id={id} >
            <i className={isToggleOn ? a : b}></i>
        </button >
    );
}

export { IconBtnToggle }

const example =
    <IconBtnToggle
        classes="className"
        title="title"
        id="id"
        a="fa-solid fa-lock-open"
        b="fa-solid fa-lock"
        defaultIcon="a">
    </IconBtnToggle>