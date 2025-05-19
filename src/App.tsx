import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import ProductsPage from './pages/products';
import AdminPage from './pages/admin';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default App;
