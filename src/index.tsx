import ReactDOM from 'react-dom/client'
import './assets/index.css'

import TemplateData from './pages/template-app'
import App from './pages/App'
import reportWebVitals from './reportWebVitals'

const template = ReactDOM.createRoot(document.getElementById('template') as HTMLElement)

template.render(<App />)

reportWebVitals()
