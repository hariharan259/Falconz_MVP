import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Telemetry } from './pages/Telemetry';
import { AIChat } from './pages/AIChat';
import { Vision } from './pages/Vision';
import { Engineering } from './pages/Engineering';
import { MissionPlanner } from './pages/MissionPlanner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Wrapped in MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/telemetry" element={<Telemetry />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/engineering" element={<Engineering />} />
          <Route path="/planner" element={<MissionPlanner />} />
          {/* Stubs for future pages */}
          <Route path="/alerts" element={<div className="p-8">Alerts (Under Construction)</div>} />
          <Route path="/reports" element={<div className="p-8">Reports (Under Construction)</div>} />
          <Route path="/profile" element={<div className="p-8">Profile (Under Construction)</div>} />
          <Route path="/settings" element={<div className="p-8">Settings (Under Construction)</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
