import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { TrackRows } from './track-rows'

interface TracksProps {
    setSelectedTrack: Dispatch<SetStateAction<string>>;
    setSelectedTrackName: Dispatch<SetStateAction<string>>;
    setTrackCount: Dispatch<SetStateAction<number>>;
    setTracks: Dispatch<SetStateAction<{ id: string }[]>>;
    selectedTrackDelay: string;
    TrackList: { id: string }[];
}

export const TrackData: FC<TracksProps> = ({ TrackList, setTracks, setTrackCount, selectedTrackDelay, setSelectedTrackName, setSelectedTrack }) => {

    const addTrack = (trackId: string) => {

        let newTrackIdNumb: number = parseInt(trackId) + 1

        let newTrackIdStr: string = newTrackIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newTrack = { id: newTrackIdStr }
        setTracks([...TrackList, newTrack])
        setTrackCount(TrackList.length + 1)
    }

    const removeTrack = (trackId: string) => {

        if (TrackList.length !== 1) {
            setTracks(TrackList.filter((Track) => Track.id !== trackId));
        }
        setTrackCount(TrackList.length - 1)
    }

    const settingsOpen = (trackId: string) => {

        const selectedTrackID: HTMLElement | null = document.getElementById(`trk_${trackId}`)
        const selectedTrackName = document.getElementById(`trkName_${trackId}`) as HTMLInputElement
        const templateTrackSettings: HTMLElement | null = document.getElementById('TemplateTrackSettings')
        const templateTrackList: HTMLElement | null = document.getElementById('TemplateTracks')

        setSelectedTrack!(trackId)
        setSelectedTrackName!(selectedTrackName!.value)

        selectedTrackID!.classList.replace('bg-zinc-300', 'bg-zinc-50')
        selectedTrackID!.classList.replace('dark:bg-stone-800', 'dark:bg-stone-400')

        for (var track in TrackList) {
            const trackId: HTMLElement | null = document.getElementById(`trk_${TrackList[track].id}`)

            if (trackId !== selectedTrackID) {
                trackId!.classList.replace('bg-zinc-50', 'bg-zinc-300')
                trackId!.classList.replace('dark:bg-stone-400', 'dark:bg-stone-800')
            }
        }

        if (templateTrackSettings!.classList.contains('MShide')) {
            templateTrackSettings!.classList.replace('MShide', 'MSshow');
            templateTrackList!.classList.replace('MShideTemplateTracks', 'MSshowTemplateTracks');
        }

    }

    return (
        <Fragment>
            {TrackList.map((track) => (
                <TrackRows
                    key={track.id}
                    id={track.id}
                    onAdd={() => addTrack(track.id)}
                    onDelete={() => removeTrack(track.id)}
                    setSelectedTrack={() => settingsOpen(track.id)}
                    selectedTrackDelay={selectedTrackDelay} />
            ))}
        </Fragment>
    )
}