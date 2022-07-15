import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { ArtSettingsRow } from './art-rows'

interface ArtDataProps {
    toggle?: boolean;
    setDelays: Dispatch<SetStateAction<{ id: string, delay: number }[]>>;
}

export const ArtData: FC<ArtDataProps> = ({ setDelays, toggle }) => {

    const [ArtList, setArts] = useState<{ id: string }[]>([
        {
            id: "01"
        }
    ])

    const addArt = (artId: string) => {


        if (ArtList.length < 24) {
            let newArtIdNumb: number = parseInt(artId) + 1

            let newArtIdStr: string = newArtIdNumb.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            })
            const newArt = { id: newArtIdStr }
            setArts([...ArtList, newArt])
        } else {
            alert('Are you sure you need this many articulation buttons?')
        }
    }

    const removeArt = (artId: string) => {

        if (ArtList.length !== 1) {
            setArts(ArtList.filter((art) => art.id !== artId));
        }
    }

    return (
        <Fragment>
            {ArtList.map((art) => (
                <ArtSettingsRow
                    setDelays={setDelays}
                    key={art.id}
                    id={art.id}
                    onAdd={() => addArt(art.id)}
                    onDelete={() => removeArt(art.id)}
                    toggle={toggle}
                />
            ))}
        </Fragment>
    )
}