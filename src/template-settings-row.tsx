import { FC, useState, ChangeEvent, Fragment } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { numListMidi, numListCode, ptchListCode, numListAll } from "./template-arrays";

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
    const [checkVelTitle, setVelTitle] = useState<string>("Switch to Velocity-Based Changes")
    const [checkRngTitle, setRngTitle] = useState<string>("Switch to independent playable range.")


    const nameArtTitle: string = "Set the NAME for this patch. (i.e Legato On/OFF)"
    const nameArtTitle2: string = "Set the NAME for this patch. (i.e Staccato)"
    const nameFadTitle: string = "Set the NAME for this parameter. (i.e Dynamics)"
    const codeArtTitle: string = "Set the CODE for this patch. (i.e. CC58)"
    const codeOnArt: string = "Set the ON setting for this patch. (i.e. CC58, Value 76)"
    const codeOnArt2: string = "Set the ON setting for this patch. (i.e. CC58, Value 21)"
    const codeFadTitle: string = "Set the CODE for this parameter. (i.e CC11)"
    const togArt: boolean = variant === "tog" ? true : false
    const artFad: boolean = type === "art" ? true : false

    const [codeDisabled, setCodeDisabled] = useState<boolean>(false)
    const [showRngSelect, setRngSelect] = useState<boolean>(false)
    const [isChecked, setChecked] = useState<boolean>(false)
    const [isChecked2, setChecked2] = useState<boolean>(false)
    const [valueMidi, setMidi] = useState<JSX.Element>(numListMidi)
    const [valueCodeMidi, setCodeMidi] = useState<JSX.Element>(numListMidi)

    const typeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value)

        if (event.target.value === "/note") {
            setMidi(numListCode)
            setCodeMidi(numListCode)
            setCodeDisabled(true)
        }
        else if (event.target.value === "/pitch") {
            setMidi(ptchListCode)
            setCodeDisabled(true)
        }
        else {
            setMidi(numListMidi)
            setCodeMidi(numListMidi)
            setCodeDisabled(false);
        };
    };

    const codeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCode(event.target.value)
    }
    const onValChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOn(event.target.value)
    }
    const offChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOff(event.target.value)
    }
    const deftChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDeft(event.target.value)
    }
    const nameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const noteOptionChange = () => {
        if (isChecked) {
            setChecked(false)
            setVelTitle('Switch to Velocity-Based Changes')
            setCodeDisabled(true)
            setMidi(numListCode)
        } else {
            setChecked(true)
            setVelTitle('Switch to Standard Note Changes')
            setCodeDisabled(false)
            setMidi(numListMidi)
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

    const rangeSelects =
        <Row>
            <Col xs={2}>
                <Form.Select>
                    {numListAll}
                </Form.Select>
            </Col>
            <Col xs={2}><i className='fas fa-arrow-right-long' /></Col>
            <Col xs={2}>
                <Form.Select>
                    {numListAll}
                </Form.Select>
            </Col>
            <Col xs={2}>
                <Form.Group title="Describe this range-group. (i.e hits/rolls)">
                    <Form.Control
                        size="sm"
                        type="text"
                        value={valueName}
                        id={type + "Name_" + id}
                        onChange={nameChange}>
                    </Form.Control>
                </Form.Group>
            </Col>
            <Col xs={2}>
                <Button
                    size="sm"
                    variant="primary"
                    title="This patch has more than one set of playable ranges.">
                    <i className="fa-solid fa-plus"></i>
                </Button>
            </Col>
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
                onChange={typeChange}>
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
        <Fragment>
            <Form.Group title={checkRngTitle}>
                <Form.Check
                    checked={isChecked}
                    onChange={rangeOptionChange}
                    type="switch"
                    title={checkRngTitle}
                    aria-label="Does this patch have the same playable range as the default?"
                    id={type + "RangeOption_" + id}>
                </Form.Check>
            </Form.Group >
            {showRngSelect ? rangeSelects : null}
        </Fragment>

    const codeOption =
        <Form.Group title={artFad ? codeArtTitle : codeFadTitle}>
            <Form.Select
                size="sm"
                disabled={codeDisabled}
                value={!codeDisabled ? valueCode : "N/A"}
                id={type + "Code_" + id}
                onChange={codeChange}>
                {!codeDisabled ? valueCodeMidi : naOption}
            </Form.Select>
        </Form.Group>

    const onOption =
        <Form.Group title={artFad && togArt ? codeOnArt : codeOnArt2}>
            <Form.Select
                size="sm"
                value={valueOn}
                id={type + "On___" + id}
                onChange={onValChange}>
                {numListMidi}
            </Form.Select>
            {valueType === "/note" ? noteOption : null}
        </Form.Group>

    const offOption =
        <Form.Group title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" >
            <Form.Select
                size="sm"
                value={valueOff}
                id={type + "Off__" + id}
                onChange={offChange}>
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
                size="sm"
                value={valueDeft}
                id={type + "Deft_" + id}
                onChange={deftChange}>
                {type === "art" ? onOffOption : valueMidi}
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

export {
    SettingsRow
}