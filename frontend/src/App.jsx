import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Fixer from './pages/Fixer';
import GraphView from './pages/GraphView';
import HealthScores from './pages/HealthScores';
import Security from './pages/Security';
import Sandbox from './pages/Sandbox';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/fixer" element={<Fixer />} />
        <Route path="/graph" element={<GraphView />} />
        <Route path="/health" element={<HealthScores />} />
        <Route path="/security" element={<Security />} />
        <Route path="/sandbox" element={<Sandbox />} />
      </Route>
    </Routes>
  );
};

export default App;
