import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './homepage.css';
import Shuffle from '../../components/shuffle.jsx';

function Homepage() {
  // getting background refs and colors from Outlet context
  const { typeColor, foreColor, handleNewPalette } = useOutletContext();
  // control exit animation
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handlePageTransition = (e, path) =>{
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate(path);
    }, 800);
  }

  return (
    <div className="homepage-container">
      <div className={`floating-circles ${isExiting ? 'exiting' : ''}`}>
        <a 
          href="/products"
          onClick={(e) => handlePageTransition(e, '/products')}
          className="circle products-circle"
          style={{ '--fore-color': foreColor }}
        >
          <span style={{ color: typeColor }}>products</span>
        </a>
        <a
          href="/events"
          onClick={(e) => handlePageTransition(e, '/events')}
          className="circle events-circle"
          style={{ '--fore-color': foreColor }}
        >
          <span style={{ color: typeColor }}>events</span>
        </a>
        <a
          href="/account"
          onClick={(e) => handlePageTransition(e, '/account')}
          className="circle account-circle"
          style={{ '--fore-color': foreColor }}
        >
          <span style={{ color: typeColor }}>account</span>
        </a>
      </div>
      
      <div className="homepage-content">
        <h1 style={{color: typeColor}}>Any Inspiration today?</h1>
      </div>
        <Shuffle onShuffle={handleNewPalette} />
    </div>
  );
}

export default Homepage;
