import { Fragment, useContext, useState } from 'react';
import { TrackListTable } from './track-list';
import { TrackSettings } from './track-settings';
import { TemplateNavbar } from './template-navbar';
import { SelectedTrack } from '../data/track-list/track-context'
import { SelectedTrackProvider } from '../data/track-list/track-context'

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

    const SelectedTrackContext = useContext(SelectedTrack)

    const showTrack = () => {

        SelectedTrackContext.setSelectedTrack(
            {
                id: '01',
                name: ''
            }
        )
        console.log(SelectedTrackContext.selectedTrack?.id)
    }

    return (
        <Fragment>
            <SelectedTrackProvider>
                <div
                    className='bg-black h-10 w-10 absolute top-[200px] left-16'
                    onClick={showTrack}

                ></div>
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
            </SelectedTrackProvider>
        </Fragment>
    )
}
