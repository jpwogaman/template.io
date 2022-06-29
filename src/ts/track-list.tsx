import { FC, ChangeEvent, Fragment, useState } from 'react';
import { TdSelect } from './select';
import ColorPicker from './color-picker'
import { TdInput } from './input';

const devMode = true

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
            <button
                className="w-6 h-6 mr-1 hover:border-green-50"
                title="Delete Track"
                onClick={() => onDelete}>
                <i className="fas fa-xmark" />
            </button>
            <button
                className="w-6 h-6 mr-1 hover:border-green-50"
                title="Add Track"
                onClick={() => onAdd}>
                <i className="fas fa-plus" />
            </button>
        </div >

    return (
        <tr id={"trk_" + id} className="">
            <td className='p-0.5' id={`trkNumb_${id}`}>{parseInt(id)}</td>
            <td className='p-0.5'>{nameOption}</td>
            <td className='p-0.5'>{chnOption}</td>
            <td className='p-0.5'>{smpOutOption}</td>
            <td className='p-0.5'>{vepOutOption}</td>
            <td className='p-0.5'>{editTrack}</td>
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
                <Fragment>
                    <TrackRow
                        key={track.id}
                        id={track.id}
                        onDelete={() => removeTrack(track.id)}
                        onAdd={() => addTrack(track.id)} />
                    <TrackRow
                        key={track.id}
                        id={track.id}
                        onDelete={() => removeTrack(track.id)}
                        onAdd={() => addTrack(track.id)} />

                </Fragment>
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

export default function TrackList() {

    return (
        <div id="TemplateTracks" className="MShideTemplateTracks transition-all duration-1000">
            <div id="trackList_01-01" className="TrackList p-4">
                {!devMode ? <SamplerInfo /> : null}
                <table className='table-auto border-collapse text-left text-sm min-w-full'>
                    <thead>
                        <tr>
                            <th className='p-0.5 w-[05%]' title="Unique Track Number">No.</th>
                            <th className='p-0.5 w-[45%]' title="Set the MIDI channel for this track or multi.">Name</th>
                            <th className='p-0.5 w-[10%]' title="Set the NAME for this track or multi.">MIDI Channel</th>
                            <th className='p-0.5 w-[10%]' title="Set the sampler outputs for this track or multi.">Sampler Outputs</th>
                            <th className='p-0.5 w-[10%]' title="Set the instance outputs for this track or multi.">Instance Outputs</th>
                            <th className='p-0.5 w-[20%]' title="Edit Track Parameters"></th>
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