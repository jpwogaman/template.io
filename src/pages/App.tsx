import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavBar } from '../components/navbar'
import { Footer } from '../components/footer'
import { ErrorPage } from './error-page'
import { ThemeProvider } from '../context/theme-context'
import ScrollToTop from '../components/scroll-to-top'
import { Test5 } from './test5'

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <ThemeProvider>
                <div className='min-h-[100vh] bg-main text-main'>
                    <NavBar />
                    <Routes>
                        <Route path='/test5' element={<Test5 />} />
                        <Route path='*' element={<ErrorPage />} />
                    </Routes>
                    {/* <Footer /> */}
                </div>
            </ThemeProvider>
        </Router>
    )
}
