import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'

interface SelectedTrackProviderProps {
    children: ReactNode;
}

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
            high: undefined
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
                    high: null
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
                    high: undefined
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

interface SelectedTrackContextProps {
    selectedTrack: TrackListProps | null;
    setSelectedTrack: Dispatch<SetStateAction<TrackListProps | null>>;
}

export const SelectedTrack = createContext({} as SelectedTrackContextProps)

export const SelectedTrackProvider = ({ children }: SelectedTrackProviderProps) => {

    const [TrackList, setTracks] = useState<TrackListProps[]>([defaultTrackData])

    const [selectedTrack, setSelectedTrack] = useState<TrackListProps | null>(TrackList[0])

    return (
        <SelectedTrack.Provider value={{ selectedTrack, setSelectedTrack }}>
            {children}
        </SelectedTrack.Provider>
    )
}