import { FC, Fragment } from "react";

import { ArtSettingsRow } from './art-rows'
import { FadSettingsRow } from './fad-rows'

interface SettingsRowProps {
    id: string;
    type: string;
    toggle?: boolean | undefined;
}

export const SettingsRow: FC<SettingsRowProps> = ({ id, type, toggle }) => {

    const artFad: boolean = type === "art" ? true : false

    return (

        <Fragment>
            {artFad ?
                <FadSettingsRow id={id}></FadSettingsRow> :
                <ArtSettingsRow id={id} toggle={toggle}></ArtSettingsRow>}
        </Fragment>
    );
};