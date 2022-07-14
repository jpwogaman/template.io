import { FC, useState } from 'react';
import { TdSelect } from '../components/select';

interface SettingsFormProps {

}
const SettingsForm: FC<SettingsFormProps> = () => {

    const [isChecked, setChecked] = useState<boolean>(true)
    const [isChecked2, setChecked2] = useState<boolean>(false)


    const autoSave = () => {
        if (isChecked) {
            setChecked(false)
        } else {
            setChecked(true)
        }
    };

    const closeOnSave = () => {
        if (isChecked2) {
            setChecked2(false)
        } else {
            setChecked2(true)
        }
    };

    return (

        <div>
            <h2>General Settings</h2>

            <label htmlFor="">Auto-Save JSON / Auto-Push to OSC</label>
            <input
                type="checkmark"
                id="Auto-Save-JSON"
                checked={isChecked}
                onChange={autoSave}>
            </input>

            <label htmlFor="">Close this window on save</label>
            <input
                type="checkmark"
                id="closeSettings-Save"
                checked={isChecked2}
                onChange={closeOnSave}>
            </input>

            <h2>Note Numbers</h2>
            <TdSelect id="findMiddleC" options="middleCOption"></TdSelect>

            <h2>Track Settings</h2>

            <label htmlFor="vepOutSettings">Number of Ouputs per Instance</label>
            <TdSelect id="vepOutSettings" options="vepOutOption"></TdSelect>

            <label htmlFor="smpOutSettings">Number of Ouputs per Sampler</label>
            <TdSelect id="smpOutSettings" options="vepOutOption"></TdSelect>

            <button>Save</button>
        </div >
    );
};

export default function TemplateMainSettings() {

    return (
        <SettingsForm></SettingsForm>
    );
};