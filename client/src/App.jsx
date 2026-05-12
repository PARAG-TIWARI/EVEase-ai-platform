import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PremiumRoute, AdminRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIPlanner from './pages/AIPlanner';
import AdminDashboard from './pages/AdminDashboard';
import Subscription from './pages/Subscription';
import Assistant from './pages/Assistant';
import Profile from './pages/Profile';
import LiveNavigation from './pages/LiveNavigation';
import ManualSearch from './pages/ManualSearch';
import ActiveCharging from './pages/ActiveCharging';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscription" element={<Subscription />} />
          
          {/* Basic Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/live-navigation" element={<LiveNavigation />} />
            <Route path="/manual-search" element={<ManualSearch />} />
            <Route path="/active-charging" element={<ActiveCharging />} />
          </Route>

          {/* Premium Features */}
          <Route element={<PremiumRoute />}>
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/assistant" element={<Assistant />} />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
