import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddAssets from "./pages/AddAssets";
import Dashboard from "./components/Dashboard";
import ScanReport from "./components/ScanReport";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-assets" element={<AddAssets />} />
        <Route path="/scan/:id" element={<ScanReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
