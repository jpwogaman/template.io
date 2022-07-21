import { FC, Fragment, useState } from 'react';
import { FadSettingsRow } from './fad-settings-row'

interface FaderDataProps {
}

export const FaderData: FC<FaderDataProps> = () => {

    const [FaderList, setFaders] = useState<{ id: string }[]>([
        {
            id: "01"
        }
    ])

    const addFader = (fadId: string) => {

        if (FaderList.length < 12) {
            let newfadIdNumb: number = parseInt(fadId) + 1

            let newfadIdStr: string = newfadIdNumb.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            const newFader = { id: newfadIdStr }
            setFaders([...FaderList, newFader])
        } else {
            alert('Are you sure you need this many faders?')
        }

        if (fadId === FaderList![FaderList.length - 1].id) {
            console.log('it does')
        }
    }

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
                    onAdd={() => addFader(fader.id)}
                    onDelete={() => removeFader(fader.id)} />
            ))}
        </Fragment>
    )
}