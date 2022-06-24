import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './scss/index.scss';

import TemplateNavbar from './template-navbar';
import TemplateTrackSettings from './template-track-settings';
import TemplateTracks from './template-tracks';
import reportWebVitals from './reportWebVitals';

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
