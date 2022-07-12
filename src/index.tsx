import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';

import TemplateNavbar from './ts/navbar';
import TemplateData from './ts/template-data';
import reportWebVitals from './ts/react-app/reportWebVitals';


const template = ReactDOM.createRoot(
    document.getElementById('template') as HTMLElement
);

template.render(
    <Fragment>
        <TemplateNavbar />
        <TemplateData />
    </Fragment>
);

reportWebVitals();