import { FC, ChangeEvent, Fragment, useState } from 'react';
import { TdSelect } from './select';
import ColorPicker from './color-picker'

const settingsOpen = () => {

    if (document.getElementById('TemplateTrackSettings')!.classList.contains('MShide')) {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MShide', 'MSshow');
        document.getElementById('TemplateTracks')!.classList.replace('MShideTemplateTracks', 'MSshowTemplateTracks');
    }
    else return
}
interface TrackRowProps {
    id: string;
    onDelete: any;
    onAdd: any;
    // onDelete: (id: string) => MouseEventHandler<HTMLButtonElement>;
    // onAdd: (id: string) => MouseEventHandler<HTMLButtonElement>;
}

const TrackRow: FC<TrackRowProps> = ({ id, onDelete, onAdd }) => {
    const [valueName, setName] = useState<string>("")
    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const nameOption =
        <div title="Set the NAME for this track or multi.">
            <input
                className='min-w-full bg-inherit hover:cursor-pointer focus:cursor-text focus:bg-white placeholder-black focus:placeholder-gray-400 border border-transparent focus:border-white focus:outline-none'
                type="text"
                value={valueName}
                id={`trkName_${id}`}
                placeholder="Track Name"
                onChange={nameChange}>
            </input>
        </div >

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
                className="w-6 h-6 border border-black mr-1 hover:border-green-50"
                title="Edit Track Parameters"
                onClick={settingsOpen}>
                <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
                className="w-6 h-6 border border-black mr-1 hover:border-green-50"
                title="Delete Track"
                onClick={() => onDelete}>
                <i className="fas fa-xmark" />
            </button>
            <button
                className="w-6 h-6 border border-black mr-1 hover:border-green-50"
                title="Add Track"
                onClick={() => onAdd}>
                <i className="fas fa-plus" />
            </button>
        </div >

    return (
        <tr id={"trk_" + id}>
            <td className='p-0.5 border-2 border-gray-600' id={`trkNumb_${id}`}>{parseInt(id)}</td>
            <td className='p-0.5 border-2 border-gray-600'>{nameOption}</td>
            <td className='p-0.5 border-2 border-gray-600'>{chnOption}</td>
            <td className='p-0.5 border-2 border-gray-600'>{smpOutOption}</td>
            <td className='p-0.5 border-2 border-gray-600'>{vepOutOption}</td>
            <td className='p-0.5 border-2 border-gray-600'>{editTrack}</td>
        </tr>
    );
};

interface TracksProps {

}

const Tracks: FC<TracksProps> = () => {

    const [TrackList, setTracks] = useState<any[]>([
        {
            id: "01"
        },
        {
            id: "02"
        },
        {
            id: "03"
        }
    ])

    const addTrack = (id: string) => {

        const trackIndex: number = TrackList.findIndex(i => i.id === id)
        const selectedTrack: string = 'trk_' + id

        let newIdNumb: number = parseInt(id) + 1

        let newIdStr: string = newIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

        console.log(`selectedTrack: ${selectedTrack} TrackList[Index]: ${trackIndex}`)
        console.log(`nextTrackId: ${newIdStr}`)

        // const newTrack = { newIdStr }
        // setTracks([...TrackList, newTrack])
    }

    const removeTrack = (id: string) => {
        console.log('remove track', id);

        if (TrackList.length !== 1) {
            setTracks(TrackList.filter((track) => track.id !== id));
        }
    }

    return (
        <Fragment>
            {TrackList.map((track) => (
                <TrackRow
                    key={track.id}
                    id={track.id}
                    onDelete={() => removeTrack(track.id)}
                    onAdd={() => addTrack(track.id)} />
            ))}
        </Fragment>
    )
}

interface SamplerInfoProps {

}
const SamplerInfo: FC<SamplerInfoProps> = () => {

    const [valueName, setName] = useState<string>("")
    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

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
                <input
                    title='Set the name for this sampler.'
                    className='ml-1 w-11/12 bg-inherit hover:cursor-pointer focus:cursor-text focus:bg-white placeholder-black focus:placeholder-gray-400 border border-transparent focus:border-white focus:outline-none'
                    type="text"
                    value={valueName}
                    id={"smpName_"}
                    placeholder="Instrument/Multi Name"
                    onChange={nameChange}>
                </input>
            </div>
            <div title="Sampler Manufacturer" className='w-1/3'>
                <TdSelect id="smpType" options="smpTypeList"></TdSelect>
            </div >

        </Fragment>
    )
}

export default function TrackList() {

    return (
        <div id="TemplateTracks" className="MShideTemplateTracks absolute bg-main-gray transition-all duration-1000">
            <div id="trackList_01-01" className="p-4">
                <SamplerInfo />
                <table className='table-auto border-collapse text-left text-sm min-w-full'>
                    <thead>
                        <tr>
                            <th className='p-0.5 border-2 border-gray-100 border-b-gray-600 w-[05%]' title="Unique Track Number">No.</th>
                            <th className='p-0.5 border-2 border-gray-100 border-b-gray-600 w-[45%]' title="Set the MIDI channel for this track or multi.">Name</th>
                            <th className='p-0.5 border-2 border-gray-100 border-b-gray-600 w-[10%]' title="Set the NAME for this track or multi.">MIDI Channel</th>
                            <th className='p-0.5 border-2 border-gray-100 border-b-gray-600 w-[10%]' title="Set the sampler outputs for this track or multi.">Sampler Outputs</th>
                            <th className='p-0.5 border-2 border-gray-100 border-b-gray-600 w-[10%]' title="Set the instance outputs for this track or multi.">Instance Outputs</th>
                            <th className='p-0.5 border-2 border-gray-100 border-b-gray-600 w-[20%]' title="Edit Track Parameters"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Tracks></Tracks>
                    </tbody>
                </table>
            </div>
        </div>
    );
};