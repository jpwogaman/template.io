import { FC, useState, Fragment, ReactNode, Dispatch, SetStateAction } from "react";
import { IconBtnToggle } from "../../components/icon-btn-toggle";
import { TdInput } from "../../components/td-input";
import { TdSelect } from "../../components/td-select";
import { TrackListProps } from '../../pages/template-app';

interface RangeRowProps {
    id: string;
    selectedTrack: TrackListProps;
    TrackList: TrackListProps[];
    setSelectedTrack?: Dispatch<SetStateAction<TrackListProps>>;
    setTracks: Dispatch<SetStateAction<TrackListProps[]>>;
    children?: ReactNode;
}

export const RangeRows: FC<RangeRowProps> = ({ id, setSelectedTrack, selectedTrack, setTracks, TrackList }) => {

    const artIndex: number = parseInt(id) - 1 // first id would be "01"... need to figure out "indexOf" here

    const [RangeList, setRanges] = useState<TrackListProps["artList"][0]["range"]>(selectedTrack.artList[artIndex].range)

    const addRange = (artId: string, rangeId: string | null | undefined) => {

        let newRangeIdNumb: number = parseInt(rangeId as string) + 1

        let newRangeIdStr: string = newRangeIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })

        const newRange = {
            id: newRangeIdStr,
            name: undefined,
            low: undefined,
            high: undefined,
            whiteKeysOnly: false
        }

        setRanges([...RangeList, newRange])

        // const updatedArt = {
        //     id: selectedTrack.artList[artIndex].id,
        //     name: selectedTrack.artList[artIndex].name,
        //     toggle: selectedTrack.artList[artIndex].toggle,
        //     codeType: selectedTrack.artList[artIndex].codeType,
        //     code: selectedTrack.artList[artIndex].code,
        //     on: selectedTrack.artList[artIndex].on,
        //     off: selectedTrack.artList[artIndex].off,
        //     range: [...RangeList, newRange],
        //     default: selectedTrack.artList[artIndex].default,
        //     delay: selectedTrack.artList[artIndex].delay,
        //     changeType: selectedTrack.artList[artIndex].changeType
        // }

        // setRanges(updatedArt.range)



        // const selectedTrackArtIndex = selectedTrack.artList.indexOf(selectedTrack.artList[artIndex])
        // const trackListArtFilter = selectedTrack.artList.splice(selectedTrackArtIndex, 1, updatedArt)

        // const updatedTrack = {
        //     id: selectedTrack.id,
        //     locked: selectedTrack.locked,
        //     name: selectedTrack.name,
        //     channel: selectedTrack.channel,
        //     fullRange: selectedTrack.fullRange,
        //     baseDelay: selectedTrack.baseDelay,
        //     avgDelay: selectedTrack.avgDelay,
        //     artList: trackListArtFilter,
        //     fadList: selectedTrack.fadList
        // }

        // const selectedTrackIndex = TrackList?.indexOf(selectedTrack)
        // const trackListFilter = TrackList?.splice(selectedTrackIndex, 1, updatedTrack)

        // setTracks(trackListFilter)
        // setSelectedTrack!(updatedTrack)

    }

    const removeRange = (artId: string, rangeId: string | null | undefined) => {

        if (RangeList?.length !== 1) {
            setRanges(RangeList!.filter((range) => range.id !== rangeId));
        }
    }

    const rangeTr =
        `bg-zinc-300 
        dark:bg-stone-800 
        hover:bg-zinc-500 
        dark:hover:bg-zinc-400 
        hover:text-zinc-50 
        dark:hover:text-zinc-50`

    const rangeTd =
        `border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

    const rangeTdEmpty =
        `bg-zinc-400 
        dark:bg-zinc-600
        border-2 
        border-zinc-400 
        dark:border-zinc-600
        p-0.5`

    return (
        <Fragment>
            {RangeList?.map((range) => (
                <tr key={`ArtRange_${id}_${range.id}`} id={`ArtRange_${id}_${range.id}`} className={`${rangeTr}`}>
                    <td colSpan={2} className={`${rangeTdEmpty}`}></td>
                    <td className={`${rangeTd}`}>
                        <TdInput
                            td={true}
                            id={`ArtRangeName_${id}_${range.id}`}
                            title="Describe this range-group. (i.e hits/rolls)"
                            placeholder="Range Description"
                            codeDisabled={false}>
                        </TdInput>
                    </td>
                    <td className={`${rangeTd}`}>
                        <TdSelect id={`ArtRngBot_${id}_${range.id}`} options="allNoteList"></TdSelect>
                    </td>
                    <td className={`${rangeTd} text-center`}>
                        <i className='fas fa-arrow-right-long' />
                    </td>
                    <td className={`${rangeTd}`}>
                        <TdSelect id={`ArtRngTop_${id}_${range.id}`} options="allNoteList"></TdSelect>
                    </td>
                    <td className={`${rangeTd} text-center`}>
                        <IconBtnToggle
                            classes="w-6 h-6 hover:scale-[1.15] hover:animate-pulse"
                            titleA="Add another set of playable ranges."
                            titleB="Remove this set of playable ranges."
                            id={`ArtRangeAddButton_${id}_${range.id}`}
                            a="fa-solid fa-plus"
                            b="fa-solid fa-minus"
                            defaultIcon="a"
                            onToggleA={() => addRange(id, range.id)}
                            onToggleB={() => removeRange(id, range.id)}>
                        </IconBtnToggle>
                    </td>
                    <td className={`${rangeTd} text-center border-r-transparent`}>
                        <input
                            type="checkbox"
                            className='min-w-full cursor-pointer'
                            checked={range.whiteKeysOnly as boolean}
                            title="This playable range is white keys only. "
                            aria-label="This playable range is white keys only."
                            id={`FullRangeWhiteKeysCheck_trk_${parseInt(selectedTrack.id)}_${range.id}`}>
                        </input>

                    </td>
                    <td className={`${rangeTd} text-xs text-left`}>
                        <p>white-keys-only</p>
                    </td>
                    <td className={`${rangeTdEmpty}`}></td>
                </tr>
            ))}
        </Fragment >
    )
}
