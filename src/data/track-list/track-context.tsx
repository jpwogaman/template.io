import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'

interface SelectedTrackProviderProps {
    children: ReactNode;
}

interface TrackListProps {
    id: string
    name: string
}

interface SelectedTrackContextProps {
    selectedTrack: TrackListProps | null;
    setSelectedTrack: Dispatch<SetStateAction<TrackListProps | null>>;
}

export const SelectedTrack = createContext({} as SelectedTrackContextProps)

export const SelectedTrackProvider = ({ children }: SelectedTrackProviderProps) => {

    const [TrackList, setTracks] = useState<TrackListProps[]>([
        {
            id: "01",
            name: ''
        }
    ])

    const [selectedTrack, setSelectedTrack] = useState<TrackListProps | null>(TrackList[0])

    return (
        <SelectedTrack.Provider value={{ selectedTrack, setSelectedTrack }}>
            {children}
        </SelectedTrack.Provider>
    )
}