import React, { useState, Fragment, Component } from 'react';
import { DropdownButton, Dropdown, Row, Col, Form, Container, Button, ButtonGroup, ButtonToolbar, Table } from 'react-bootstrap';
import { midiChannelsArray, instanceOutputsArray, samplerOutputsArray } from './template-arrays';

function NumberList(props: { numbers: any; }) {
    const numbers = props.numbers;
    const listItems = numbers.map((number: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) =>
        <option key={number!.toString()} value={number!.toString()}>
            {number}
        </option>);
    return (
        listItems
    );
};

const settingsOpen = function () {

    if (document.getElementById('TemplateTrackSettings')!.classList.contains('MShide')) {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MShide', 'MSshow');
        document.getElementById('TemplateTracks')!.classList.replace('MShideTemplateTracks', 'MSshowTemplateTracks');
    }
    else return
}

function TrackRow(props: { id: any; }) {

    const id = props.id;

    const [valueType, setType] = useState("")
    const [valueChn, setChn] = useState("")
    const [valueSmpOut, setSmpOut] = useState("")
    const [valueVepOut, setVepOut] = useState("")
    const [valueName, setName] = useState("")

    const chnChange = function () {
        setChn((event!.target! as HTMLInputElement).value)
    }
    const smpOutChange = function () {
        setSmpOut((event!.target! as HTMLInputElement).value)
    }
    const vepOutChange = function () {
        setVepOut((event!.target! as HTMLInputElement).value)
    }
    const nameChange = function () {
        setName((event!.target! as HTMLInputElement).value)
    }

    const chnListMidi =
        <NumberList numbers={midiChannelsArray}></NumberList>

    const outListSmp =
        <NumberList numbers={samplerOutputsArray}></NumberList>

    const outListVep =
        <NumberList numbers={instanceOutputsArray}></NumberList>

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
        <Button
            variant="primary"
            size="sm"
            title="Edit Track Parameters"
            onClick={settingsOpen}>
            <i className="fa-solid fa-pen-to-square"></i>
        </Button>

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

export default function TemplateTracks() {

    return (
        <Container id="TemplateTracks" className="MShideTemplateTracks">
            <Container id="trackList_01-01">
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
                        <TrackRow id="01"></TrackRow>
                        <TrackRow id="02"></TrackRow>
                        <TrackRow id="03"></TrackRow>
                        <TrackRow id="04"></TrackRow>
                    </tbody>
                </Table>
            </Container>
        </Container>
    );
};