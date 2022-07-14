import { TdSelect } from '../components/select';
import { IconBtnToggle } from '../components/button-icon-toggle'
import { SettingsRow } from '../data/track-settings/track-settings-rows'
import { TdInput } from '../components/input';
import { FC } from 'react';

export const devMode = true

interface TrackSettingsProps {
    selectedTrack: string;
    selectedTrackName: string;

}

const TrackSettings: FC<TrackSettingsProps> = ({ selectedTrackName, selectedTrack }) => {

    const closeSettingsWindow = () => {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MSshow', 'MShide');
        document.getElementById('TemplateTracks')!.classList.replace('MSshowTemplateTracks', 'MShideTemplateTracks');
    }

    const toggleNow = () => {
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

    const settingsTd =
        `border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

    const longNameTh =
        `hidden xl:table-cell`

    const shrtNameTh =
        `table-cell xl:hidden`

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
                    onToggleA={toggleNow}
                    onToggleB={toggleNow}>
                </IconBtnToggle>
                <button
                    className="w-10 h-10 border-2 border-zinc-900 dark:border-zinc-200 hover:scale-[1.15] hover:animate-pulse"
                    title="Save the Settings for this Track."
                    id="editSave">
                    <i className="fa-solid fa-save"></i>
                </button>
                {!devMode ? <div className=''>
                    <ul id="dropdown-item-button">
                        <li>Print Track Settings</li>
                        <li>Save Track Settings as Manufacturer Default</li>
                        <li>Open Manufacturer Default Settings for Track</li>
                        <li>Save Track Settings as User Default</li>
                        <li>Open User Default Settings for Track</li>
                    </ul>
                </div> : null}
            </div>

            <h2 id="trkEditDisplay" className='my-2'>{`Track ${parseInt(selectedTrack)}: ${selectedTrackName}`}</h2>

            <div className='flex items-center text-xs xl:text-lg'>

                <p>Playable Ranges: </p>
                <div>
                    <TdInput
                        id={`fullRangeName_trk_${parseInt(selectedTrack)}`}
                        title="Describe this range-group. (i.e hits/rolls)"
                        placeholder="Range"
                        defaultValue='Full Range'>
                    </TdInput>
                </div>

                <div className={`${settingsTd} mx-2`}>
                    <TdSelect id={`FullRngBot_trk_${parseInt(selectedTrack)}`} options="allNoteList"></TdSelect>
                </div>

                <i className='fas fa-arrow-right-long' />

                <div className={`${settingsTd} mx-2`}>
                    <TdSelect id={`FullRngTop_trk_${parseInt(selectedTrack)}`} options="allNoteList"></TdSelect>
                </div>

                <button
                    className="w-6 h-6 hover:scale-[1.15] hover:animate-pulse"
                    title="This patch has more than one set of playable ranges.">
                    <i className="fa-solid fa-plus" />
                </button>

            </div>
            <div className='flex items-center my-2 text-xs xl:text-lg'>
                <p>Base Track Delay (ms):</p>
                <div>
                    <TdInput
                        id={`baseDelay_trk_${parseInt(selectedTrack)}`}
                        title="Set the base track delay in ms for this track."
                        placeholder="0"
                        defaultValue='0'>
                    </TdInput>
                </div>
            </div>
            <div className='flex items-center text-xs xl:text-lg'>
                <p>Avg. Track Delay (ms): {`fromArtInputs`}</p>
            </div>


            <h4 className='mt-5 mb-1'>Faders</h4>

            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title="Fader Number">No.</th>
                        <th className={`${settingsTh} w-[19%] xl:w-[20%]`} title="Set the NAME for this parameter. (i.e Dynamics)">Name</th>
                        <th className={`${settingsTh} w-[24%] xl:w-[25%]`} title="Select the TYPE of code for this parameter.">Code Type</th>
                        <th className={`${settingsTh} w-[18%] xl:w-[18%]`} title="Set the CODE for this patch. (i.e. CC11)">Code</th>
                        <th className={`${settingsTh} ${longNameTh} w-[18%] xl:w-[18%]`} title="Set the default patch.">Default</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[18%] xl:w-[18%]`} title="Set the default patch.">Deft.</th>
                        <th className={`${settingsTh} ${longNameTh} w-[14%] xl:w-[14%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Change Type</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[14%] xl:w-[14%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Chng.</th>
                    </tr >
                </thead >
                <tbody>
                    <SettingsRow id="01" type="fad" variant={undefined}></SettingsRow>
                </tbody>
            </table >

            <h4 className='mt-5 mb-1'>Articulations (toggle)</h4>

            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title="Articulation Number">No.</th>
                        <th className={`${settingsTh} w-[19%] xl:w-[20%]`} title="Set the NAME for this patch. (i.e Legato On/OFF)">Name</th>
                        <th className={`${settingsTh} w-[24%] xl:w-[25%]`} title="Select the TYPE of code for this patch.">Code Type</th>
                        <th className={`${settingsTh} w-[07%] xl:w-[07%]`} title="Set the CODE for this patch. (i.e. CC58)">Code</th>
                        <th className={`${settingsTh} w-[07%] xl:w-[07%]`} title="Set the ON setting for this patch. (i.e. CC58, Value 76)" > On</th >
                        <th className={`${settingsTh} w-[07%] xl:w-[07%]`} title="Set the OFF setting for this patch. (i.e. CC58, Value 81)" > Off</th >
                        <th className={`${settingsTh} ${longNameTh} w-[07%] xl:w-[07%]`} title="Set the track delay for this patch in ms.">Delay</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[07%] xl:w-[07%]`} title="Set the track delay for this patch in ms.">Del.</th>
                        <th className={`${settingsTh} ${longNameTh} w-[07%] xl:w-[07%]`} title="Set the default patch." > Default</th >
                        <th className={`${settingsTh} ${shrtNameTh} w-[07%] xl:w-[07%]`} title="Set the default patch." > Deft.</th >
                        <th className={`${settingsTh} ${longNameTh} w-[15%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes" > Change Type</th >
                        <th className={`${settingsTh} ${shrtNameTh} w-[15%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes" > Chng.</th >
                    </tr >
                </thead >
                <tbody>
                    <SettingsRow id="01" type="art" variant="tog"></SettingsRow>
                </tbody>
            </table >
            <h4 className='mt-5 mb-1'>Articulations (switch)</h4>
            <table className='w-full table-fixed text-left xl:text-sm md:text-xs'>
                <thead>
                    <tr>
                        <th className={`${settingsTh} w-[07%] xl:w-[05%]`} title="Articulation Number">No.</th>
                        <th className={`${settingsTh} w-[19%] xl:w-[20%]`} title="Set the NAME for this patch. (i.e Staccato)">Name</th>
                        <th className={`${settingsTh} w-[24%] xl:w-[25%]`} title="Select the TYPE of code for this patch.">Code Type</th>
                        <th className={`${settingsTh} w-[07%] xl:w-[07%]`} title="Set the CODE for this patch. (i.e. CC58)">Code</th>
                        <th className={`${settingsTh} w-[07%] xl:w-[07%]`} title="Set the ON setting for this patch. (i.e. CC58, Value 21)">On</th>
                        <th className={`${settingsTh} ${longNameTh} w-[07%] xl:w-[07%]`} title="Set the number of playable ranges for this patch.">Range</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[07%] xl:w-[07%]`} title="Set the number of playable ranges for this patch.">Rng.</th>
                        <th className={`${settingsTh} ${longNameTh} w-[07%] xl:w-[07%]`} title="Set the track delay for this patch in ms.">Delay</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[07%] xl:w-[07%]`} title="Set the track delay for this patch in ms.">Del.</th>
                        <th className={`${settingsTh} ${longNameTh} w-[07%] xl:w-[07%]`} title="Set the default patch.">Default</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[07%] xl:w-[07%]`} title="Set the default patch.">Deft.</th>
                        <th className={`${settingsTh} ${longNameTh} w-[15%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Change Type</th>
                        <th className={`${settingsTh} ${shrtNameTh} w-[15%] xl:w-[15%]`} title="Switch between Value 1-Based and Value 2-Based Changes">Chng.</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="03" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="art" variant={undefined}></SettingsRow>
                </tbody>
            </table>
        </div >
    );
};

export default TrackSettings