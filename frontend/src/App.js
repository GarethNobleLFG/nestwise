import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppBar from './components/shared/app-bar/AppBar';
import MarketingPage from './pages/marketing-page/MarketingPage';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import NavIndexLayout from './layouts/nav-index-layout/NavIndexLayout';
import PlannerBot from './pages/planner-bot/PlannerBot';
import MyPlans from './pages/my-plans/MyPlans';
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
        <Route path="/plannerbot" element={<ProtectedRoute><NavIndexLayout activeView="planner"><PlannerBot /></NavIndexLayout></ProtectedRoute>} /> {/* PlannerBot route PROTECTED */}
        <Route path="/myplans" element={<ProtectedRoute><NavIndexLayout activeView="myplans"><MyPlans /></NavIndexLayout></ProtectedRoute>} /> {/* MyPlans route PROTECTED */}
        <Route path="/profile" element={<Profile />} />
        {/* Add more routes here as needed */}
      </Routes>
    </>
  );
}

export default App;