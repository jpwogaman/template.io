import { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.css';

import TemplateNavbar from './pages/navbar';
import TemplateData from './pages/template-data';
import reportWebVitals from './reportWebVitals';


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