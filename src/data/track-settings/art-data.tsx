import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { ArtListProps } from '../../pages/track-settings';
import { ArtSettingsRow } from './art-settings-row'
import { TrackListProps } from '../../pages/template-app';

interface ArtDataProps {
    selectedTrack: TrackListProps;
    setArts: Dispatch<SetStateAction<ArtListProps[]>>;
    setAvgDelAvail: Dispatch<SetStateAction<boolean>>;
    baseDelay: number;
}

export const ArtToggleData: FC<ArtDataProps> = ({ baseDelay, setArts, setAvgDelAvail, selectedTrack }) => {

    const ArtList = selectedTrack?.artList

    const removeArt = (artId: string) => {

        if (ArtList?.length !== 2) {
            setArts(ArtList!.filter((art) => art.id !== artId));
        }
    }

    return (

        <Fragment>
            {ArtList?.map((art) => (
                art.toggle ?
                    <ArtSettingsRow
                        setArts={setArts}
                        ArtList={ArtList}
                        setAvgDelAvail={setAvgDelAvail}
                        key={art.id}
                        id={art.id}
                        onDelete={() => removeArt(art.id)}
                        toggle
                        baseDelay={baseDelay}
                    />
                    : null
            ))}
        </Fragment>

    )
}

export const ArtSwitchData: FC<ArtDataProps> = ({ baseDelay, selectedTrack, setArts, setAvgDelAvail }) => {

    const ArtList = selectedTrack?.artList

    const removeArt = (artId: string) => {

        if (ArtList?.length !== 2) {
            setArts(ArtList!.filter((art) => art.id !== artId));
        }
    }

    return (

        <Fragment>
            {ArtList?.map((art) => (
                !art.toggle ?
                    <ArtSettingsRow
                        setArts={setArts}
                        ArtList={ArtList}
                        setAvgDelAvail={setAvgDelAvail}
                        key={art.id}
                        id={art.id}
                        onDelete={() => removeArt(art.id)}
                        baseDelay={baseDelay}
                    />
                    : null
            ))}
        </Fragment>

    )
}