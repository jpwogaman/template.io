import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { ArtListProps } from '../../pages/track-settings';
import { ArtSettingsRow } from './art-settings-row'

interface ArtDataProps {
    ArtList: ArtListProps[];
    setArts: Dispatch<SetStateAction<ArtListProps[]>>;
    setAvgDelAvail: Dispatch<SetStateAction<boolean>>;
}

export const ArtToggleData: FC<ArtDataProps> = ({ ArtList, setArts, setAvgDelAvail }) => {

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
                        setArts={setArts}
                        ArtList={ArtList}
                        setAvgDelAvail={setAvgDelAvail}
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

export const ArtSwitchData: FC<ArtDataProps> = ({ ArtList, setArts, setAvgDelAvail }) => {

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
                        setArts={setArts}
                        ArtList={ArtList}
                        setAvgDelAvail={setAvgDelAvail}
                        key={art.id}
                        id={art.id}
                        onDelete={() => removeArt(art.id)}
                    />
                    : null
            ))}
        </Fragment>

    )
}