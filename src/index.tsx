import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';

import TemplateNavbar from './ts/navbar';
import TrackList from './ts/track-list';
import TrackSettings from './ts/track-settings';
import reportWebVitals from './ts/react-app/reportWebVitals';

const template = ReactDOM.createRoot(
    document.getElementById('template') as HTMLElement
);

template.render(
    <Fragment>
        <TemplateNavbar />
        <div id="TemplateData" className='h-[calc(100vh-40px)] w-100'>
            <TrackList />
            <TrackSettings />
        </div>
    </Fragment>
);

reportWebVitals();