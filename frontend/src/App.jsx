import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from "./components/Dashboard";
import ScanReport from "./components/ScanReport";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan/:id" element={<ScanReport />} />
      </Routes>
    </Router>
  );
}

export default App;
