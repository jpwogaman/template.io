import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { TdInput } from '../components/td-input';
import { TrackRows } from '../data/track-list/track-rows';
import { TrackListProps } from './template-data';


interface TrackListTableProps {
    setSelectedTrack: Dispatch<SetStateAction<string>>;
    setSelectedTrackName: Dispatch<SetStateAction<string>>;
    setTrackCount: Dispatch<SetStateAction<number>>;
    selectedTrackDelay: string;
    TrackList: TrackListProps[];
    setTracks: Dispatch<SetStateAction<TrackListProps[]>>;
}

export const TrackListTable: FC<TrackListTableProps> = ({ TrackList, setTracks, setTrackCount, selectedTrackDelay, setSelectedTrackName, setSelectedTrack }) => {

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

        if (addMltTrkInput > 200) {
            return alert('You can only add 200 tracks at a time.')
        }

        for (let i = 0; i < addMltTrkInput; i++) {

            const newTrackIdNumb: number = parseInt(lastTrackId) + 1 + i
            const newTrackIdStr: string = newTrackIdNumb.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            newTrackIdStrArr.push(newTrackIdStr)
        }

        const NewTracks = newTrackIdStrArr.map((newTrackId) => (
            {
                id: newTrackId,
                name: ''
            }
        ))

        setTracks(TrackList.concat(NewTracks) as TrackListProps[])
        setTrackCount(TrackList.length + NewTracks.length)
    };

    const removeTrack = (trackId: string) => {

        if (TrackList.length !== 1) {
            setTracks(TrackList.filter((Track) => Track.id !== trackId));
        }
        setTrackCount(TrackList.length - 1)
    }

    const settingsOpen = (trackId: string) => {

        const selectedTrackID: HTMLElement | null = document.getElementById(`trk_${trackId}`)
        const selectedTrackName = document.getElementById(`trkName_${trackId}`) as HTMLInputElement
        const templateTrackSettings: HTMLElement | null = document.getElementById('TemplateTrackSettings')
        const templateTrackList: HTMLElement | null = document.getElementById('TemplateTracks')

        setSelectedTrack!(trackId)
        setSelectedTrackName!(selectedTrackName!.value)

        selectedTrackID!.classList.replace('bg-zinc-300 dark:bg-stone-800', 'bg-zinc-50 dark:bg-stone-400')

        for (var track in TrackList) {
            const trackId: HTMLElement | null = document.getElementById(`trk_${TrackList[track].id}`)

            if (trackId !== selectedTrackID) {
                trackId!.classList.replace('bg-zinc-50', 'bg-zinc-300')
                trackId!.classList.replace('dark:bg-stone-400', 'dark:bg-stone-800')
            }
        }

        if (templateTrackSettings!.classList.contains('MShide')) {
            templateTrackSettings!.classList.replace('MShide', 'MSshow');
            templateTrackList!.classList.replace('MShideTemplateTracks', 'MSshowTemplateTracks');
        }

    }

    // const renumberTracks = () => {

    //     //React is ignoring the window.confirm! it is just renumbering the tracks anyway and showing the message...

    //     if (window.confirm('CAREFUL - this might completely mess up your beautiful template, especially if this track list is synced with an instance of Open Stage Control. \n\nAre you sure you want to renumber your track list?')) {

    //         const newTrackIdStrArr: TrackListProps[] = []

    //         for (let i = 0; i < TrackList.length; i++) {

    //             const newTrackIdNumb: number = 1 + i
    //             const newTrackIdStr: string = newTrackIdNumb.toLocaleString('en-US', {
    //                 minimumIntegerDigits: 2,
    //                 useGrouping: false
    //             })
    //             newTrackIdStrArr.push(
    //                 {
    //                     id: newTrackIdStr,
    //                     name: ''
    //                     // name: original track data...
    //                 }
    //             )
    //         }
    //         setTracks(newTrackIdStrArr)
    //     }
    // }

    const trackTh =
        `border-[1.5px]
        border-b-transparent
        border-zinc-100
        dark:border-zinc-400
        bg-zinc-200
        dark:bg-zinc-600
        font-bold
        z-50
        dark:font-normal
        p-1
        sticky top-[1rem]
        `

    return (
        <div id="TemplateTracks" className="MSshowTemplateTracks h-[100%] overflow-y-scroll float-left transition-all duration-1000">
            <div className='w-full h-[1rem] sticky top-0 bg-stone-300 dark:bg-zinc-800'></div>
            <div className='px-4 pb-4 bg-stone-300 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200'>
                {/* <div id="trackList_toolbar" className="sticky top-[1rem]">
                    <div className='h-[35px] max-h-[35px] flex justify-between align-middle mb-2' >
                        <button
                            className="px-4 text-lg border-2 border-zinc-900 dark:border-zinc-200 hover:border-red-600 dark:hover:border-red-600
                            hover:scale-[1.15] hover:animate-pulse"
                            title="Re-number Tracks. CAREFUL"
                            id="renumberTracks"
                            onClick={renumberTracks}>
                            <i className="fa-solid fa-arrow-down-1-9"></i>
                        </button>                     
                    </div >
                </div > */}

                <table className='table-auto border-separate border-spacing-0 text-left lg:text-sm md:text-xs w-full'>
                    <thead >
                        <tr>
                            <th className={`${trackTh} w-[05%]`} title="Unique Track Number">No.</th>
                            <th className={`${trackTh} w-[45%]`} title="Set the MIDI channel for this track or multi.">Name</th>
                            <th className={`${trackTh} w-[10%]`} title="Set the NAME for this track or multi.">MIDI Channel</th>
                            {/* <th className={`${trackTh} w-[10%]`} title="Set the sampler outputs for this track or multi.">Sampler Outputs</th>
                            <th className={`${trackTh} w-[10%]`} title="Set the instance outputs for this track or multi.">Instance Outputs</th> */}
                            <th className={`${trackTh} w-[10%]`} title="Track Delay in ms (may be average)">Delay (ms)</th>
                            <th className={`${trackTh} w-[10%]`} title="Edit Track Parameters">
                                <div className='text-xl text-center
                                     hover:scale-[1.15] hover:animate-pulse'>
                                    <button
                                        className=""
                                        title={`Add Tracks. (${addMltTrkInput})`}
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
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            TrackList.map((track) => (
                                <TrackRows
                                    key={track.id}
                                    id={track.id}
                                    onDelete={() => removeTrack(track.id)}
                                    setSelectedTrack={() => settingsOpen(track.id)}
                                    selectedTrackDelay={selectedTrackDelay} />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div >
    );
};