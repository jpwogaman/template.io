import { IconBtnToggle } from "./button-icon-toggle";

export default function TemplateNavbar() {

    const changeTheme = () => {
        document.body.classList.toggle('dark', undefined)
    }

    return (

        <div className="bg-zinc-900 sticky top-0 z-50 flex container min-w-full min-h-[40px] h-[40px] max-h-[40px] justify-evenly items-center">
            <ul className="flex text-center">
                <li className="block py-2 w-60 text-zinc-200">0 VEP Instances</li>
                <li className="block py-2 w-60 text-zinc-200">0 Samplers</li>
                <li className="block py-2 w-60 text-zinc-200">0 Tracks</li>
                <li className="block py-2 w-60 text-zinc-200 cursor-pointer">
                    <IconBtnToggle
                        classes="w-10"
                        titleA="Change to Dark Mode."
                        titleB="Change to Light Mode."
                        id="themeChange"
                        a="fa-solid fa-circle-half-stroke fa-rotate-180"
                        b="fa-solid fa-circle-half-stroke"
                        defaultIcon="a"
                        onToggleA={changeTheme}
                        onToggleB={changeTheme}>
                    </IconBtnToggle>
                </li>
            </ul>
        </div>

    );
};