import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { TdInput } from '../components/td-input';
import { TrackData } from '../data/track-list/track-data'

interface TrackListProps {
    setSelectedTrack: Dispatch<SetStateAction<string>>;
    setSelectedTrackName: Dispatch<SetStateAction<string>>;
    setTrackCount: Dispatch<SetStateAction<number>>;
    selectedTrackDelay: string;
}

export const TrackList: FC<TrackListProps> = ({ setTrackCount, selectedTrackDelay, setSelectedTrackName, setSelectedTrack }) => {

    const [TrackList, setTracks] = useState<{ id: string }[]>([
        {
            id: "01"
        }
    ])

    let [addMltTrkInput, setMltTrkInput] = useState<number>(1)

    const setTrackAddNumber = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value as unknown as number
        if (input > 1) {
            setMltTrkInput(input)
        }
        else {
            setMltTrkInput(1)
        }
    }

    const addMultipleTracks = () => {

        const lastTrackId = TrackList[TrackList.length - 1].id

        const newTrackIdStrArr: string[] = []

        for (let i = 0; i < addMltTrkInput; i++) {

            const newTrackIdNumb: number = parseInt(lastTrackId) + 1 + i
            const newTrackIdStr: string = newTrackIdNumb.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            newTrackIdStrArr.push(newTrackIdStr)
        }

        const newTrack = newTrackIdStrArr.map((newTrackId) => (
            { id: newTrackId }
        ))

        setTracks(TrackList.concat(newTrack))
        setTrackCount(TrackList.length + newTrackIdStrArr.length)

    };

    const renumberTracks = () => {
        console.log("setSelectedTrack")
    }

    const trackTh =
        `border-2
        border-zinc-100
        border-b-transparent
        dark:border-zinc-400
        dark:border-b-transparent
        bg-zinc-200
        dark:bg-zinc-600
        font-bold
        dark:font-normal
        p-1`

    return (
        <div id="TemplateTracks" className="MSshowTemplateTracks h-[100%] overflow-auto float-left transition-all duration-1000">
            <div className='p-4 bg-stone-300 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200'>
                <div id="trackList_toolbar" className="">
                    <div className='flex justify-between align-middle mb-2' >
                        <button
                            className="px-4 w-50 h-50 text-lg border-2 border-zinc-900 dark:border-zinc-200 hover:border-red-600 dark:hover:border-red-600
                            hover:scale-[1.15] hover:animate-pulse"
                            title="Re-number Tracks. CAREFUL"
                            id="renumberTracks"
                            onClick={renumberTracks}>
                            <i className="fa-solid fa-arrow-down-1-9"></i>
                        </button>
                        <div className=' text-xl border-2 border-zinc-900 dark:border-zinc-200 
                            hover:border-green-600 dark:hover:border-green-600 
                            hover:scale-[1.15] hover:animate-pulse'>
                            <button
                                className="w-30 h-10"
                                title={`Add Multiple Tracks. (${addMltTrkInput})`}
                                id="addMultipleTracks"
                                onClick={addMultipleTracks}>
                                <i className="pl-2 mr-2 fa-solid fa-plus"></i>
                            </button>
                            <TdInput
                                td={false}
                                id="addMltTrkInput"
                                title='Set the number of tracks to add.'
                                placeholder="1"
                                onInput={setTrackAddNumber}>
                            </TdInput>
                        </div>
                    </div >
                </div >

                <table className='table-auto border-collapse text-left lg:text-sm md:text-xs w-full'>
                    <thead>
                        <tr>
                            <th className={`${trackTh} w-[05%]`} title="Unique Track Number">No.</th>
                            <th className={`${trackTh} w-[45%]`} title="Set the MIDI channel for this track or multi.">Name</th>
                            <th className={`${trackTh} w-[10%]`} title="Set the NAME for this track or multi.">MIDI Channel</th>
                            {/* <th className={`${trackTh} w-[10%]`} title="Set the sampler outputs for this track or multi.">Sampler Outputs</th>
                            <th className={`${trackTh} w-[10%]`} title="Set the instance outputs for this track or multi.">Instance Outputs</th> */}
                            <th className={`${trackTh} w-[10%]`} title="Track Delay in ms (may be average)">Delay (ms)</th>
                            <th className={`${trackTh} w-[10%]`} title="Edit Track Parameters"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <TrackData setSelectedTrack={setSelectedTrack} setSelectedTrackName={setSelectedTrackName} selectedTrackDelay={selectedTrackDelay} setTrackCount={setTrackCount} TrackList={TrackList} setTracks={setTracks}></TrackData>
                    </tbody>
                </table>
            </div>
        </div >
    );
};