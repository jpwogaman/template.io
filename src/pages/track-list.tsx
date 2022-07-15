import { ChangeEvent, Dispatch, FC, SetStateAction } from 'react';
import { TdInput } from '../components/input';
import { TrackData } from '../data/track-list/track-list-data'


let addMltTrkInput: string | number | HTMLInputElement = 1

const addMultipleTracks = (event: ChangeEvent<HTMLInputElement>) => {

    addMltTrkInput = event.target.value

};

interface TrackListProps {
    setSelectedTrack: Dispatch<SetStateAction<string>>;
    setSelectedTrackName: Dispatch<SetStateAction<string>>;
    setTrackCount: Dispatch<SetStateAction<number>>;
    selectedTrackDelay: string;
}

export const TrackList: FC<TrackListProps> = ({ setTrackCount, selectedTrackDelay, setSelectedTrackName, setSelectedTrack }) => {

    const stupid = () => {
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
                            className="px-4 w-50 h-50 text-xl border-2 border-zinc-900 dark:border-zinc-200 hover:border-red-600 hover:scale-[1.15] hover:animate-pulse"
                            title="Re-number Tracks. CAREFUL"
                            id="renumberTracks"
                            onClick={stupid}>
                            <i className="fa-solid fa-arrow-down-1-9"></i>
                        </button>
                        <button
                            className="w-30 h-10 text-xl border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                            title={`Add Multiple Tracks. (${addMltTrkInput})`}
                            id="addMultipleTracks"
                            onClick={stupid}>
                            <i className="pl-2 mr-2 fa-solid fa-plus"></i>
                            <TdInput
                                td={false}
                                id={"addMltTrkInput"}
                                title='Set the number of tracks to add.'
                                placeholder="1"
                                codeDisabled={false} >
                            </TdInput>
                        </button>
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
                        <TrackData setSelectedTrack={setSelectedTrack} setSelectedTrackName={setSelectedTrackName} selectedTrackDelay={selectedTrackDelay} setTrackCount={setTrackCount}></TrackData>
                    </tbody>
                </table>
            </div>
        </div >
    );
};