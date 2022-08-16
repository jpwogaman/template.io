import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { ArtSettingsRow } from './art-settings-row'
import { TrackListProps } from '../../pages/template-app';

interface ArtDataProps {
    selectedTrack: TrackListProps;
    TrackList?: TrackListProps[];
    setTracks?: Dispatch<SetStateAction<TrackListProps[]>>;
    setArts: Dispatch<SetStateAction<TrackListProps["artList"]>>;
    setAvgDelAvail: Dispatch<SetStateAction<boolean>>;
    setSelectedTrack?: Dispatch<SetStateAction<TrackListProps>>;
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
                        selectedTrack={selectedTrack}
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

export const ArtSwitchData: FC<ArtDataProps> = ({ setSelectedTrack, baseDelay, selectedTrack, setArts, setAvgDelAvail, TrackList, setTracks }) => {

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
                        selectedTrack={selectedTrack}
                        setSelectedTrack={setSelectedTrack}
                        ArtList={ArtList}
                        setAvgDelAvail={setAvgDelAvail}
                        key={art.id}
                        id={art.id}
                        setTracks={setTracks}
                        TrackList={TrackList}
                        onDelete={() => removeArt(art.id)}
                        baseDelay={baseDelay}
                    />
                    : null
            ))}
        </Fragment>

    )
}