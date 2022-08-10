import { createContext, FC, ReactNode, useContext, useState } from 'react'


interface SelectedTrackContextProps {
    children: ReactNode;
}

interface TrackListProps {
    id: string,
    name: string;
}

export const SelectedTrackContext: FC<SelectedTrackContextProps> = ({ children }) => {

    const [TrackList, setTracks] = useState<TrackListProps[]>([
        {
            id: "01",
            name: ''
        }
    ])


    const SelectedTrack = createContext(TrackList[0].id)
    const SelectedTrackUpdate = createContext('01')

    // const [selectedTrack, setSelectedTrack] = useState<TrackListProps>(TrackList[0])

    return (
        <SelectedTrack.Provider value={'01'}>
            <SelectedTrackUpdate.Provider value={''}>
                {children}
            </SelectedTrackUpdate.Provider>
        </SelectedTrack.Provider>
    )


}