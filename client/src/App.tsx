import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Input from './components/Input';
import SideBar from './components/SideBar';
import Layout from './layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Input />} />
          <Route path="" element={<SideBar />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
