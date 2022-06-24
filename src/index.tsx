import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './scss/index.scss';

import TemplateNavbar from './ts/template-navbar';
import TemplateTracks from './ts/template-tracks';
import TemplateTrackSettings from './ts/template-track-settings';
import reportWebVitals from './ts/react-app/reportWebVitals';

const template = ReactDOM.createRoot(
    document.getElementById('template') as HTMLElement
);

template.render(
    <Fragment>
        <TemplateNavbar />
        <TemplateTracks />
        <TemplateTrackSettings />
    </Fragment>
);

reportWebVitals();
