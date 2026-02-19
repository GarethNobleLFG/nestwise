import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppBar from './components/shared/app-bar/AppBar';
import MarketingPage from './pages/marketing-page/MarketingPage';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './components/shared/protected-route/ProtectedRoute';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <>
      <Routes>
        {/* Default route now goes to MarketingPage */}
        <Route path="/" element={<MarketingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} /> {/* Dashboard route PROTECTED - includes both PlannerBot and MyPlans */}
        <Route path="/profile" element={<Profile />} />
        {/* Add more routes here as needed */}
      </Routes>
    </>
  );
}

export default App;