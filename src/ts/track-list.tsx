import { ChangeEvent, FC, Fragment, ReactNode, useState } from 'react';
import { TdSelect } from './select';
import ColorPicker from './color-picker'
import { TdInput, Input } from './input';
import { IconBtnToggle } from './button-icon-toggle';
import { devMode } from './track-settings'

const settingsOpen = () => {

    if (document.getElementById('TemplateTrackSettings')!.classList.contains('MShide')) {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MShide', 'MSshow');
        document.getElementById('TemplateTracks')!.classList.replace('MShideTemplateTracks', 'MSshowTemplateTracks');
    }
    else return
}
interface TrackRowProps {
    id: string;
    children?: ReactNode;
    onAdd?: () => void | void | undefined;
    onDelete?: () => void | void | undefined;
}

const TrackRow: FC<TrackRowProps> = ({ id, onAdd, onDelete }) => {

    const nameOption =
        <TdInput
            id={`trkName_${id}`}
            title="Set the NAME for this track or multi."
            placeholder="Track Name"
            codeDisabled={false}>
        </TdInput>

    const chnOption =
        <div title="Set the MIDI channel for this track or multi.">
            <TdSelect id={`trkChn_${id}`} options="chnMidiList"></TdSelect>
        </div>

    const smpOutOption =
        <div title="Set the sampler outputs for this track or multi." >
            <TdSelect id={`trkSmpOut_${id}`} options="smpOutsList"></TdSelect>
        </div >

    const vepOutOption =
        <div title="Set the instance outputs for this track or multi.">
            <TdSelect id={`trkVepOut_${id}`} options="vepOutsList"></TdSelect>
        </div >

    const editTrack =
        <div className='flex justify-evenly'>
            <button
                className="w-6 h-6 mr-1 hover:border-green-50"
                title="Edit Track Parameters"
                onClick={settingsOpen}>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <IconBtnToggle
                classes="w-6 h-6 hover:scale-[1.15] hover:animate-pulse"
                titleA="Add Another Track."
                titleB="Remove This Track."
                id={`AddTrackButton_${id}`}
                a="fa-solid fa-plus"
                b="fa-solid fa-minus"
                defaultIcon="a"
                onToggleA={onAdd}
                onToggleB={onDelete}>
            </IconBtnToggle>
        </div >

    const trackTr =
        `bg-zinc-300 
        dark:bg-stone-800 
        hover:bg-zinc-500 
        dark:hover:bg-zinc-400 
	    hover:text-zinc-50 
        dark:hover:text-zinc-50`

    const trackTd =
        `border-2 
        border-zinc-400 
        dark:border-zinc-600
	    p-0.5`

    return (
        <tr id={"trk_" + id} className={`${trackTr}`}>
            <td className={`${trackTd}`} id={`trkNumb_${id}`} title="Unique Track Number">{parseInt(id)}</td>
            <td className={`${trackTd}`}>{nameOption}</td>
            <td className={`${trackTd}`}>{chnOption}</td>

            {!devMode ?
                <Fragment>
                    <td className={`${trackTd}`}>{smpOutOption}</td>
                    <td className={`${trackTd}`}>{vepOutOption}</td>
                </Fragment>
                : null}

            <td className={`${trackTd}`}>{editTrack}</td>
        </tr>
    );
};

interface TracksProps {

}

const Tracks: FC<TracksProps> = () => {

    const [TrackList, setTracks] = useState<any[]>([
        {
            id: "01"
        }
    ])

    const addTrack = (trackId: string) => {

        let newTrackIdNumb: number = parseInt(trackId) + 1

        let newTrackIdStr: string = newTrackIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newTrack = { id: newTrackIdStr }
        setTracks([...TrackList, newTrack])
    }

    const removeTrack = (trackId: string) => {

        if (TrackList.length !== 1) {
            setTracks(TrackList.filter((Track) => Track.id !== trackId));
        }
    }

    return (
        <Fragment>
            {TrackList.map((track) => (
                <TrackRow
                    key={track.id}
                    id={track.id}
                    onAdd={() => addTrack(track.id)}
                    onDelete={() => removeTrack(track.id)}

                />
            ))}
        </Fragment>
    )
}

interface SamplerInfoProps {

}
const SamplerInfo: FC<SamplerInfoProps> = () => {

    return (
        <Fragment>
            <ul className='w-1/3'>
                <li>Sampler No. 1</li>
                <li>0 Tracks</li>
                <li>0 Multis</li>
            </ul>
            <div className='flex items-center mt-1 mb-1 w-1/3' >
                <div
                    title='Set the color for this sampler.'
                    className='w-1/12'>
                    <ColorPicker />
                </div>
                <div className='ml-1 w-11/12'>
                    <TdInput
                        id={"smpName_"}
                        title='Set the name for this sampler.'
                        placeholder="Instrument/Multi Name"
                        codeDisabled={false}>
                    </TdInput>
                </div>

            </div>
            <div title="Sampler Manufacturer" className='w-1/3 mb-2'>
                <TdSelect id="smpType" options="smpTypeList"></TdSelect>
            </div >

        </Fragment>
    )
}

let addMltTrkInput: string | number | HTMLInputElement = 1

const addMultipleTracks = (event: ChangeEvent<HTMLInputElement>) => {

    addMltTrkInput = event.target.value

};

export default function TrackList() {

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
        <div id="TemplateTracks" className="MShideTemplateTracks h-[100%] overflow-auto float-left transition-all duration-1000">
            <div className='p-4 bg-stone-300 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200'>
                <div id="trackList_toolbar" className="">
                    <div className='flex justify-between align-middle mb-2' >
                        <button
                            className="px-4 w-50 h-50 text-xl border-2 border-zinc-900 dark:border-zinc-200 hover:border-red-600 hover:scale-[1.15] hover:animate-pulse"
                            title="Re-number Tracks. CAREFUL"
                            id="renumberTracks"
                            onClick={console.log('renumber') as undefined}>
                            <i className="fa-solid fa-arrow-down-1-9"></i>
                        </button>
                        <button
                            className="w-30 h-10 text-xl border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                            title={`Add Multiple Tracks. (${addMltTrkInput})`}
                            id="addMultipleTracks"
                            onClick={console.log('add') as undefined}>
                            <i className="pl-2 fa-solid fa-plus"></i>
                            <Input
                                id={"addMltTrkInput"}
                                title='Set the number of tracks to add.'
                                placeholder="1"
                                codeDisabled={false}
                                onSubmit={addMultipleTracks}>
                            </Input>
                        </button>


                    </div >
                </div >

                <table className='table-auto border-collapse text-left lg:text-sm md:text-xs w-full'>
                    <thead>
                        <tr>
                            <th className={`${trackTh} w-[05%]`} title="Unique Track Number">No.</th>
                            <th className={`${trackTh} w-[45%]`} title="Set the MIDI channel for this track or multi.">Name</th>
                            <th className={`${trackTh} w-[10%]`} title="Set the NAME for this track or multi.">MIDI Channel</th>
                            {!devMode ?
                                <Fragment>
                                    <th className={`${trackTh} w-[10%]`} title="Set the sampler outputs for this track or multi.">Sampler Outputs</th>
                                    <th className={`${trackTh} w-[10%]`} title="Set the instance outputs for this track or multi.">Instance Outputs</th>
                                </Fragment>
                                : null}
                            <th className={`${trackTh} w-[20%]`} title="Edit Track Parameters"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Tracks></Tracks>
                    </tbody>
                </table>
            </div>
        </div >
    );
};