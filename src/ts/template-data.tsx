import { useState } from 'react';
import TrackList from './track-list';
import TrackSettings from './track-settings';


export default function TemplateData() {

    const [selectedTrack, setSelectedTrack] = useState<any>("Track 2:")

    return (
        <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
            <TrackList setSelectedTrack={setSelectedTrack} />
            <TrackSettings />
        </div>
    )
} 
