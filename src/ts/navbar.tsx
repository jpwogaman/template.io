import { IconBtnToggle } from "./button-icon-toggle";

export default function TemplateNavbar() {

    const changeTheme = () => {
        document.getElementById('template')!.classList.toggle('dark', undefined)
    }

    return (

        <div className="bg-black sticky top-0 z-50 flex container min-w-full min-h-[40px] h-[40px] max-h-[40px] justify-evenly items-center">
            <ul className="flex text-center">
                <li className="block py-2 w-60 text-white">0 VEP Instances</li>
                <li className="block py-2 w-60 text-white">0 Samplers</li>
                <li className="block py-2 w-60 text-white">0 Tracks</li>
                <li className="block py-2 w-60 text-white cursor-pointer">
                    <IconBtnToggle
                        classes="w-10"
                        title="Change Theme"
                        id="themeChange"
                        a="fa-solid fa-circle-half-stroke fa-rotate-180"
                        b="fa-solid fa-circle-half-stroke"
                        defaultIcon="a"
                        onToggle={changeTheme}>
                    </IconBtnToggle>
                </li>
            </ul>
        </div>

    );
};