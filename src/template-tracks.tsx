import { FC, ChangeEvent, Fragment, useState } from 'react';
import { Col, Form, Container, Button, Table, ButtonGroup, InputGroup, ListGroup } from 'react-bootstrap';
import { samplerList, chnListMidi, outListSmp, outListVep, smpListAll } from './template-arrays';
import ColorPicker from './template-color-picker'

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
    const [valueChn, setChn] = useState<string>("")
    const [valueSmpOut, setSmpOut] = useState<string>("")
    const [valueVepOut, setVepOut] = useState<string>("")
    const [valueName, setName] = useState<string>("")

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const chnChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setChn(event.target.value)
    }
    const smpOutChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSmpOut(event.target.value)
    }
    const vepOutChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVepOut(event.target.value)
    }

    const nameOption =
        <Form.Group title="Set the NAME for this track or multi.">
            <Form.Control
                size="sm"
                type="text"
                value={valueName}
                id={"trkName_" + id}
                placeholder="Track Name"
                onChange={nameChange}>
            </Form.Control>
        </Form.Group >

    const chnOption =
        <Form.Group title="Set the MIDI channel for this track or multi.">
            <Form.Select
                as={Col}
                size="sm"
                value={valueChn}
                id={"trkChn_" + id}
                onChange={chnChange}>
                {chnListMidi}
            </Form.Select>
        </Form.Group>

    const smpOutOption =
        <Form.Group title="Set the sampler outputs for this track or multi." >
            <Form.Select
                as={Col}
                size="sm"
                value={valueSmpOut}
                id={"trkSmpOut_" + id}
                onChange={smpOutChange}>
                {outListSmp}
            </Form.Select>
        </Form.Group >

    const vepOutOption =
        <Form.Group title="Set the instance outputs for this track or multi.">
            <Form.Select
                as={Col}
                size="sm"
                value={valueVepOut}
                id={"trkVepOut_" + id}
                onChange={vepOutChange}>
                {outListVep}
            </Form.Select >
        </Form.Group >

    const editTrack =
        <ButtonGroup>
            <Button
                variant="primary"
                size="sm"
                title="Edit Track Parameters"
                onClick={settingsOpen}>
                <i className="fa-solid fa-pen-to-square"></i>
            </Button>
            <Button
                variant="primary"
                size="sm"
                title="Delete Track"
                onClick={() => onDelete}>
                <i className="fas fa-xmark" />
            </Button>
            <Button
                variant="primary"
                size="sm"
                title="Add Track"
                onClick={() => onAdd}>
                <i className="fas fa-plus" />
            </Button>
        </ButtonGroup >

    return (
        <tr id={"trk_" + id} className="align-middle">
            <td id={"trkNumb_" + id}>{parseInt(id)}</td>
            <td>{nameOption}</td>
            <td>{chnOption}</td>
            <td>{smpOutOption}</td>
            <td>{vepOutOption}</td>
            <td>{editTrack}</td>
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

        if (TrackList.length != 1) {
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

    const [samplerType, setSamplerType] = useState<string>(samplerList[0])
    const [valueName, setName] = useState<string>("")

    const changeSampler = (event: ChangeEvent<HTMLSelectElement>) => {
        setSamplerType(event.target.value)
    }

    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    return (
        <Fragment>
            <ListGroup horizontal>
                <ListGroup.Item>Sampler No. 1</ListGroup.Item>
                <ListGroup.Item>0 Tracks</ListGroup.Item>
                <ListGroup.Item>0 Multis</ListGroup.Item>
            </ListGroup>
            <InputGroup size="sm">
                <ColorPicker />
                <Form.Control
                    size="sm"
                    type="text"
                    value={valueName}
                    id={"smpName_"}
                    placeholder="Instrument/Patch/Sampler/Multi Name"
                    onChange={nameChange}>
                </Form.Control>
                <Form.Group title="Sampler Type">
                    <Form.Select
                        as={Col}
                        size="sm"
                        value={samplerType}
                        id="smpType"
                        onChange={changeSampler}>
                        {smpListAll}
                    </Form.Select >
                </Form.Group >
            </InputGroup>
        </Fragment>
    )
}


export default function TemplateTracks() {

    return (
        <Container id="TemplateTracks" className="MShideTemplateTracks">
            <Container id="trackList_01-01">
                <SamplerInfo />
                <Table hover responsive className='table-condensed'>
                    <thead>
                        <tr>
                            <th data-width="3%">No.</th>
                            <th data-width="52%">Name</th>
                            <th data-width="14%">MIDI Channel</th>
                            <th data-width="14%">Sampler Outputs</th>
                            <th data-width="14%">Instance Outputs</th>
                            <th data-width="3%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Tracks></Tracks>
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};