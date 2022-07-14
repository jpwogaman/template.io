import { FC, useState, Fragment, ReactNode } from "react";
import { IconBtnToggle } from "../../components/button-icon-toggle";
import { TdInput } from "../../components/input";
import { TdSelect } from "../../components/select";

interface RangeRowProps {
    id: string;
    children?: ReactNode;
}

export const RangeRows: FC<RangeRowProps> = ({ id }) => {

    const [RangeList, setRanges] = useState<any[]>([
        {
            id: "01"
        },
    ])

    const addRange = (artId: string, rangeId: string) => {

        let newRangeIdNumb: number = parseInt(rangeId) + 1

        let newRangeIdStr: string = newRangeIdNumb.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
        const newRange = { id: newRangeIdStr }
        setRanges([...RangeList, newRange])
    }

    const removeRange = (artId: string, rangeId: string) => {

        if (RangeList.length !== 1) {
            setRanges(RangeList.filter((range) => range.id !== rangeId));
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
            {RangeList.map((range) => (
                <tr key={`ArtRange_${id}_${range.id}`} id={`ArtRange_${id}_${range.id}`} className={`${rangeTr}`}>
                    <td colSpan={2} className={`${rangeTdEmpty}`}></td>
                    <td className={`${rangeTd}`}>
                        <TdInput
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
                    <td className={`${rangeTdEmpty}`}></td>
                </tr>
            ))}
        </Fragment >
    )
}
