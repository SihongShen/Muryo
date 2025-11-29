import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Background from './components/background.jsx';
import Homepage from './pages/homepage/homepage.jsx';
import ProductPage from './pages/products/products.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* 3. 所有的页面都必须在 Routes 里面 */}
        <Routes>
          {/*以此 Layout 为父级，它里面的 <Outlet> 会渲染下面的子 Route */}
          <Route path="/" element={<Background />}>
            
            {/* 首页 */}
            <Route index element={<Homepage />} />
            
            {/* 产品页 */}
            <Route path="products" element={<ProductPage />} />
            
            {/* 其他页面 */}
            <Route path="events" element={<div>EventsPage</div>} />
            <Route path="account" element={<div>AccountPage</div>} />
          
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
