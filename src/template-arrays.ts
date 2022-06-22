
let smpOutSettings = 32
let vepOutSettings = 32

let MiddleC = {
    bottom: -2,
    top: 9
};

const allNotes: string[] = []
for (let i = MiddleC.bottom; i < MiddleC.top; i++) {
    let cn = String('C' + i);
    let cs = String('C#' + i);
    let dn = String('D' + i);
    let ds = String('D#' + i);
    let en = String('E' + i);
    let fn = String('F' + i);
    let fs = String('F#' + i);
    let gn = String('G' + i);
    let gs = String('G#' + i);
    let an = String('A' + i);
    let as = String('A#' + i);
    let bn = String('B' + i);
    allNotes.push(cn, cs, dn, ds, en, fn, fs, gn, gs, an, as, bn);
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

export {
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
    pitchValuesArray
};