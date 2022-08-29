import { FC } from "react";
import { IconBtnToggle } from "../components/icon-btn-toggle";
import { useTrackListCount } from '../data/track-list/track-context';
interface TemplateNavbarProps {

}

export const TemplateNavbar: FC<TemplateNavbarProps> = () => {

    const trackCount = useTrackListCount()

    const changeTheme = () => {
        document.body.classList.toggle('dark', undefined)
    }

    return (

        <div className="bg-zinc-900 sticky top-0 z-50 container min-w-full min-h-[40px] h-[40px] max-h-[40px] items-center">
            <ul className="flex justify-between">
                {/* <li className="block py-2 w-60 text-zinc-200">0 VEP Instances</li>
                <li className="block py-2 w-60 text-zinc-200">0 Samplers</li> */}
                <li className="block p-2 pl-5 w-60 text-zinc-200 text-left">{trackCount} {trackCount > 1 ? 'Tracks' : 'Track'}</li>
                <li className="block p-2 w-60 text-zinc-200 cursor-pointer text-right">
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