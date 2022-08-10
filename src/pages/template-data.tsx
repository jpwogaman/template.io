import { createContext, Fragment, useState } from 'react';
import { TrackListTable } from './track-list';
import { TrackSettings } from './track-settings';
import { TemplateNavbar } from './template-navbar';

export const SelectedTrackContext = createContext('01')

export interface TrackListProps {
    id: string,
    name: string;
}

export default function TemplateData() {

    const [TrackList, setTracks] = useState<TrackListProps[]>([
        {
            id: "01",
            name: ''
        }
    ])


    const [selectedTrack, setSelectedTrack] = useState<string>("01")

    const [selectedTrackName, setSelectedTrackName] = useState<string>("")
    const [selectedTrackDelay, setSelectedTrackDelay] = useState<string>('0')
    const [trackCount, setTrackCount] = useState<number>(TrackList.length)

    return (
        <Fragment>
            <SelectedTrackContext.Provider value={''}>
                <TemplateNavbar trackCount={trackCount}></TemplateNavbar>
                <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
                    <TrackListTable
                        TrackList={TrackList}
                        setTracks={setTracks}

                        setSelectedTrack={setSelectedTrack}
                        setSelectedTrackName={setSelectedTrackName}
                        setTrackCount={setTrackCount}


                        selectedTrackDelay={selectedTrackDelay}
                    />
                    <TrackSettings
                        selectedTrack={selectedTrack}
                        selectedTrackName={selectedTrackName}
                        setSelectedDelay={setSelectedTrackDelay} />
                </div>
            </SelectedTrackContext.Provider>
        </Fragment>
    )
}
