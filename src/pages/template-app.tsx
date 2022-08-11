import { Fragment, useContext, useState } from 'react';
import { TrackListTable } from './track-list';
import { TrackSettings } from './track-settings';
import { TemplateNavbar } from './template-navbar';
import { SelectedTrack } from '../data/track-list/track-context'
import { SelectedTrackProvider } from '../data/track-list/track-context'

export interface TrackListProps {
    id: string
    name: string
    baseDelay: number
    avgDelay: number | undefined
    artList: {
        id: string;
        toggle: boolean;
        delay: number;
        default: string | boolean;
    }[],
    fadList: any[]
}

export default function TemplateData() {

    const [TrackList, setTracks] = useState<TrackListProps[]>([
        {
            id: "01",
            name: '',
            baseDelay: 0,
            avgDelay: undefined,
            artList: [
                {
                    id: "01",
                    toggle: true,
                    delay: 0,
                    default: 'on' //setting choice later
                },
                {
                    id: "02",
                    toggle: false,
                    delay: 0,
                    default: true
                }
            ],
            fadList: []
        }
    ])

    const [selectedTrack, setSelectedTrack] = useState<TrackListProps>(TrackList[0])

    const [trackCount, setTrackCount] = useState<number>(TrackList.length)

    // const SelectedTrackContext = useContext(SelectedTrack)

    // const showTrack = () => {

    //     SelectedTrackContext.setSelectedTrack(
    //         {
    //             id: '01',
    //             name: ''
    //         }
    //     )
    //     console.log(SelectedTrackContext.selectedTrack?.id)
    // }

    return (
        <Fragment>
            <SelectedTrackProvider>
                {/* <div
                    className='bg-black h-10 w-10 absolute top-[200px] left-16'
                    onClick={showTrack}

                ></div> */}
                <TemplateNavbar trackCount={trackCount} />
                <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
                    <TrackListTable
                        TrackList={TrackList}
                        setTracks={setTracks}
                        setSelectedTrack={setSelectedTrack}
                        setTrackCount={setTrackCount} />

                    <TrackSettings
                        setSelectedTrack={setSelectedTrack}
                        selectedTrack={selectedTrack}
                        setTracks={setTracks}
                        TrackList={TrackList} />
                </div>
            </SelectedTrackProvider>
        </Fragment>
    )
}
