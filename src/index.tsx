import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';

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
