import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, DarkModeProvider, LanguageProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Todo from './pages/Todo';
import Schedule from './pages/Schedule';
import Nutrition from './pages/Nutrition';
import Habits from './pages/Habits';
import Health from './pages/Health';
import StudyPlanner from './pages/StudyPlanner';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';

export default function App() {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <AppProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </AppProvider>
      </LanguageProvider>
    </DarkModeProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/health" element={<Health />} />
          <Route path="/study" element={<StudyPlanner />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
