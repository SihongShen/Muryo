import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom';
import './App.css';
import Background from './components/background.jsx';
import Homepage from './pages/homepage/homepage.jsx';
import ProductPage from './pages/products/products.jsx';
import EventsPage from './pages/events/events.jsx';
import UserPage from './pages/user/user.jsx';
import LoginPage from './pages/login/login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Layout = () => {
  return (
    <>
      <Link 
        to="/" 
        className="app-logo"
      >
        無料MEMO
      </Link>
      <Background />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            
            <Route index element={<Homepage />} />
            
            <Route path="login" element={<LoginPage />} />

            <Route 
              path="products" 
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="events" 
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="account" 
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              } 
            />
          
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
