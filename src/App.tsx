import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdhkarList from './pages/adhkar/AdhkarList';
import AdhkarDetail from './pages/adhkar/AdhkarDetail';
import QuranList from './pages/quran/QuranList';
import SurahDetail from './pages/quran/SurahDetail';
import Reminders from './pages/Reminders';
import Qibla from './pages/Qibla';
import { MobileGuard } from './components/layout/MobileGuard';

function App() {
    return (
        <Router>
            <div className="font-sans antialiased bg-background text-foreground overflow-x-hidden min-h-screen">
                <MobileGuard>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/adhkar" element={<AdhkarList />} />
                        <Route path="/adhkar/:id" element={<AdhkarDetail />} />
                        <Route path="/quran" element={<QuranList />} />
                        <Route path="/quran/:id" element={<SurahDetail />} />
                        <Route path="/reminders" element={<Reminders />} />
                        <Route path="/qibla" element={<Qibla />} />
                        {/* Handle 404/Fallback */}
                        <Route path="*" element={<Home />} />
                    </Routes>
                </MobileGuard>
            </div>
        </Router>
    );
}

export default App;
