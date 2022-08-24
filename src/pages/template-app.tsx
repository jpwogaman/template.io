import { Fragment, useState } from 'react';
import { TrackListTable } from './track-list';
import { TrackSettings } from './track-settings';
import { TemplateNavbar } from './template-navbar';
import { SelectedTrackProvider } from '../data/track-list/track-context'

export interface TrackListProps {
    id: string
    locked: boolean
    name: string | undefined
    channel: number | undefined
    fullRange: {
        id: string
        name: string | undefined
        low: string | number | undefined
        high: string | number | undefined
        whiteKeysOnly: boolean | undefined
    }[]
    baseDelay: number | undefined
    avgDelay: number | undefined | null
    artList: {
        id: string
        name: string | undefined
        toggle: boolean
        codeType: string | undefined
        code: string | number | undefined
        on: number | undefined | null
        off: number | undefined | null
        range: {
            id: string | undefined | null
            name: string | undefined | null
            low: string | number | undefined | null
            high: string | number | undefined | null
            whiteKeysOnly: boolean | undefined | null
        }[]
        default: string | boolean
        delay: number
        changeType: boolean | undefined
    }[],
    fadList: {
        id: string
        name: string | undefined
        codeType: string | undefined
        code: string | number | undefined
        default: number | undefined
        changeType: boolean | undefined
    }[]
}

const defaultTrackData = {
    id: "01",
    locked: false,
    name: '',
    channel: 1,
    fullRange: [
        {
            id: '01',
            name: undefined,
            low: undefined,
            high: undefined,
            whiteKeysOnly: false
        }
    ],
    baseDelay: 0,
    avgDelay: undefined,
    artList: [
        {
            id: "01",
            name: undefined,
            toggle: true,
            codeType: undefined,
            code: undefined,
            on: undefined,
            off: undefined,
            range: [
                {
                    id: null,
                    name: null,
                    low: null,
                    high: null,
                    whiteKeysOnly: null
                }
            ],
            default: 'on', //setting choice later
            delay: 0,
            changeType: undefined
        },
        {
            id: "02",
            name: undefined,
            toggle: false,
            codeType: undefined,
            code: undefined,
            on: undefined,
            off: undefined,
            range: [
                {
                    id: '01',
                    name: undefined,
                    low: undefined,
                    high: undefined,
                    whiteKeysOnly: false
                }
            ],
            default: true,
            delay: 0,
            changeType: undefined
        }
    ],
    fadList: [
        {
            id: '01',
            name: undefined,
            codeType: undefined,
            code: undefined,
            default: undefined,
            changeType: undefined
        }
    ]
}

export default function TemplateData() {

    const [TrackList, setTracks] = useState<TrackListProps[]>([defaultTrackData])

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
