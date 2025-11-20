import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import Matter from 'matter-js';
import { initBackground } from '../components/clutter_js/sketch';
import './homepage.css';
import Shuffle from '../components/shuffle.jsx';

function Homepage() {
  const containerRef = useRef(null);
  const backgroundInstanceRef = useRef(null);
  const [typeColor, setTypeColor] = React.useState(null);
  const [foreColor, setForeColor] = React.useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.typeColor && window.typeColor !== typeColor) {
        setTypeColor(window.typeColor);
        setForeColor(window.foreColor);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [typeColor]);

  useEffect(() => {
    // Wait for container to be available
    if (!containerRef.current) return;

    // Initialize the p5 background
    try {
      const instance = initBackground({
        parent: containerRef.current,
        P5: p5,
        Matter: Matter
      });
      backgroundInstanceRef.current = instance;

      if(instance.getColors && typeof instance.getColors === 'function') {
        setTypeColor(instance.getColors().typeColor);
        setForeColor(instance.getColors().foreColor);
      }
    } catch (error) {
      console.error('Failed to initialize background:', error);
    }

    // Cleanup on unmount
    return () => {
      if (backgroundInstanceRef.current) {
        backgroundInstanceRef.current.remove();
        backgroundInstanceRef.current = null;
      }
    };
  }, []);

  const handleNewPalette = () => {
    if (backgroundInstanceRef.current) {
      try {
        backgroundInstanceRef.current.newPalette();

        if(backgroundInstanceRef.current.getColors) {
          setTypeColor(backgroundInstanceRef.current.getColors().typeColor);
          setForeColor(backgroundInstanceRef.current.getColors().foreColor);
        }
      } catch (e) {
        console.error('Failed to call newPalette:', e);
      }
    } else {
      console.warn('newPalette function not found on background instance.');
    }
  };

  return (
    <div className="homepage-container">
      <div 
        ref={containerRef} 
        id="p5-background" 
        className="p5-background"
      />

      <div className="floating-circles">
        <a href="/freebies" className="circle freebies-circle" style={{ '--fore-color': foreColor }}>
          <span style={{ color: typeColor }}>freebies</span>
        </a>
        <a href="/events" className="circle events-circle" style={{ '--fore-color': foreColor }}>
          <span style={{ color: typeColor }}>events</span>
        </a>
        <a href="/account" className="circle account-circle" style={{ '--fore-color': foreColor }}>
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
