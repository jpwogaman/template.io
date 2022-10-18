//variable & input values to be sent to OSC
const workFile_jsn = loadJSON('template-io-workfile.json')
const allTrack_jsn = loadJSON('Tracklist_10.13.2022_V1.3.json'); //`${or whatever the user names their file}`

const items = allTrack_jsn.items
const fileInfo = allTrack_jsn.fileInfo

//go through workFile and get number of faders and articulations
// let artListOsc = []
// let fadListOsc = []
// for (var i in workFile_jsn.content.widgets[0].tabs[1].widgets) {
// 	if (workFile_jsn.content.widgets[0].tabs[0].widgets[i].id.includes('Art'))
// 		artListOsc.push(workFile_jsn.content.widgets[0].tabs[0].widgets[i].id)

// 	if (workFile_jsn.content.widgets[0].tabs[0].widgets[i].id.includes('CC_fad'))
// 		fadListOsc.push(workFile_jsn.content.widgets[0].tabs[0].widgets[i].id)
// }
//array of all notes (Middle C == C3 == MIDI Code 60)
const allNotes_loc = []
for (let i = -2; i < 9; i++) {
	allNotes_loc.push('C' + i, 'C#' + i, 'D' + i, 'D#' + i, 'E' + i, 'F' + i,
		'F#' + i, 'G' + i, 'G#' + i, 'A' + i, 'A#' + i, 'B' + i);
}
//update current MIDI track
function trkUpdate() {
	send('midi', 'OSC4', '/control', 1, 127, 127);
}
//send default articulation parameters to Cubase
function prmUpdate(x, typeJsn, codeJsn, deftJsn) {
	if (x === 3) {
		send('midi', 'OSC3', typeJsn, 1, codeJsn, deftJsn);
	}
	if (x === 4) {
		send('midi', 'OSC4', typeJsn, 1, codeJsn, deftJsn);
	}
}
//toggle counters
let togUpdat_loc = false;
let togCodes_loc = true;
let togClkTr_loc = false;
let myPorts__loc = {
	osc1: { bool: false, name: 'OSC1' },
	osc2: { bool: false, name: 'OSC2' },
	osc3: { bool: false, name: 'OSC3' },
	osc4: { bool: false, name: 'OSC4' },
};
let myAddrs__loc = {
	note: { bool: false, name: '/note' },
	ntof: { bool: false, name: '/note_off' },
	ctrl: { bool: false, name: '/control' },
	pgrm: { bool: false, name: '/program' },
	ptch: { bool: false, name: '/pitch' },
	sysx: { bool: false, name: '/sysex' },
	mtcT: { bool: false, name: '/mtc' },
	chnP: { bool: false, name: '/channel_pressure' },
	keyP: { bool: false, name: '/key_pressure' },
};

function portAddr(address, port) {
	for (const myPort in myPorts__loc) {
		if (port === `${myPorts__loc[myPort].name}`) {
			myPorts__loc[myPort].bool = true;
		} else {
			myPorts__loc[myPort].bool = false;
		}
	}
	for (const myAddrs in myAddrs__loc) {
		if (address === `${myAddrs__loc[myAddrs].name}`) {
			myAddrs__loc[myAddrs].bool = true;
		} else {
			myAddrs__loc[myAddrs].bool = false;
		}
	}
}

function toggles(arg1, arg2) {
	if (arg1 === 127 && arg2 === 1) {
		togUpdat_loc = true;
	}
	if (arg1 === 127 && arg2 === 0) {
		togUpdat_loc = false;
	}
	if (arg1 === 119 && arg2 === 1) {
		trkUpdate();
		togCodes_loc = true;
	}
	if (arg1 === 119 && arg2 === 0) {
		trkUpdate();
		togCodes_loc = false;
	}
}

function clickTrk(arg1, arg2) {
	if (arg1 === 126 && arg2 === 1) {
		togClkTr_loc = true;
	}
	if (arg1 === 126 && arg2 === 0) {
		togClkTr_loc = false;
	}
}
//
module.exports = {
	init: function () {
		send('midi', 'OSC1', '/control', 3, 17, 1); //'whole notes'
		send('midi', 'OSC1', '/control', 3, 25, 1); //'grid'
		send('midi', 'OSC1', '/control', 2, 09, 1); //'A5X + SUB8'
		setTimeout(() => {
			send('midi', 'OSC1', '/control', 3, 20, 1); //grid eighth notes
		}, 100);
	},

	oscInFilter: function (data) {

		var { address, args, host, port } = data;

		portAddr(address, port);

		const arg1 = args[1].value;
		const arg2 = args[2].value;
		const osc1 = myPorts__loc.osc1.bool;
		const osc2 = myPorts__loc.osc2.bool;
		const osc3 = myPorts__loc.osc3.bool;
		const osc4 = myPorts__loc.osc4.bool;
		const note = myAddrs__loc.note.bool;
		const ntof = myAddrs__loc.ntof.bool;
		const ctrl = myAddrs__loc.ctrl.bool;
		const pgrm = myAddrs__loc.pgrm.bool;
		const ptch = myAddrs__loc.ptch.bool;
		const sysx = myAddrs__loc.sysx.bool;
		const mtcT = myAddrs__loc.mtcT.bool;
		const chnP = myAddrs__loc.chnP.bool;
		const keyP = myAddrs__loc.keyP.bool;

		if (ctrl && osc2) {
			toggles(arg1, arg2);
		}
		if (ctrl && osc3) {
			clickTrk(arg1, arg2);
		}
		if (togUpdat_loc) {
			receive('/trackNameColor', '#70b7ff');
			receive('/template-io_trackNameColor', '#70b7ff');
		} else {
			receive('/trackNameColor', 'red');
			receive('/template-io_trackNameColor', 'red');
		}
		if (togUpdat_loc && togClkTr_loc) {
			trkUpdate();
			togClkTr_loc = false; // need this to avoid infinite loop
		}

		//if I receive more than 4 in less than, maybe a half-second, then halt. this should help prevent issues when selecting all tracks, etc. 

		if (keyP) {

			const trkNumb = arg1 * 128 + arg2;

			for (let i = 0; i < 8; i++) {
				const nameOsc = '/CC_disp_' + parseInt(i + 1);
				const addrOsc = '/CC_fad__' + parseInt(i + 1);
				const codeOsc = '/CC_incr_' + parseInt(i + 1);
				receive(nameOsc, ' ');
				receive(addrOsc, 0);
				receive(codeOsc, 0);
			}
			for (let i = 0; i < 18; i++) {
				const nameOsc = '/artname_' + parseInt(i + 1);
				const inptOsc = '/artinpt_' + parseInt(i + 1);
				const colrOsc = '/artcolr_' + parseInt(i + 1);
				const modAOsc = '/artmodA_' + parseInt(i + 1);
				const modBOsc = '/artmodB_' + parseInt(i + 1);
				receive(nameOsc, ' ');
				receive(inptOsc, 'true');
				receive(colrOsc, '#A9A9A9');
				receive(modAOsc, 0.15);
				receive(modBOsc, 0.15);
			}

			if (!items[trkNumb]) {
				receive('/selectedTrackName', 'No Track Data!')
				receive('/template-io_keyRangeVar1', []);
				receive('/template-io_keyRangeVar2', []);
				receive('/template-io_keyRangeScript', 1);
				return
			};

			const trkName = items[trkNumb].name;
			const trkRang = items[trkNumb].fullRange;

			receive('/selectedTrackName', trkName);
			receive('/template-io_selectedTrackName', trkName);

			if (items[trkNumb].fadList.length > 4) {
				receive('/faderPanel-color-2', '1px solid red');
			} else {
				receive('/faderPanel-color-2', '');
			}

			const fadListJsn = items[trkNumb].fadList
			for (let i = 0; i < fadListJsn.length; i++) {
				const nameOsc = '/CC_disp_' + parseInt(i + 1);
				const addrOsc = '/CC_fad__' + parseInt(i + 1);
				const codeOsc = '/CC_incr_' + parseInt(i + 1);
				const nameJsn = fadListJsn[i].name;
				const typeJsn = fadListJsn[i].codeType
				const codeJsn = parseInt(fadListJsn[i].code);
				const deftJsn = parseInt(fadListJsn[i].default);
				receive(nameOsc, nameJsn);
				receive(addrOsc, deftJsn);
				receive(codeOsc, codeJsn);
				prmUpdate(4, typeJsn, codeJsn, deftJsn);
			}
			const artListJsn = [...items[trkNumb].artList, ...items[trkNumb].artListTog]
			for (let i = 0; i < artListJsn.length; i++) {
				const nameOsc = '/artname_' + parseInt(i + 1);
				const typeOsc = '/arttype_' + parseInt(i + 1);
				const codeOsc = '/artcode_' + parseInt(i + 1);
				const inptOsc = '/artinpt_' + parseInt(i + 1);
				const deftOsc = '/artdeft_' + parseInt(i + 1);
				const on__Osc = '/arton___' + parseInt(i + 1);
				const off_Osc = '/artoff__' + parseInt(i + 1);
				const colrOsc = '/artcolr_' + parseInt(i + 1);
				const modAOsc = '/artmodA_' + parseInt(i + 1);
				const modBOsc = '/artmodB_' + parseInt(i + 1);
				const modeOsc = '/artMode_' + parseInt(i + 1);
				const rangOsc = '/artrang_' + parseInt(i + 1);
				const nameJsn = artListJsn[i].name;
				const typeJsn = artListJsn[i].codeType
				const deftJsn = artListJsn[i].default;
				const codeJsn = parseInt(artListJsn[i].code);
				const on__Jsn = parseInt(artListJsn[i].on);
				const off_Jsn = parseInt(artListJsn[i].off);
				const rangJsn = artListJsn[i].ranges;

				if (!artListJsn[i].name) continue

				let codeDsp;

				if (typeJsn === '/control') {
					codeDsp = 'CC';
				} else if (typeJsn === '/note') {
					codeDsp = `${allNotes_loc[codeJsn]}/`;
				} else {
					codeDsp = '';
				}

				if (togCodes_loc && nameJsn !== '') {
					receive(nameOsc, `${nameJsn} (${codeDsp}${codeJsn}/${on__Jsn}${off_Jsn ? '/' + off_Jsn : ''})`)
				} else {
					receive(nameOsc, nameJsn);
				}

				receive(typeOsc, typeJsn);
				receive(codeOsc, codeJsn);
				receive(deftOsc, off_Jsn);
				receive(on__Osc, on__Jsn);
				receive(off_Osc, off_Jsn);
				receive(rangOsc, rangJsn);
				receive(inptOsc, 'false');
				receive(colrOsc, '#6dfdbb');

				if (!artListJsn[i].toggle) {
					receive(modeOsc, 'toggle')
					receive(colrOsc, '#a86739')
					receive(modBOsc, 0.75);
					prmUpdate(4, typeJsn, codeJsn, off_Jsn)
					if (deftJsn !== 'On') continue

					receive(deftOsc, on__Jsn);
					receive('/template-io_keyRangeVar1', trkRang);
					receive('/template-io_keyRangeVar2', rangJsn);
					receive('/template-io_keyRangeScript', 1);
				}
				else {
					receive(modeOsc, 'tap')
					if (deftJsn !== true) continue

					receive(modAOsc, 0.75)
					receive(deftOsc, on__Jsn);
					prmUpdate(4, typeJsn, codeJsn, on__Jsn)
					receive('/template-io_keyRangeVar1', trkRang);
					receive('/template-io_keyRangeVar2', rangJsn);
					receive('/template-io_keyRangeScript', 1);
				}
			}
		}
		return { address, args, host, port };
	},
};
