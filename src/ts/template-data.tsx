import { useState } from 'react';
import TrackList from './track-list';
import TrackSettings from './track-settings';


export default function TemplateData() {

    const [selectedTrack, setSelectedTrack] = useState<string>("01")
    const [selectedTrackName, setSelectedTrackName] = useState<string>("01")

    return (
        <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
            <TrackList setSelectedTrack={setSelectedTrack} setSelectedTrackName={setSelectedTrackName} />
            <TrackSettings selectedTrack={selectedTrack} selectedTrackName={selectedTrackName} />
        </div>
    )
} 
