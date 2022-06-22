import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { outPutNumbersArray, MiddleC } from './template-arrays';

function NumberList(props: { numbers: any; }) {
    const numbers = props.numbers;
    const listItems = numbers.map(
        (number: string | number | boolean |
            React.ReactElement<any, string |
                React.JSXElementConstructor<any>> |
            React.ReactFragment |
            React.ReactPortal | null | undefined) =>
            <option key={number!.toString()} value={number!.toString()}>
                {number}
            </option>);
    return (
        listItems
    );
}

function SettingsForm() {

    const [valueMiddleC, setValueMiddleC] = useState("NotesC3=60")
    const [isChecked, setChecked] = useState(true)
    const [isChecked2, setChecked2] = useState(false)
    const [vepOuts, setVepOuts] = useState(32)
    const [smpOuts, setSmpOuts] = useState(32)

    const findMiddleC = function (event: any) {
        setValueMiddleC((event!.target! as HTMLInputElement).value);

        if ((event!.target! as HTMLInputElement).value === "NotesC5=60") {
            MiddleC.bottom = -4
            MiddleC.top = 7
        }
        if ((event!.target! as HTMLInputElement).value === "NotesC4=60") {
            MiddleC.bottom = -3
            MiddleC.top = 8
        }
        if ((event!.target! as HTMLInputElement).value === "NotesC3=60") {
            MiddleC.bottom = -2
            MiddleC.top = 9
        }
    };

    const changeVepOuts = function (event: any) {
        setVepOuts(event!.target!.value)
    };

    const changeSmpOuts = function (event: any) {
        setSmpOuts(event!.target!.value)
    };

    const autoSave = function () {
        if (isChecked) {
            setChecked(false)
        } else {
            setChecked(true)
        }
    };

    const closeOnSave = function () {
        if (isChecked2) {
            setChecked2(false)
        } else {
            setChecked2(true)
        }
    };

    return (

        <Form.Group>
            <h2>General Settings</h2>

            <Form.Label forhmtl="">Auto-Save JSON / Auto-Push to OSC</Form.Label>
            <Form.Check
                id="Auto-Save-JSON"
                checked={isChecked}
                onChange={autoSave}>
            </Form.Check>

            <Form.Label forhmtl="">Close this window on save</Form.Label>
            <Form.Check
                id="closeSettings-Save"
                checked={isChecked2}
                onChange={closeOnSave}>
            </Form.Check>

            <h2>Note Numbers</h2>

            <Form.Select
                size="sm"
                id="findMiddleC"
                value={valueMiddleC}
                onChange={findMiddleC}>
                <option value="NotesC5=60">Middle C (60) = C5</option>
                <option value="NotesC4=60">Middle C (60) = C4</option>
                <option value="NotesC3=60">Middle C (60) = C3</option>
            </Form.Select>

            <h2>Track Settings</h2>

            <Form.Label forhmtl="vepOutSettings">Number of Ouputs per Instance</Form.Label>
            <Form.Select
                size="sm"
                id="vepOutSettings"
                value={vepOuts}
                onChange={changeVepOuts}>
                <NumberList numbers={outPutNumbersArray}></NumberList>
            </Form.Select>

            <Form.Label forhmtl="smpOutSettings">Number of Ouputs per Sampler</Form.Label>
            <Form.Select
                size="sm"
                id="smpOutSettings"
                value={smpOuts}
                onChange={changeSmpOuts}>
                <NumberList numbers={outPutNumbersArray}></NumberList>
            </Form.Select>
            <Button>Save</Button>
        </Form.Group >
    );
};

export default function TemplateMainSettings() {

    return (
        <SettingsForm></SettingsForm>
    );
};