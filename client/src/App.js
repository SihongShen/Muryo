import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Background from './components/background.jsx';
import Homepage from './pages/homepage/homepage.jsx';
import ProductPage from './pages/products/products.jsx';
import EventsPage from './pages/events/events.jsx';
import UserPage from './pages/user/user.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Background />}>
            
            <Route index element={<Homepage />} />
            
            <Route path="products" element={<ProductPage />} />
            
            <Route path="events" element={<EventsPage />} />
            <Route path="account" element={<UserPage />} />
          
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
