import { FC, Fragment } from 'react';
import { TdSelect } from '../../components/select';
import ColorPicker from '../../components/color-picker'
import { TdInput } from '../../components/input';

interface SamplerInfoProps {

}
export const SamplerInfo: FC<SamplerInfoProps> = () => {

    return (
        <Fragment>
            <ul className='w-1/3'>
                <li>Sampler No. 1</li>
                <li>0 Tracks</li>
                <li>0 Multis</li>
            </ul>
            <div className='flex items-center mt-1 mb-1 w-1/3' >
                <div
                    title='Set the color for this sampler.'
                    className='w-1/12'>
                    <ColorPicker />
                </div>
                <div className='ml-1 w-11/12'>
                    <TdInput
                        td={false}
                        id={"smpName_"}
                        title='Set the name for this sampler.'
                        placeholder="Instrument/Multi Name"
                        codeDisabled={false}>
                    </TdInput>
                </div>

            </div>
            <div title="Sampler Manufacturer" className='w-1/3 mb-2'>
                <TdSelect id="smpType" options="smpTypeList"></TdSelect>
            </div >

        </Fragment>
    )
}