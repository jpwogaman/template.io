import { TrackListTable } from './track-list';
import { TrackSettings } from './track-settings';
import { TemplateNavbar } from './template-navbar';
import { TrackListProvider } from '../data/track-list/track-context'

export default function TemplateData() {

    return (
        <TrackListProvider>
            <TemplateNavbar />
            <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
                <TrackListTable />
                <TrackSettings />
            </div>
        </TrackListProvider>
    )
}
