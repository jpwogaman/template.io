import { TdSelect } from '../components/td-select';
import { IconBtnToggle } from '../components/icon-btn-toggle'
import { TdInput } from '../components/td-input';
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from 'react';
import { FaderData } from '../data/track-settings/fad-data';
import { ArtToggleData, ArtSwitchData } from '../data/track-settings/art-data';
import { TrackListProps } from './template-app';
interface TrackSettingsProps {
    TrackList: TrackListProps[];
    setTracks: Dispatch<SetStateAction<TrackListProps[]>>;
    setSelectedTrack: Dispatch<SetStateAction<TrackListProps>>;
    selectedTrack: TrackListProps;
}

export const TrackSettings: FC<TrackSettingsProps> = ({ setSelectedTrack, selectedTrack, setTracks, TrackList }) => {

    const [ArtList, setArts] = useState<TrackListProps["artList"]>(selectedTrack.artList)

    const addArt = (toggle: boolean) => {

        const lastArtId = ArtList[ArtList.length - 1].id

        if (ArtList.length > 23) {
            return alert('Are you sure you need this many articulation buttons?')
        }

        const newArtIdNumb: number = parseInt(lastArtId) + 1
        const newArtIdStr: string = newArtIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newArtToggle = {
            id: newArtIdStr,
            name: undefined,
            toggle: toggle,
            codeType: undefined,
            code: undefined,
            on: toggle ? undefined : null,
            off: toggle ? undefined : null,
            range: [
                {
                    id: toggle ? '01' : undefined,
                    name: undefined,
                    low: undefined,
                    high: undefined
                }
            ],
            default: toggle ? 'on' : false, //setting choice later
            delay: 0,
            changeType: undefined
        }

        const updatedTrack = {
            id: selectedTrack.id,
            locked: selectedTrack.locked,
            name: selectedTrack.name,
            channel: selectedTrack.channel,
            fullRange: selectedTrack.fullRange,
            baseDelay: selectedTrack.baseDelay,
            avgDelay: selectedTrack.avgDelay,
            artList: [...ArtList, newArtToggle],
            fadList: selectedTrack.fadList
        }

        const selectedTrackIndex = TrackList.indexOf(selectedTrack)
        const trackListFilter = TrackList.splice(selectedTrackIndex, 1, updatedTrack)

        setArts(updatedTrack.artList)
        setTracks(trackListFilter)
        setSelectedTrack(updatedTrack)

        console.log(trackListFilter)
        console.log('trackList', TrackList)
    }

    const [FaderList, setFaders] = useState<TrackListProps["fadList"]>(selectedTrack.fadList)

    const addFader = () => {

        const lastFadId = FaderList[FaderList.length - 1].id

        if (FaderList.length > 11) {
            return alert('Are you sure you need this many faders?')
        }

        let newfadIdNumb: number = parseInt(lastFadId) + 1
        let newfadIdStr: string = newfadIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newFader = {
            id: newfadIdStr,
            name: undefined,
            codeType: undefined,
            code: undefined,
            default: undefined,
            changeType: undefined
        }
        const updatedTrack = {
            id: selectedTrack.id,
            locked: selectedTrack.locked,
            name: selectedTrack.name,
            channel: selectedTrack.channel,
            fullRange: selectedTrack.fullRange,
            baseDelay: selectedTrack.baseDelay,
            avgDelay: selectedTrack.avgDelay,
            artList: selectedTrack.artList,
            fadList: [...FaderList, newFader]
        }

        const selectedTrackIndex = TrackList.indexOf(selectedTrack)
        const trackListFilter = TrackList.splice(selectedTrackIndex, 1, updatedTrack)

        setFaders(updatedTrack.fadList)
        setTracks(trackListFilter)
        setSelectedTrack(updatedTrack)

        console.log(trackListFilter)
        console.log('trackList', TrackList)
    }

    const [baseDelay, setBaseDelay] = useState<number>(0)
    const [avgTrkDel, setAvgTrkDel] = useState<number | string>(0)
    const [avgDelAvail, setAvgDelAvail] = useState<boolean>(false)

    const baseDelayChange = (event: ChangeEvent<HTMLInputElement>) => {

        let y = event.target.value
        let x: number = parseInt(y)
        let trkDelArray: number[] = [x]

        for (let i = 0; i < ArtList.length; i++) {
            trkDelArray.push(ArtList[i].delay)
        }

        let trkDelTotal: number = trkDelArray.reduce((a, b) => a + b, 0)
        let newAvgNumb: number = trkDelTotal / trkDelArray.length
        let newAvgStr: string = newAvgNumb % 1 === 0 ? newAvgNumb.toFixed(0) : newAvgNumb.toFixed(2)

        setAvgTrkDel(newAvgStr)
        setBaseDelay(x)

        // if (!avgDelAvail) {
        //     setSelectedDelay(`${trkDelTotal}`)
        // } else {
        //     setSelectedDelay(`~${newAvgStr}/${trkDelArray.length}`)
        // }
    }

    const delayChangeClickTest = () => {

    }

    const [FullRangeList, setFullRanges] = useState<TrackListProps["fullRange"]>(selectedTrack.fullRange)

    const onlyRange: boolean = FullRangeList?.length! > 1 ? true : false

    const addFullRange = (trkId: string, fullRangeId: string) => {

        let newFullRangeIdNumb: number = parseInt(fullRangeId) + 1

        let newFullRangeIdStr: string = newFullRangeIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newFullRange = {
            id: newFullRangeIdStr,
            name: undefined,
            low: undefined,
            high: undefined,
        }

        setFullRanges([...FullRangeList, newFullRange])
    }

    const removeFullRange = (artId: string, fullRangeId: string) => {

        if (FullRangeList?.length !== 1) {
            setFullRanges(FullRangeList?.filter((fullRange) => fullRange.id !== fullRangeId));
        }
    }

    const closeSettingsWindow = () => {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MSshow', 'MShide');
        document.getElementById('TemplateTracks')!.classList.replace('MSshowTemplateTracks', 'MShideTemplateTracks');
    }

    const toggleLock = () => {
        console.log('lock')
    }

    const settingsTh =
        `border-2 
        border-zinc-100 
        border-b-transparent 
        dark:border-zinc-400 
        dark:border-b-transparent
        bg-zinc-200 
        dark:bg-zinc-600
        font-bold 
        dark:font-normal
        p-1`

    const rangeTr =
        `bg-stone-300
        dark:bg-zinc-800
        ${onlyRange ? 'bg-zinc-300 dark:bg-stone-800' : null}`

    const rangeTd =
        `border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

    return (
        <div id="TemplateTrackSettings" className="bg-stone-300 dark:bg-zinc-800 h-[100%] overflow-y-scroll text-zinc-900 dark:text-zinc-200 MSshow p-4 z-50 transition-all duration-1000">
            <div className='flex justify-space align-middle'>
                <button
                    className="w-[40px] h-[40px] text-xl border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                    title="Close the Track Settings Window."
                    id="editClose"
                    onClick={closeSettingsWindow}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <IconBtnToggle
                    classes="w-[40px] h-[40px] mx-2 border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                    titleA="Lock the Settings for this Track."
                    titleB="Unlock the Settings for this Track."
                    id="editLock"
                    a="fa-solid fa-lock-open"
                    b="fa-solid fa-lock"
                    defaultIcon="a"
                    onToggleA={toggleLock}
                    onToggleB={toggleLock}>
                </IconBtnToggle>
                <button
                    className="w-[40px] h-[40px] border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                    title="Save the Settings for this Track."
                    id="editSave"
                    onClick={delayChangeClickTest}>
                    <i className="fa-solid fa-save"></i>
                </button>
            </div>
            <h2 id="trkEditDisplay" className='my-2'>{`Track ${parseInt(selectedTrack.id)}: ${selectedTrack.name}`}</h2>
            <div className={`flex text-xs xl:text-lg ${onlyRange ? 'bg-zinc-300 dark:bg-stone-800' : null}`}>
                <p className='py-1'>Playable Ranges: </p>
                <table className=''>
                    <tbody>
                        {FullRangeList?.map((range) => (
                            <tr key={`FullRange_trk_${parseInt(selectedTrack.id)}_${range.id}`} id={`FullRange_trk_${parseInt(selectedTrack.id)}_${range.id}`} className={`${rangeTr}`}>
                                <td className={`pr-2`}>
                                    <TdInput
                                        td={true}
                                        id={`FullRangeName_trk_${parseInt(selectedTrack.id)}_${range.id}`}
                                        title="Describe this range-group. (i.e hits/rolls)"
                                        placeholder="Range Description"
                                        defaultValue={onlyRange ? undefined : "Full Range"}
                                        codeDisabled={false}>
                                    </TdInput>
                                </td>
                                <td className={`${rangeTd}`}>
                                    <TdSelect id={`FullRngBot_trk_${parseInt(selectedTrack.id)}_${range.id}`} options="allNoteList"></TdSelect>
                                </td>
                                <td className={`p-0.5 text-center`}>
                                    <i className='fas fa-arrow-right-long' />
                                </td>
                                <td className={`${rangeTd}`}>
                                    <TdSelect id={`FullRngTop_trk_${parseInt(selectedTrack.id)}_${range.id}`} options="allNoteList"></TdSelect>
                                </td>
                                <td className={`text-center`}>
                                    <IconBtnToggle
                                        classes="w-6 h-6 hover:scale-[1.15] hover:animate-pulse"
                                        titleA="Add another set of playable ranges."
                                        titleB="Remove this set of playable ranges."
                                        id={`FullRangeAddButton_trk_${parseInt(selectedTrack.id)}_${range.id}`}
                                        a="fa-solid fa-plus"
                                        b="fa-solid fa-minus"
                                        defaultIcon="a"
                                        onToggleA={() => addFullRange(`${parseInt(selectedTrack.id)}`, range.id)}
                                        onToggleB={() => removeFullRange(`${parseInt(selectedTrack.id)}`, range.id)}>
                                    </IconBtnToggle>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex items-center my-2 text-xs xl:text-lg'>
                <p>Base Track Delay (ms):</p>
                <div>
                    <TdInput
                        td={false}
                        id={`baseDelay_trk_${parseInt(selectedTrack.id)}`}
                        title="Set the base track delay in ms for this track."
                        placeholder="0"
                        valueType='number'
                        onInput={baseDelayChange}>
                    </TdInput>
                </div>
            </div>
            <div className={`items-center text-xs xl:text-lg ${!avgDelAvail ? 'hidden' : 'flex'}`}>
                <p>Avg. Track Delay (ms):</p>
                <div>
                    <TdInput
                        id={`avgDelay_trk_${parseInt(selectedTrack.id)}`}
                        title="The average delay in ms for this track."
                        placeholder={avgTrkDel as unknown as string}
                        defaultValue={avgTrkDel as unknown as number}
                        onReceive={avgTrkDel as unknown as number}
                        td={true}
                        valueType='number'
                        codeDisabled={true}>
                    </TdInput>
                </div>
            </div>

            <h4 className='mt-5 mb-2'>Faders</h4>

            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[05%]`} title="Fader Number">No.</th>
                        <th className={`${settingsTh} w-[20%]`} title="Set the NAME for this parameter. (i.e Dynamics)">Name</th>
                        <th className={`${settingsTh} w-[20%]`} title="Select the TYPE of code for this parameter.">Code Type</th>
                        <th className={`${settingsTh} w-[17.5%]`} title="Set the CODE for this patch. (i.e. CC11)">Code</th>
                        <th className={`${settingsTh} w-[17.5%]`} title="Set the default patch.">Default</th>
                        <th className={`${settingsTh} w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Change Type</th>
                        <th className={`${settingsTh} w-[05%] text-center`} title="">
                            <button
                                className="w-full h-full text-base hover:scale-[1.15] hover:animate-pulse"
                                title="Add Another Fader."
                                id="addFader"
                                onClick={addFader}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </th>
                    </tr >
                </thead >
                <tbody>
                    <FaderData
                        setFaders={setFaders}
                        selectedTrack={selectedTrack}
                    />
                </tbody>
            </table >
            <h4 className='mt-5 mb-2'>Articulations (toggle)</h4>
            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[05%]`} title="Articulation Number">No.</th>
                        <th className={`${settingsTh} w-[20%]`} title="Set the NAME for this patch. (i.e Legato On/OFF)">Name</th>
                        <th className={`${settingsTh} w-[20%]`} title="Select the TYPE of code for this patch.">Code Type</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the CODE for this patch. (i.e. CC58)">Code</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the ON setting for this patch. (i.e. CC58, Value 76)" > On</th >
                        <th className={`${settingsTh} w-[07%]`} title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" > Off</th >
                        <th className={`${settingsTh} w-[07%]`} title="Set the DEFAULT default setting for this patch." > Default</th >
                        <th className={`${settingsTh} w-[07%]`} title="Set the track delay for this patch in ms.">Delay</th>
                        <th className={`${settingsTh} w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes" > Change Type</th >
                        <th className={`${settingsTh} w-[05%] text-center`} title="">
                            <button
                                className="w-full h-full text-base hover:scale-[1.15] hover:animate-pulse"
                                title="Add Another Toggle Articulation."
                                id="addToggleArticulation"
                                onClick={() => addArt(true)}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </th>
                    </tr >
                </thead >
                <tbody>
                    <ArtToggleData
                        selectedTrack={selectedTrack}
                        setArts={setArts}
                        setAvgDelAvail={setAvgDelAvail}
                        baseDelay={baseDelay} />
                </tbody>
            </table >
            <h4 className='mt-5 mb-2'>Articulations (switch)</h4>
            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[05%]`} title="Articulation Number">No.</th>
                        <th className={`${settingsTh} w-[20%]`} title="Set the NAME for this patch. (i.e Staccato)">Name</th>
                        <th className={`${settingsTh} w-[20%]`} title="Select the TYPE of code for this patch.">Code Type</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the CODE for this patch. (i.e. CC58)">Code</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the ON setting for this patch. (i.e. CC58, Value 21)">On</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the number of playable ranges for this patch.">Range</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the default patch.">Default</th>
                        <th className={`${settingsTh} w-[07%]`} title="Set the track delay for this patch in ms.">Delay</th>
                        <th className={`${settingsTh} w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Change Type</th>
                        <th className={`${settingsTh} w-[05%] text-center`} title="">
                            <button
                                className="w-full h-full text-base hover:scale-[1.15] hover:animate-pulse"
                                title="Add Another Switch Articulation."
                                id="addSwitchArticulation"
                                onClick={() => addArt(false)}>
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <ArtSwitchData
                        selectedTrack={selectedTrack}
                        setArts={setArts}
                        setTracks={setTracks}
                        setSelectedTrack={setSelectedTrack}
                        TrackList={TrackList}
                        setAvgDelAvail={setAvgDelAvail}
                        baseDelay={baseDelay} />
                </tbody>
            </table>
        </div >
    );
};