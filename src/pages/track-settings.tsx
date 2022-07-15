import { TdSelect } from '../components/select';
import { IconBtnToggle } from '../components/button-icon-toggle'
import { TdInput } from '../components/input';
import { ChangeEvent, Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { FaderData } from '../data/track-settings/fad-rows-data';
import { ArtData } from '../data/track-settings/art-rows-data';
interface TrackSettingsProps {
    selectedTrack: string;
    selectedTrackName: string;
    setSelectedDelay: Dispatch<SetStateAction<string>>;
}

export const TrackSettings: FC<TrackSettingsProps> = ({ setSelectedDelay, selectedTrackName, selectedTrack }) => {

    const [avgTrkDel, setAvgTrkDel] = useState<number>(0)

    const [delayList, setDelays] = useState<{ id: string, delay: number }[]>([
        {
            id: 'base',
            delay: 0
        },
        {
            id: 'art_01',
            delay: 0
        },
    ])

    const baseDelayChange = (event: ChangeEvent<HTMLInputElement>) => {

        let x = event.target.value as unknown as number
        let trkDelTotal: number = 0

        setDelays(prevState => {
            const newState = prevState.map(obj => {
                if (obj.id === 'base') {
                    return { ...obj, delay: x };
                }
                return obj;
            });
            return newState;
        });

        for (let i = 0; i < delayList.length; i++) {
            trkDelTotal += delayList[i].delay
        }

        setAvgTrkDel(trkDelTotal + x / delayList.length)

        if (delayList.length < 2) {
            setSelectedDelay(`${avgTrkDel}`)
        } else {
            setSelectedDelay(`~${avgTrkDel}/${delayList.length}`)
        }
    }

    const delayChangeClickTest = () => {
        console.log(delayList[0].delay, typeof delayList[0].delay)
    }

    const [FullRangeList, setFullRanges] = useState<{ id: string }[]>([
        {
            id: "01"
        },
    ])
    const onlyRange: boolean = FullRangeList.length > 1 ? true : false

    const addFullRange = (artId: string, fullRangeId: string) => {

        let newFullRangeIdNumb: number = parseInt(fullRangeId) + 1

        let newFullRangeIdStr: string = newFullRangeIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newFullRange = { id: newFullRangeIdStr }
        setFullRanges([...FullRangeList, newFullRange])
    }

    const removeFullRange = (artId: string, fullRangeId: string) => {

        if (FullRangeList.length !== 1) {
            setFullRanges(FullRangeList.filter((fullRange) => fullRange.id !== fullRangeId));
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

    const longNameTh =
        `hidden xl:table-cell`

    const shrtNameTh =
        `table-cell xl:hidden`

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
        <div id="TemplateTrackSettings" className="bg-stone-300 dark:bg-zinc-800 h-[100%] overflow-auto text-zinc-900 dark:text-zinc-200 MSshow p-4 z-50 transition-all duration-1000">
            <div className='flex justify-space align-middle'>
                <button
                    className="w-10 h-10 text-xl border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                    title="Close the Track Settings Window."
                    id="editClose"
                    onClick={closeSettingsWindow}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <IconBtnToggle
                    classes="w-10 h-10 mx-2 border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
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
                    className="w-10 h-10 border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                    title="Save the Settings for this Track."
                    id="editSave"
                    onClick={delayChangeClickTest}>
                    <i className="fa-solid fa-save"></i>
                </button>
            </div>
            <h2 id="trkEditDisplay" className='my-2'>{`Track ${parseInt(selectedTrack)}: ${selectedTrackName}`}</h2>
            <div className={`flex text-xs xl:text-lg ${onlyRange ? 'bg-zinc-300 dark:bg-stone-800' : null}`}>
                <p className='py-1'>Playable Ranges: </p>
                <table className=''>
                    <tbody>
                        {FullRangeList.map((range) => (
                            <tr key={`FullRange_trk_${parseInt(selectedTrack)}_${range.id}`} id={`FullRange_trk_${parseInt(selectedTrack)}_${range.id}`} className={`${rangeTr}`}>
                                <td className={`pr-2`}>
                                    <TdInput
                                        td={true}
                                        id={`FullRangeName_trk_${parseInt(selectedTrack)}_${range.id}`}
                                        title="Describe this range-group. (i.e hits/rolls)"
                                        placeholder="Range Description"
                                        defaultValue={onlyRange ? undefined : "Full Range"}
                                        codeDisabled={false}>
                                    </TdInput>
                                </td>
                                <td className={`${rangeTd}`}>
                                    <TdSelect id={`FullRngBot_trk_${parseInt(selectedTrack)}_${range.id}`} options="allNoteList"></TdSelect>
                                </td>
                                <td className={`p-0.5 text-center`}>
                                    <i className='fas fa-arrow-right-long' />
                                </td>
                                <td className={`${rangeTd}`}>
                                    <TdSelect id={`FullRngTop_trk_${parseInt(selectedTrack)}_${range.id}`} options="allNoteList"></TdSelect>
                                </td>
                                <td className={`text-center`}>
                                    <IconBtnToggle
                                        classes="w-6 h-6 hover:scale-[1.15] hover:animate-pulse"
                                        titleA="Add another set of playable ranges."
                                        titleB="Remove this set of playable ranges."
                                        id={`FullRangeAddButton_trk_${parseInt(selectedTrack)}_${range.id}`}
                                        a="fa-solid fa-plus"
                                        b="fa-solid fa-minus"
                                        defaultIcon="a"
                                        onToggleA={() => addFullRange(`${parseInt(selectedTrack)}`, range.id)}
                                        onToggleB={() => removeFullRange(`${parseInt(selectedTrack)}`, range.id)}>
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
                        id={`baseDelay_trk_${parseInt(selectedTrack)}`}
                        title="Set the base track delay in ms for this track."
                        placeholder="0"
                        onInput={baseDelayChange}>
                    </TdInput>
                </div>
            </div>
            <div className='flex items-center text-xs xl:text-lg'>
                <p>Avg. Track Delay (ms):</p>
                <div>
                    <TdInput
                        id={`avgDelay_trk_${parseInt(selectedTrack)}`}
                        title="The average delay in ms for this track."
                        placeholder={avgTrkDel as unknown as number}
                        defaultValue={avgTrkDel as unknown as number}
                        onReceive={avgTrkDel as unknown as number}
                        td={true}
                        codeDisabled={true}>
                    </TdInput>
                </div>
            </div>









            <h4 className='mt-5 mb-1'>Faders</h4>
            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title="Fader Number">No.</th>
                        <th className={`${settingsTh} w-[18%] xl:w-[20%]`} title="Set the NAME for this parameter. (i.e Dynamics)">Name</th>
                        <th className={`${settingsTh} w-[24%] xl:w-[25%]`} title="Select the TYPE of code for this parameter.">Code Type</th>
                        <th className={`${settingsTh} w-[15%] xl:w-[15%]`} title="Set the CODE for this patch. (i.e. CC11)">Code</th>
                        <th className={`${settingsTh} ${longNameTh} w-[15%] xl:w-[15%]`} title="Set the default patch.">Default</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[15%] xl:w-[15%]`} title="Set the default patch.">Deft.</th>
                        <th className={`${settingsTh} ${longNameTh} w-[14%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Change Type</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[14%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Chng.</th>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title=""></th>
                    </tr >
                </thead >
                <tbody>
                    <FaderData></FaderData>
                </tbody>
            </table >
            <h4 className='mt-5 mb-1'>Articulations (toggle)</h4>
            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title="Articulation Number">No.</th>
                        <th className={`${settingsTh} w-[18%] xl:w-[20%]`} title="Set the NAME for this patch. (i.e Legato On/OFF)">Name</th>
                        <th className={`${settingsTh} w-[24%] xl:w-[25%]`} title="Select the TYPE of code for this patch.">Code Type</th>
                        <th className={`${settingsTh} w-[06%] xl:w-[06%]`} title="Set the CODE for this patch. (i.e. CC58)">Code</th>
                        <th className={`${settingsTh} w-[06%] xl:w-[06%]`} title="Set the ON setting for this patch. (i.e. CC58, Value 76)" > On</th >
                        <th className={`${settingsTh} w-[06%] xl:w-[06%]`} title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" > Off</th >

                        <th className={`${settingsTh} ${longNameTh} w-[06%] xl:w-[06%]`} title="Set the default patch." > Default</th >
                        <th className={`${settingsTh} ${shrtNameTh} w-[06%] xl:w-[06%]`} title="Set the default patch." > Deft.</th >

                        <th className={`${settingsTh} ${longNameTh} w-[06%] xl:w-[06%]`} title="Set the track delay for this patch in ms.">Delay</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[06%] xl:w-[06%]`} title="Set the track delay for this patch in ms.">Del.</th>

                        <th className={`${settingsTh} ${longNameTh} w-[14%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes" > Change Type</th >
                        <th className={`${settingsTh} ${shrtNameTh} w-[14%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes" > Chng.</th >

                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title=""></th>
                    </tr >
                </thead >
                <tbody>
                    <ArtData setDelays={setDelays} toggle></ArtData>
                </tbody>
            </table >
            <h4 className='mt-5 mb-1'>Articulations (switch)</h4>
            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title="Articulation Number">No.</th>
                        <th className={`${settingsTh} w-[18%] xl:w-[20%]`} title="Set the NAME for this patch. (i.e Staccato)">Name</th>
                        <th className={`${settingsTh} w-[24%] xl:w-[25%]`} title="Select the TYPE of code for this patch.">Code Type</th>
                        <th className={`${settingsTh} w-[06%] xl:w-[06%]`} title="Set the CODE for this patch. (i.e. CC58)">Code</th>
                        <th className={`${settingsTh} w-[06%] xl:w-[06%]`} title="Set the ON setting for this patch. (i.e. CC58, Value 21)">On</th>

                        <th className={`${settingsTh} ${longNameTh} w-[06%] xl:w-[06%]`} title="Set the number of playable ranges for this patch.">Range</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[06%] xl:w-[06%]`} title="Set the number of playable ranges for this patch.">Rng.</th>

                        <th className={`${settingsTh} ${longNameTh} w-[06%] xl:w-[06%]`} title="Set the default patch.">Default</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[06%] xl:w-[06%]`} title="Set the default patch.">Deft.</th>

                        <th className={`${settingsTh} ${longNameTh} w-[06%] xl:w-[06%]`} title="Set the track delay for this patch in ms.">Delay</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[06%] xl:w-[06%]`} title="Set the track delay for this patch in ms.">Del.</th>

                        <th className={`${settingsTh} ${longNameTh} w-[14%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Change Type</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[14%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Chng.</th>

                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title=""></th>
                    </tr>
                </thead>
                <tbody>
                    <ArtData setDelays={setDelays} ></ArtData>
                </tbody>
            </table>
        </div >
    );
};