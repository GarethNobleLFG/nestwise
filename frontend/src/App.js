import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppBar from './app-bar/AppBar'; // make sure this matches your filename
import MarketingPage from './marketing-page/MarketingPage';
import SignIn from './sign-in/SignIn';
import SignUp from './sign-up/SignUp';
import PlannerBot from './planner-bot/PlannerBot'; // PlannerBot page
import MyPlans from './my-plans/MyPlans'; // <-- import MyPlans page

function App() {
  return (
    <>
      <AppBar /> {/* Navigation bar */}
      <Routes>
        {/* Default route now goes to MarketingPage */}
        <Route path="/" element={<MarketingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/plannerbot" element={<PlannerBot />} /> {/* PlannerBot route */}
        <Route path="/myplans" element={<MyPlans />} /> {/* <-- MyPlans route */}
        {/* Add more routes here as needed */}
      </Routes>
    </>
  );
}

export default App;
