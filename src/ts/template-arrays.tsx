import { FC, Fragment } from "react";

interface SelectListProps {
    numbers: any;
    names?: any;
}

const SelectList: FC<SelectListProps> = ({ numbers, names }) => {

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


let smpOutSettings = 32
let vepOutSettings = 32

let MiddleC = {
    bottom: -2,
    top: 9
};

const allNotesArray: string[] = []
for (let i = MiddleC.bottom; i < MiddleC.top; i++) {
    allNotesArray.push('C' + i, 'C#' + i, 'D' + i, 'D#' + i, 'E' + i, 'F' + i,
        'F#' + i, 'G' + i, 'G#' + i, 'A' + i, 'A#' + i, 'B' + i);
}
const midiChannelsArray: number[] = [];
for (let i = 1; i <= 16; i++) {
    midiChannelsArray.push(i);
}

const outPutNumbersArray: number[] = [];
for (let i = 1; i <= 128; i++) {
    outPutNumbersArray.push(i);
}
const midiValuesArray: number[] = [];
for (let i = 0; i <= 127; i++) {
    midiValuesArray.push(i);
}
const noteValuesArray: string[] = [];
for (let i = 0; i <= 127; i++) {
    noteValuesArray.push(i + " / " + allNotesArray[i]);
}
const samplerOutputsArray: string[] = [];
for (let i = 1; i < smpOutSettings; i++) {
    let j: number = i + 1
    let output: string = i + '-' + j;
    samplerOutputsArray.push(output);
    i = i + 1;
}
const instanceOutputsArray: string[] = [];
for (let i = 1; i < vepOutSettings; i++) {
    let j: number = i + 1
    let output: string = i + '-' + j;
    instanceOutputsArray.push(output);
    i = i + 1;
}
const pitchValuesArray: number[] = [];
for (let i = 0; i < 16384; i++) {
    pitchValuesArray.push(i);
}

const samplerListArray: string[] = [
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

const addressArray: string[] = [
    "/control",
    "/note",
    "/program",
    "/pitch",
    "/sysex",
    "/mtc",
    "/channel_pressure",
    "/key_pressure"
]

const addressNamesArray: string[] = [
    "Control Code",
    "Note",
    "Program Change",
    "Pitch Wheel",
    "Sysex",
    "MTC",
    "Channel Pressure",
    "Polyphonic Key Pressure"
]


const onOffArray: string[] = ["On", "Off"]

const middleCArray: string[] = ["Middle C (60) = C5", "Middle C (60) = C4", "Middle C (60) = C3"]

const chnListMidi = <SelectList numbers={midiChannelsArray} />
const outListSmp = <SelectList numbers={samplerOutputsArray} />
const outListVep = <SelectList numbers={instanceOutputsArray} />
const numListMidi = <SelectList numbers={midiValuesArray}></SelectList>
const numListCode = <SelectList numbers={noteValuesArray}></SelectList>
const ptchListCode = <SelectList numbers={pitchValuesArray}></SelectList>
const numListAll = <SelectList numbers={allNotesArray} />
const smpListAll = <SelectList numbers={samplerListArray} />
const onOffOption = <SelectList numbers={onOffArray} />
const vepOutOption = <SelectList numbers={outPutNumbersArray} />
const middleCOption = <SelectList numbers={middleCArray} />
const addressOptions = <SelectList numbers={addressArray} names={addressNamesArray} />


const listArraysJsx = [chnListMidi, numListAll, numListCode, numListMidi, outListSmp, outListVep, ptchListCode, smpListAll, onOffOption, vepOutOption, middleCOption, addressOptions]

const listArraysStr = ['chnListMidi', 'numListAll', 'numListCode', 'numListMidi', 'outListSmp', 'outListVep', 'ptchListCode', 'smpListAll', 'onOffOption', 'vepOutOption', 'middleCOption', 'addressOptions']

export {
    SelectList,
    MiddleC,
    smpOutSettings,
    vepOutSettings,
    outPutNumbersArray,
    allNotesArray,
    midiChannelsArray,
    midiValuesArray,
    noteValuesArray,
    samplerOutputsArray,
    instanceOutputsArray,
    pitchValuesArray,
    samplerListArray,
    chnListMidi,
    outListSmp,
    outListVep,
    ptchListCode,
    numListAll,
    numListCode,
    numListMidi,
    smpListAll,
    listArraysJsx,
    listArraysStr,
    onOffOption
};