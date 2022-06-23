import React, { FC, useState, ChangeEvent, Fragment, Component, ReactNode } from 'react';
import { DropdownButton, Dropdown, Row, Col, Form, Container, Button, ButtonGroup, ButtonToolbar, Table } from 'react-bootstrap';
import { allNotes, midiValuesArray, noteValuesArray, pitchValuesArray, SelectList } from './template-arrays';



interface IconBtnToggleProps {
    defaultIcon: string;
    variant: string;
    size: any;
    title: string;
    id: string;
    a: string;
    b: string;
    children?: ReactNode;
}

const IconBtnToggle: FC<IconBtnToggleProps> = ({ defaultIcon, variant, size, title, id, a, b }) => {

    const [isToggleOn, setToggle] = useState<boolean>(defaultIcon === "a" ? true : false)

    const handleClick = () => {
        if (isToggleOn) {
            setToggle(false)
        } else {
            setToggle(true)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            title={title}
            onClick={() => handleClick}
            id={id}>
            <i className={isToggleOn ? a : b}></i>
        </Button>
    );
}
interface SettingsRowProps {
    id: string;
    type: string;
    variant: string | undefined;
}

const SettingsRow: FC<SettingsRowProps> = ({ id, type, variant }) => {

    const [valueType, setType] = useState<string>("")
    const [valueCode, setCode] = useState<string>("")
    const [valueOn, setOn] = useState<string>("")
    const [valueOff, setOff] = useState<string>("")
    const [valueDeft, setDeft] = useState<string>("")
    const [valueName, setName] = useState<string>("")
    const [valueMidi, setMidi] = useState<string[] | number[]>(midiValuesArray)
    const [valueCodeMidi, setCodeMidi] = useState<string[] | number[]>(midiValuesArray)
    const [codeDisabled, setCodeDisabled] = useState<boolean>(false)
    const [isChecked, setChecked] = useState<boolean>(false)
    const [isChecked2, setChecked2] = useState<boolean>(false)
    const [checkVelTitle, setVelTitle] = useState<string>("Switch to Velocity-Based Changes")
    const [checkRngTitle, setRngTitle] = useState<string>("Switch to independent playable range.")
    const [showRngSelect, setRngSelect] = useState<boolean>(false)
    const [nameArtTitle, setNameArtTitle] = useState<string>("Set the NAME for this patch. (i.e Legato On/OFF)")
    const [nameArtTitle2, setNameArtTitle2] = useState<string>("Set the NAME for this patch. (i.e Staccato)")
    const [nameFadTitle, setNameFadTitle] = useState<string>("Set the NAME for this parameter. (i.e Dynamics)")
    const [codeArtTitle, setCodeArtTitle] = useState<string>("Set the CODE for this patch. (i.e. CC58)")
    const [codeOnArt, setCodeOnArt] = useState<string>("Set the ON setting for this patch. (i.e. CC58, Value 76)")
    const [codeOnArt2, setCodeOnArt2] = useState<string>("Set the ON setting for this patch. (i.e. CC58, Value 21)")
    const [codeFadTitle, setCodeFadTitle] = useState<string>("Set the CODE for this parameter. (i.e CC11)")
    const [togArt, setTogArt] = useState<boolean>(variant === "tog" ? true : false)
    const [artFad, setArtFad] = useState<boolean>(type === "art" ? true : false)

    const codeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCode(event.target.value)
    }
    const onValChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOn(event.target.value)
    }
    const offChange = (event: ChangeEvent<HTMLInputElement>) => {
        setOff(event.target.value)
    }
    const deftChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDeft(event.target.value)
    }
    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const typeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value)

        if (event.target.value === "/note") {
            setMidi(noteValuesArray)
            setCodeMidi(noteValuesArray)
            setCodeDisabled(true)
        }
        else if (event.target.value === "/pitch") {
            setMidi(pitchValuesArray)
            setCodeDisabled(true)
        }
        else {
            setMidi(midiValuesArray)
            setCodeMidi(midiValuesArray)
            setCodeDisabled(false);
        };
    };

    const noteOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setVelTitle('Switch to Velocity-Based Changes')
            setCodeDisabled(true)
            setMidi(noteValuesArray)
        } else {
            setChecked(true)
            setVelTitle('Switch to Standard Note Changes')
            setCodeDisabled(false)
            setMidi(midiValuesArray)
        }
    }
    const rangeOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setRngTitle('Switch to independent playable range.')
            setRngSelect(false)
        } else {
            setChecked(true)
            setRngTitle('Switch to same playable range as default.')
            setRngSelect(true)
        }
    }

    const deftPatchChange = () => {
        console.log('default')
        if (isChecked2) {
            setChecked2(false)
        } else {
            setChecked2(true)
        }
    }

    const numListMidi =
        <SelectList numbers={valueMidi}></SelectList>

    const numListCode =
        <SelectList numbers={valueCodeMidi}></SelectList>

    const numListAll =
        <SelectList numbers={allNotes}></SelectList>

    const rangeSelects =
        <Row>
            <Col>
                <Form.Select>
                    {numListAll}
                </Form.Select>
            </Col>
            <Col>
                <Form.Select>
                    {numListAll}
                </Form.Select>
            </Col>
            <Button
                size="sm"
                variant="primary"
                title="This patch as more than one set of playable ranges.">
                <i className="fa-solid fa-plus"></i>
            </Button>
        </Row>

    const naOption =
        <option>N/A</option>

    const onOffOption =
        <Fragment>
            <option value="On">On</option>
            <option value="Off">Off</option>
        </Fragment>

    const typeOption =
        <Form.Group title="Select the TYPE of code for this patch.">
            <Form.Select
                size="sm"
                value={valueType}
                id={type + "Type_" + id}
                onChange={() => typeChange}>
                <option value="/control">Control Code</option>
                <option value="/note" >Note</option>
                <option value="/program">Program Change</option>
                <option value="/pitch">PitchWheel</option>
                <option value="/sysex">Sysex</option>
                <option value="/mtc">MTC</option>
                <option value="/channel_pressure">Channel Pressure</option>
                <option value="/key_pressure">Polyphonic Key Pressure</option>
            </Form.Select>
        </Form.Group>

    const noteOption =
        <Form.Group as={Col} title={checkVelTitle}>
            <Form.Check
                checked={isChecked}
                onChange={noteOptionChange}
                type="switch"
                title={checkVelTitle}
                aria-label="Switch Between Velocity-Based and Standard Note Changes"
                id={type + "NoteOption_" + id}>
            </Form.Check>
        </Form.Group >

    const rangeOption =
        <Form.Group as={Col} title={checkRngTitle}>
            <Form.Check
                checked={isChecked}
                onChange={rangeOptionChange}
                type="switch"
                title={checkRngTitle}
                aria-label="Does this patch have the same playable range as the default?"
                id={type + "RangeOption_" + id}>
            </Form.Check>
            {showRngSelect ? rangeSelects : null}
        </Form.Group >

    const codeOption =
        <Form.Group title={artFad ? codeArtTitle : codeFadTitle}>
            <Form.Select
                size="sm"
                disabled={codeDisabled}
                value={!codeDisabled ? valueCode : "N/A"}
                id={type + "Code_" + id}
                onChange={() => codeChange}>
                {!codeDisabled ? numListCode : naOption}
            </Form.Select>
        </Form.Group>

    const onOption =
        <Form.Group title={artFad && togArt ? codeOnArt : codeOnArt2}>
            <Form.Select
                as={Col}
                size="sm"
                value={valueOn}
                id={type + "On___" + id}
                onChange={() => onValChange}>
                {numListMidi}
            </Form.Select>
            {valueType === "/note" ? noteOption : null}
        </Form.Group>

    const offOption =
        <Form.Group title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" >
            <Form.Select
                as={Col}
                size="sm"
                value={valueOff}
                id={type + "Off__" + id}
                onChange={() => offChange}>
                {numListMidi}
            </Form.Select>
            {valueType === "/note" ? noteOption : null}
        </Form.Group >

    const deftCheck =
        <Form.Group title="Set this as the default patch.">
            <Form.Check
                checked={isChecked2}
                onChange={deftPatchChange}
                title="Set this as the default patch."
                aria-label="Set this as the default patch."
                id={type + "DeftOption_" + id}>
            </Form.Check>
        </Form.Group>

    const deftSelect =
        <Form.Group title="Set the DEFAULT setting for this patch.">
            <Form.Select
                as={Col}
                size="sm"
                value={valueDeft}
                id={type + "Deft_" + id}
                onChange={() => deftChange}>
                {type === "art" ? onOffOption : numListMidi}
            </Form.Select >
        </Form.Group >

    const nameOption =
        <Form.Group title={artFad && togArt ? nameArtTitle : artFad && !togArt ? nameArtTitle2 : nameFadTitle}>
            <Form.Control
                size="sm"
                type="text"
                value={valueName}
                id={type + "Name_" + id}
                onChange={nameChange}>
            </Form.Control>
        </Form.Group >

    const deftOption =
        <Fragment>
            {artFad && !togArt ? deftCheck : deftSelect}
            {type !== "art" && valueType === "/note" ? noteOption : null}
        </Fragment>

    const justArt =
        <Fragment>
            <td> {onOption} </td>
            <td> {togArt ? offOption : rangeOption} </td>
        </Fragment>

    return (
        <tr id={type + "_" + id} className="align-middle">
            <td id={type + "Numb_" + id}>{parseInt(id)}</td>
            <td>{typeOption}</td>
            <td>{codeOption}</td>
            {artFad ? justArt : null}
            <td>{deftOption}</td>
            <td>{nameOption}</td>
        </tr>
    );
};

export default function TemplateTrackSettings() {

    const closeSettingsWindow = () => {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MSshow', 'MShide');
        document.getElementById('TemplateTracks')!.classList.replace('MSshowTemplateTracks', 'MShideTemplateTracks');
    }

    return (
        <Container id="TemplateTrackSettings" className="MShide">
            <ButtonToolbar>
                <ButtonGroup className="container">
                    <Button
                        variant="primary"
                        size="sm"
                        title="Close Track Settings Window"
                        onClick={closeSettingsWindow}>
                        <i className="fa-solid fa-xmark"></i>
                    </Button>
                    <IconBtnToggle
                        variant="primary"
                        size="sm"
                        title="Close Track Settings Window"
                        id="editLock"
                        a="fa-solid fa-lock-open"
                        b="fa-solid fa-lock"
                        defaultIcon="a">
                    </IconBtnToggle>
                    <DropdownButton id="dropdown-item-button" title="Save Track Settings">
                        <Dropdown.Item as="button">Print Track Settings</Dropdown.Item>
                        <Dropdown.Item as="button">Save Track Settings as Manufacturer Default</Dropdown.Item>
                        <Dropdown.Item as="button">Open Manufacturer Default Settings for Track</Dropdown.Item>
                        <Dropdown.Item as="button">Save Track Settings as User Default</Dropdown.Item>
                        <Dropdown.Item as="button">Open User Default Settings for Track</Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
            </ButtonToolbar >

            <h2 id="trkEditDisplay">Track:</h2>

            <Row sm="auto">
                <Col>
                    <h3>Playable Range:</h3>
                </Col>
                <Col>
                    <Form.Select>
                        <SelectList numbers={allNotes}></SelectList>
                    </Form.Select>
                </Col>
                <Col>
                    <Form.Select>
                        <SelectList numbers={allNotes}></SelectList>
                    </Form.Select>
                </Col>
            </Row>

            <h3>Faders</h3>

            <Table hover responsive className='table-condensed'>
                <thead>
                    <tr>
                        <th data-width="3%">No.</th>
                        <th data-width="30%">Type</th>
                        <th data-width="18%">Code</th>
                        <th data-width="18%">Default</th>
                        <th data-width="31%">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="01" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="02" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="03" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="05" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="06" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="07" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="08" type="fad" variant={undefined}></SettingsRow>
                </tbody>
            </Table>

            <h3>Articulations (toggle)</h3>

            <Table hover responsive>
                <thead>
                    <tr>
                        <th data-width="3%">No.</th>
                        <th data-width="30%">Type</th>
                        <th data-width="9%">Code</th>
                        <th data-width="9%">On</th>
                        <th data-width="9%">Off</th>
                        <th data-width="9%">Default</th>
                        <th data-width="31%">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="01" type="art" variant="tog"></SettingsRow>
                    <SettingsRow id="02" type="art" variant="tog"></SettingsRow>
                </tbody>
            </Table>
            <h3>Articulations (one-at-a-time)</h3>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th data-width="3%">No.</th>
                        <th data-width="30%">Type</th>
                        <th data-width="9%">Code</th>
                        <th data-width="9%">On</th>
                        <th data-width="9%">Range</th>
                        <th data-width="9%">Default</th>
                        <th data-width="31%">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="03" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="05" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="06" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="07" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="08" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="09" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="10" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="11" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="12" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="13" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="14" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="15" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="16" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="17" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="18" type="art" variant={undefined}></SettingsRow>
                </tbody>
            </Table>
        </Container >
    );
};