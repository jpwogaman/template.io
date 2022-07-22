import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { ArtSettingsRow } from './art-settings-row'

interface ArtDataProps {
    setDelays: Dispatch<SetStateAction<{ id: string, delay: number }[]>>;
    ArtList: { id: string, toggle: boolean }[];
    setArts: Dispatch<SetStateAction<{ id: string, toggle: boolean }[]>>;
}

export const ArtToggleData: FC<ArtDataProps> = ({ setDelays, ArtList, setArts }) => {

    const removeArt = (artId: string) => {

        if (ArtList.length !== 2) {
            setArts(ArtList.filter((art) => art.id !== artId));
        }
    }

    return (

        <Fragment>
            {ArtList.map((art) => (
                art.toggle ?
                    <ArtSettingsRow
                        setDelays={setDelays}
                        key={art.id}
                        id={art.id}
                        onDelete={() => removeArt(art.id)}
                        toggle
                    />
                    : null
            ))}
        </Fragment>

    )
}

export const ArtSwitchData: FC<ArtDataProps> = ({ setDelays, ArtList, setArts }) => {

    const [defaultSwitchArt, setDefaultSwitchArt] = useState<string>('artDeftOption_02')

    const removeArt = (artId: string) => {

        if (ArtList.length !== 2) {
            setArts(ArtList.filter((art) => art.id !== artId));
        }
    }

    return (

        <Fragment>
            {ArtList.map((art) => (
                !art.toggle ?
                    <ArtSettingsRow
                        setDelays={setDelays}
                        key={art.id}
                        id={art.id}
                        onDelete={() => removeArt(art.id)}
                        defaultSwitchArt={defaultSwitchArt}
                        setDefaultSwitchArt={setDefaultSwitchArt}
                    />
                    : null
            ))}
        </Fragment>

    )
}