import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { FadSettingsRow } from './fad-settings-row'

interface FaderDataProps {
    setFaders: Dispatch<SetStateAction<{ id: string }[]>>;
    FaderList: { id: string }[];
}

export const FaderData: FC<FaderDataProps> = ({ setFaders, FaderList }) => {

    const removeFader = (fadId: string) => {

        if (fadId === FaderList![FaderList.length - 1].id) {
            console.log('it does')
        }

        if (FaderList.length !== 1) {
            setFaders(FaderList.filter((fader) => fader.id !== fadId));
        }
    }

    return (
        <Fragment>
            {FaderList.map((fader) => (
                <FadSettingsRow
                    key={fader.id}
                    id={fader.id}
                    onDelete={() => removeFader(fader.id)} />
            ))}
        </Fragment>
    )
}