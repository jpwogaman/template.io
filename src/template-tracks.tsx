import { render } from '@testing-library/react';
import { Fragment, useState } from 'react';
import { Col, Form, Container, Button, Table, ButtonGroup } from 'react-bootstrap';
import { midiChannelsArray, instanceOutputsArray, samplerOutputsArray } from './template-arrays';
import ColorPicker from './template-color-picker'

function NumberList(props: { numbers: any; }) {
    const numbers = props.numbers;
    const listItems = numbers.map((number: string | number) =>
        <option key={number!.toString()} value={number!.toString()}>
            {number}
        </option>);
    return (
        listItems
    );
}

const settingsOpen = function () {

    if (document.getElementById('TemplateTrackSettings')!.classList.contains('MShide')) {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MShide', 'MSshow');
        document.getElementById('TemplateTracks')!.classList.replace('MShideTemplateTracks', 'MSshowTemplateTracks');
    }
    else return
}

function TrackRow(props: { id: any; onDelete: any; onAdd: any }) {

    const id = props.id;
    const onDelete = props.onDelete;
    const onAdd = props.onAdd;

    const [valueChn, setChn] = useState("")
    const [valueSmpOut, setSmpOut] = useState("")
    const [valueVepOut, setVepOut] = useState("")
    const [valueName, setName] = useState("")

    const chnChange = function (event: any) {
        setChn((event!.target! as HTMLInputElement).value)
    }
    const smpOutChange = function (event: any) {
        setSmpOut((event!.target! as HTMLInputElement).value)
    }
    const vepOutChange = function (event: any) {
        setVepOut((event!.target! as HTMLInputElement).value)
    }
    const nameChange = function (event: any) {
        setName((event!.target! as HTMLInputElement).value)
    }

    const chnListMidi =
        <NumberList numbers={midiChannelsArray} />

    const outListSmp =
        <NumberList numbers={samplerOutputsArray} />

    const outListVep =
        <NumberList numbers={instanceOutputsArray} />

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

    const nameOption =
        <Form.Group title="Set the NAME for this track or multi.">
            <Form.Control
                size="sm"
                type="text"
                value={valueName}
                id={"trkName_" + id}
                onChange={nameChange}>
            </Form.Control>
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
                onClick={onDelete}>
                <i className="fas fa-xmark" />
            </Button>
            <Button
                variant="primary"
                size="sm"
                title="Add Track"
                onClick={onAdd}>
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

function Tracks() {

    const [TrackList, setTracks] = useState([
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

    function addTrack(id: string) {

        const trackIndex: number = TrackList.findIndex(i => i.id === id)
        const selectedTrack: string = 'trk_' + id

        let newIdNumb: number = parseInt(id) + 1


        let newIdStr: string = newIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

        console.log(`selectedTrack: ${selectedTrack} TrackList[Index]: ${trackIndex}`)
        console.log(`nextTrackId: ${newIdStr}`)

        // const newTrack = { newId }
        // setTracks([...TrackList, newTrack])
    }

    function removeTrack(id: string) {
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

export default function TemplateTracks() {

    return (
        <Container id="TemplateTracks" className="MShideTemplateTracks">
            <Container id="trackList_01-01">
                <ColorPicker />
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