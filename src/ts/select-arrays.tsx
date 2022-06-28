import { FC, Fragment } from "react";

let smpOutSettings = 32
let vepOutSettings = 32

let MiddleC = {
    bottom: -2,
    top: 9
};

export const allNoteArray: string[] = []
for (let i = MiddleC.bottom; i < MiddleC.top; i++) {
    allNoteArray.push('C' + i, 'C#' + i, 'D' + i, 'D#' + i, 'E' + i, 'F' + i,
        'F#' + i, 'G' + i, 'G#' + i, 'A' + i, 'A#' + i, 'B' + i);
}
export const chnMidiArray: number[] = [];
for (let i = 1; i <= 16; i++) {
    chnMidiArray.push(i);
}

export const setOutsArray: number[] = [];
for (let i = 1; i <= 128; i++) {
    setOutsArray.push(i);
}
const valMidiArray: number[] = [];
for (let i = 0; i <= 127; i++) {
    valMidiArray.push(i);
}
export const valNoteArray: string[] = [];
for (let i = 0; i <= 127; i++) {
    valNoteArray.push(i + " / " + allNoteArray[i]);
}
export const smpOutsArray: string[] = [];
for (let i = 1; i < smpOutSettings; i++) {
    let j: number = i + 1
    let output: string = i + '-' + j;
    smpOutsArray.push(output);
    i = i + 1;
}
export const vepOutsArray: string[] = [];
for (let i = 1; i < vepOutSettings; i++) {
    let j: number = i + 1
    let output: string = i + '-' + j;
    vepOutsArray.push(output);
    i = i + 1;
}
export const valPtchArray: number[] = [];
for (let i = 0; i < 16384; i++) {
    valPtchArray.push(i);
}

export const smpTypeArray: string[] = [
    'Native Instruments Kontakt',
    'Native Instruments Maschine',
    'Native Instruments Reaktor',
    'Native Instruments Komplete Kontrol',
    'EastWest Opus',
    'EastWest Play',
    'Orchestral Tools SINE Player',
    'Spitfire Audio LABS',
    'Spitfire Audio BBC Symphony Orchestra',
    'Vienna Synchron Player',
    'Vienna Instruments',
];

export const valAddrArray: string[] = [
    "/control",
    "/note",
    "/program",
    "/pitch",
    "/sysex",
    "/mtc",
    "/channel_pressure",
    "/key_pressure"
]

export const addressNamesArray: string[] = [
    "Control Code",
    "Note",
    "Program Change",
    "Pitch Wheel",
    "Sysex",
    "MTC",
    "Channel Pressure",
    "Polyphonic Key Pressure"
]

export const valDeftArray: string[] = [
    "On",
    "Off"
]

export const setNoteArray: string[] = [
    "Middle C (60) = C5",
    "Middle C (60) = C4",
    "Middle C (60) = C3"
]

interface SelectListProps {
    numbers: any;
    names?: any;
}

export const SelectList: FC<SelectListProps> = ({ numbers, names }) => {

    if (names) {
        return (
            <Fragment>
                {names.map((name: string) =>
                    <option key={name} value={name}>{name}</option>)}
            </Fragment>
        );
    } else
        return (
            <Fragment>
                {numbers.map((number: string | number) =>
                    <option key={number} value={number}>{number}</option>)}
            </Fragment>
        );
}

export const selectArrays: { [index: string]: JSX.Element } = {

    setOutsList: <SelectList numbers={setOutsArray} />,
    setNoteList: <SelectList numbers={setNoteArray} />,

    chnMidiList: <SelectList numbers={chnMidiArray} />,
    smpTypeList: <SelectList numbers={smpTypeArray} />,
    smpOutsList: <SelectList numbers={smpOutsArray} />,
    vepOutsList: <SelectList numbers={vepOutsArray} />,

    valAddrList: <SelectList numbers={valAddrArray} names={addressNamesArray} />,
    valMidiList: <SelectList numbers={valMidiArray} />,
    valNoteList: <SelectList numbers={valNoteArray} />,
    valPtchList: <SelectList numbers={valPtchArray} />,
    valDeftList: <SelectList numbers={valDeftArray} />,
    valNoneList: <option>N/A</option>,

    allNoteList: <SelectList numbers={allNoteArray} />
}