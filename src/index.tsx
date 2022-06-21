import React, { Fragment, Component } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { Container } from 'react-bootstrap';
import './main.scss';

import TemplateNavbar from './template-navbar';
import TemplateTrackSettings from './template-track-settings';
import TemplateTracks from './template-tracks';
import TemplateMainSettings from './template-main-settings';
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
