import { Fragment, useState } from 'react';
import { TrackList } from './track-list';
import { TrackSettings } from './track-settings';
import { TemplateNavbar } from './navbar';


export default function TemplateData() {

    const [selectedTrack, setSelectedTrack] = useState<string>("01")
    const [selectedTrackName, setSelectedTrackName] = useState<string>("01")
    const [selectedTrackDelay, setSelectedTrackDelay] = useState<string>('0')
    const [trackCount, setTrackCount] = useState<number>(1)

    return (
        <Fragment>
            <TemplateNavbar trackCount={trackCount}></TemplateNavbar>
            <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
                <TrackList setSelectedTrack={setSelectedTrack} setSelectedTrackName={setSelectedTrackName} selectedTrackDelay={selectedTrackDelay} setTrackCount={setTrackCount} />
                <TrackSettings selectedTrack={selectedTrack} selectedTrackName={selectedTrackName} setSelectedDelay={setSelectedTrackDelay} />
            </div>
        </Fragment>
    )
}
