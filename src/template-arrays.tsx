import { FC, Fragment } from "react";

interface SelectListProps {
    numbers: any;
}

const SelectList: FC<SelectListProps> = ({ numbers }) => {
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

const allNotes: string[] = []
for (let i = MiddleC.bottom; i < MiddleC.top; i++) {
    allNotes.push('C' + i, 'C#' + i, 'D' + i, 'D#' + i, 'E' + i, 'F' + i,
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
    noteValuesArray.push(i + " / " + allNotes[i]);
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

const samplerList = [
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

export {
    SelectList,
    MiddleC,
    smpOutSettings,
    vepOutSettings,
    outPutNumbersArray,
    allNotes,
    midiChannelsArray,
    midiValuesArray,
    noteValuesArray,
    samplerOutputsArray,
    instanceOutputsArray,
    pitchValuesArray,
    samplerList
};