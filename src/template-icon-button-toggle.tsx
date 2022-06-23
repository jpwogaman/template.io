import { ReactNode, FC, useState } from "react";
import { Button } from "react-bootstrap";

interface IconBtnToggleProps {
    defaultIcon: string;
    variant: string;
    size: any;
    title: string;
    id: string;
    a: string;
    b: string;
    children?: ReactNode;
}

const IconBtnToggle: FC<IconBtnToggleProps> = ({ defaultIcon, variant, size, title, id, a, b }) => {

    const [isToggleOn, setToggle] = useState<boolean>(defaultIcon === "a" ? true : false)

    const handleClick = () => {
        if (isToggleOn) {
            setToggle(false)
        } else {
            setToggle(true)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            title={title}
            onClick={handleClick}
            id={id}>
            <i className={isToggleOn ? a : b}></i>
        </Button>
    );
}

export { IconBtnToggle }