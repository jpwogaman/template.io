//variable & input values to be sent to OSC
const allTrack_jsn = loadJSON('template-io-track-data.json'); //`${or whatever the user names their file}`
const artName__jsn = [];
const artType__jsn = [];
const artCode__jsn = [];
const artDeflt_jsn = [];
const artOn____jsn = [];
const artOff___jsn = [];
const artRange_jsn = [];
const fadName__jsn = [];
const fadType__jsn = [];
const fadCode__jsn = [];
const fadDeflt_jsn = [];

for (i in allTrack_jsn) {
	var trackArrays = [allTrack_jsn[i]];
	for (var key in trackArrays) {
		if (!trackArrays.hasOwnProperty(key)) continue;
		var obj = trackArrays[key];
		for (var prop in obj) {
			if (!obj.hasOwnProperty(prop)) continue;
			if (prop.includes('artName__')) {
				artName__jsn.push(obj[prop]);
			}
			if (prop.includes('artType__')) {
				artType__jsn.push(obj[prop]);
			}
			if (prop.includes('artCode__')) {
				artCode__jsn.push(obj[prop]);
			}
			if (prop.includes('artDeflt_')) {
				artDeflt_jsn.push(obj[prop]);
			}
			if (prop.includes('artOn____')) {
				artOn____jsn.push(obj[prop]);
			}
			if (prop.includes('artOff___')) {
				artOff___jsn.push(obj[prop]);
			}
			if (prop.includes('artRange_')) {
				artRange_jsn.push(obj[prop]);
			}
			if (prop.includes('fadName__')) {
				fadName__jsn.push(obj[prop]);
			}
			if (prop.includes('fadType__')) {
				fadType__jsn.push(obj[prop]);
			}
			if (prop.includes('fadCode__')) {
				fadCode__jsn.push(obj[prop]);
			}
			if (prop.includes('fadDeflt_')) {
				fadDeflt_jsn.push(obj[prop]);
			}
		}
	}
}
//variable & input ID's/addresses in OSC
const artName__osc = [];
const artType__osc = [];
const artCode__osc = [];
const artInput_osc = [];
const artDeflt_osc = [];
const artOn____osc = [];
const artOff___osc = [];
const artRange_osc = [];
const artColor_osc = [];
const artModeA_osc = [];
const artModeB_osc = [];
const fadName__osc = [];
const fadAddr__osc = [];
const fadCode__osc = [];

for (let i = 0; i < 18; i++) {
	artName__osc[i] = '/artname_' + parseInt(i + 1);
	artType__osc[i] = '/arttype_' + parseInt(i + 1);
	artCode__osc[i] = '/artcode_' + parseInt(i + 1);
	artInput_osc[i] = '/artinpt_' + parseInt(i + 1);
	artDeflt_osc[i] = '/artdeft_' + parseInt(i + 1);
	artOn____osc[i] = '/arton___' + parseInt(i + 1);
	artOff___osc[i] = '/artoff__' + parseInt(i + 1);
	artRange_osc[i] = '/artrang_' + parseInt(i + 1);
	artColor_osc[i] = '/artcolr_' + parseInt(i + 1);
	artModeA_osc[i] = '/artmodA_' + parseInt(i + 1);
	artModeB_osc[i] = '/artmodB_' + parseInt(i + 1);

	// artName__osc[i] = '/template-io_artname_' + parseInt(i + 1);
	// artType__osc[i] = '/template-io_arttype_' + parseInt(i + 1);
	// artCode__osc[i] = '/template-io_artcode_' + parseInt(i + 1);
	// artInput_osc[i] = '/template-io_artinpt_' + parseInt(i + 1);
	// artDeflt_osc[i] = '/template-io_artdeft_' + parseInt(i + 1);
	// artOn____osc[i] = '/template-io_arton___' + parseInt(i + 1);
	// artOff___osc[i] = '/template-io_artoff__' + parseInt(i + 1);
	// artRange_osc[i] = '/template-io_artrang_' + parseInt(i + 1);
	// artColor_osc[i] = '/template-io_artcolr_' + parseInt(i + 1);
	// artModeA_osc[i] = '/template-io_artmodA_' + parseInt(i + 1);
	// artModeB_osc[i] = '/template-io_artmodB_' + parseInt(i + 1);
}
for (let i = 0; i < 8; i++) {
	fadName__osc[i] = '/CC_disp_' + parseInt(i + 1);
	fadAddr__osc[i] = '/CC_fad__' + parseInt(i + 1);
	fadCode__osc[i] = '/CC_incr_' + parseInt(i + 1);

	// fadName__osc[i] = '/template-io_CC_disp_' + parseInt(i + 1);
	// fadAddr__osc[i] = '/template-io_CC_fad__' + parseInt(i + 1);
	// fadCode__osc[i] = '/template-io_CC_incr_' + parseInt(i + 1);
}
//array of all notes (Middle C == C3 == MIDI Code 60)
const allNotes_loc = [];
for (let i = -2; i < 9; i++) {
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
	allNotes_loc.push(cn, cs, dn, ds, en, fn, fs, gn, gs, an, as, bn);
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
function keyRanges(x) {
	receive('/template-io_keyRangeVar1', x);
	receive('/template-io_keyRangeScript', 1);
}
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

		if (keyP) {
			const trkNumb = arg1 * 128 + arg2;
			const trkRang = allTrack_jsn[trkNumb].INFO_XXX_trkRnge____;
			const trkName = allTrack_jsn[trkNumb].INFO_001_trkName____;
			const artRng3 = allTrack_jsn[trkNumb].INFO_057_artRange_03;

			receive('/selectedTrackName', trkName);
			receive('/selectedTrackKeyRanges', trkRang);
			receive('/template-io_selectedTrackName', trkName);
			receive('/template-io_selectedTrackKeyRanges', trkRang);

			if (artRng3 === '') {
				keyRanges(trkRang);
			}

			for (let i = 0; i < 8; i++) {
				const fadIndx = trkNumb * 8 + i;
				const nameOsc = fadName__osc[i];
				const addrOsc = fadAddr__osc[i];
				const codeOsc = fadCode__osc[i];
				const nameJsn = fadName__jsn[fadIndx];
				const typeJsn = '/control'; // will be fadType__jsn[fadIndx] in future
				const codeJsn = parseInt(fadCode__jsn[fadIndx]);
				const deftJsn = parseInt(fadDeflt_jsn[fadIndx]);
				const fadPage = fadCode__jsn[4];

				receive(nameOsc, nameJsn);
				receive(addrOsc, deftJsn);
				receive(codeOsc, codeJsn);

				if (codeJsn !== null) {
					prmUpdate(4, typeJsn, codeJsn, deftJsn);
				} else continue;

				if (fadPage !== null) {
					receive('/faderPanel-color-2', '1px solid red');
				} else {
					receive('/faderPanel-color-2', '');
				}
			}
			for (let i = 0; i < 18; i++) {
				const artIndx = trkNumb * 18 + i;
				const nameOsc = artName__osc[i];
				const typeOsc = artType__osc[i];
				const codeOsc = artCode__osc[i];
				const inptOsc = artInput_osc[i];
				const deftOsc = artDeflt_osc[i];
				const on__Osc = artOn____osc[i];
				const off_Osc = artOff___osc[i];
				const rangOsc = artRange_osc[i];
				const colrOsc = artColor_osc[i];
				const modAOsc = artModeA_osc[i];
				const modBOsc = artModeB_osc[i];
				const nameJsn = artName__jsn[artIndx];
				const typeJsn = artType__jsn[artIndx];
				const codeJsn = parseInt(artCode__jsn[artIndx]);
				const deftJsn = parseInt(artDeflt_jsn[artIndx]);
				const on__Jsn = parseInt(artOn____jsn[artIndx]);
				const off_Jsn = parseInt(artOff___jsn[artIndx]);
				const rangJsn = String(artRange_jsn[artIndx]);
				let codeDsp;

				if (typeJsn === '/control') {
					codeDsp = 'CC';
				} else if (typeJsn === '/note') {
					codeDsp = allNotes_loc[codeJsn] + '/';
				} else {
					codeDsp = '';
				}

				if (togCodes_loc && nameJsn !== '') {
					receive(nameOsc, nameJsn + ' (' + codeDsp + codeJsn + '/' + on__Jsn + ')');
				} else {
					receive(nameOsc, nameJsn);
				}

				if (rangJsn === '') {
					receive(rangOsc, ' ');
				} else {
					receive(rangOsc, rangJsn);
				}

				receive(typeOsc, typeJsn);
				receive(codeOsc, codeJsn);
				receive(deftOsc, deftJsn);
				receive(on__Osc, on__Jsn);
				receive(off_Osc, off_Jsn);
				receive(modAOsc, 0.15);
				receive(modBOsc, 0.15);

				if (nameJsn === '') {
					receive(nameOsc, ' ');
					receive(inptOsc, 'true');
					receive(colrOsc, '#A9A9A9');
				} else {
					receive(inptOsc, 'false');
					if (i <= 1) {
						receive(colrOsc, '#a86739');
						prmUpdate(3, typeJsn, codeJsn, deftJsn);
					} else {
						receive(colrOsc, '#6dfdbb');
						receive(deftOsc, deftJsn);
						if (deftJsn !== 0) {
							receive(modAOsc, 0.75);
							prmUpdate(4, typeJsn, codeJsn, deftJsn);
							keyRanges(rangJsn);
						}
					}
				}
			}
		}
		return { address, args, host, port };
	},
};
