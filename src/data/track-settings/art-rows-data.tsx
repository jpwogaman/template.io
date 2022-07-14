import { FC, Fragment, useState } from 'react';
import { ArtSettingsRow } from './art-rows'

interface ArtDataProps {
    toggle?: boolean;
}

export const ArtData: FC<ArtDataProps> = ({ toggle }) => {

    const [ArtList, setArts] = useState<{ id: string }[]>([
        {
            id: "01"
        }
    ])

    const addArt = (artId: string) => {

        let newArtIdNumb: number = parseInt(artId) + 1

        let newArtIdStr: string = newArtIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newArt = { id: newArtIdStr }
        setArts([...ArtList, newArt])
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