import { TdSelect } from './select';
import { IconBtnToggle } from './button-icon-toggle'
import { SettingsRow } from './track-settings-table-row'

export default function TrackSettings() {

    const closeSettingsWindow = () => {
        document.getElementById('TemplateTrackSettings')!.classList.replace('MSshow', 'MShide');
        document.getElementById('TemplateTracks')!.classList.replace('MSshowTemplateTracks', 'MShideTemplateTracks');
    }

    return (
        <div id="TemplateTrackSettings" className="MShide p-4 z-50 w-1/2 bg-main-grey transition-all duration-1000 overflow-x-scroll">
            <div>
                <div >
                    <button
                        className="w-10 h-10 border border-black mr-1 hover:border-green-50"
                        title="Close Track Settings Window"
                        onClick={closeSettingsWindow}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <IconBtnToggle
                        className="w-10 h-10 border border-black mr-1 hover:border-green-50"
                        title="Close Track Settings Window"
                        id="editLock"
                        a="fa-solid fa-lock-open"
                        b="fa-solid fa-lock"
                        defaultIcon="a">
                    </IconBtnToggle>
                    <button
                        className="w-10 h-10 border border-black mr-1 hover:border-green-50"
                        title="Save Settings Window">
                        <i className="fa-solid fa-save"></i>
                    </button>
                    <div className='invisible'>
                        <ul id="dropdown-item-button">
                            <li>Print Track Settings</li>
                            <li>Save Track Settings as Manufacturer Default</li>
                            <li>Open Manufacturer Default Settings for Track</li>
                            <li>Save Track Settings as User Default</li>
                            <li>Open User Default Settings for Track</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h2 id="trkEditDisplay" className=''>Track:</h2>

            <div className='flex items-center'>
                <div>
                    <h3>Playable Range:</h3>
                </div>
                <div className='border-2 border-gray-400'>
                    <TdSelect id={`FullRngBot_${'needtofindtrkid1'}`} options="allNoteList"></TdSelect>
                </div>
                <div><i className='fas fa-arrow-right-long ml-1 mr-2' /></div>
                <div className='border-2 border-gray-400'>
                    <TdSelect id={`FullRngTop_${'needtofindtrkid2'}`} options="allNoteList"></TdSelect>
                </div>
            </div>

            <h3 className=''>Faders</h3>

            <table className='min-w-full table-fixed text-left'>
                <thead>
                    <tr>
                        <th className='p-0.5'>No.</th>
                        <th className='p-0.5'>Name</th>
                        <th className='p-0.5'>Code Type</th>
                        <th className='p-0.5'>Code</th>
                        <th className='p-0.5'>Default</th>
                        <th className='p-0.5'>Change-Type</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="01" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="02" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="03" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="05" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="06" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="07" type="fad" variant={undefined}></SettingsRow>
                    <SettingsRow id="08" type="fad" variant={undefined}></SettingsRow>
                </tbody>
            </table>

            <h3 className=''>Articulations (toggle)</h3>

            <table className='min-w-full table-fixed text-left'>
                <thead>
                    <tr>
                        <th className='p-0.5'>No.</th>
                        <th className='p-0.5'>Name</th>
                        <th className='p-0.5'>Code Type</th>
                        <th className='p-0.5'>Code</th>
                        <th className='p-0.5'>On</th>
                        <th className='p-0.5'>Off</th>
                        <th className='p-0.5'>Default</th>
                        <th className='p-0.5'>Change-Type</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="01" type="art" variant="tog"></SettingsRow>
                    <SettingsRow id="02" type="art" variant="tog"></SettingsRow>
                </tbody>
            </table>
            <h3 className=''>Articulations (one-at-a-time)</h3>
            <table className='min-w-full table-fixed text-left'>
                <thead>
                    <tr>
                        <th className='p-0.5'>No.</th>
                        <th className='p-0.5'>Name</th>
                        <th className='p-0.5'>Code Type</th>
                        <th className='p-0.5'>Code</th>
                        <th className='p-0.5'>On</th>
                        <th className='p-0.5'>Range</th>
                        <th className='p-0.5'>Default</th>
                        <th className='p-0.5'>Change-Type</th>
                    </tr>
                </thead>
                <tbody>
                    <SettingsRow id="03" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="04" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="05" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="06" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="07" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="08" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="09" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="10" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="11" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="12" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="13" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="14" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="15" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="16" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="17" type="art" variant={undefined}></SettingsRow>
                    <SettingsRow id="18" type="art" variant={undefined}></SettingsRow>
                </tbody>
            </table>
        </div >
    );
};