import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import p5 from 'p5';
import Matter from 'matter-js';
import { initBackground } from './clutter_js/sketch.js';

const Background = () => {
  const containerRef = useRef(null);
  const backgroundInstanceRef = useRef(null);
  
  const [typeColor, setTypeColor] = useState(null);
  const [foreColor, setForeColor] = useState(null);

  // 1. monitor color change
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.typeColor && window.typeColor !== typeColor) {
        setTypeColor(window.typeColor);
        setForeColor(window.foreColor);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [typeColor]);

  // 2. initiate P5 sketch
  useEffect(() => {
    if (!containerRef.current) return;
    try {
      const instance = initBackground({
        parent: containerRef.current,
        P5: p5,
        Matter: Matter
      });
      backgroundInstanceRef.current = instance;
      
      // get the first initialized color
      if(instance.getColors) {
        setTypeColor(instance.getColors().typeColor);
        setForeColor(instance.getColors().foreColor);
      }
    } catch (error) {
      console.error('Failed to initialize background:', error);
    }

    return () => {
      if (backgroundInstanceRef.current) {
        backgroundInstanceRef.current.remove();
        backgroundInstanceRef.current = null;
      }
    };
  }, []);

  // 3. change color logic
  const handleNewPalette = () => {
    if (backgroundInstanceRef.current) {
      backgroundInstanceRef.current.newPalette();
      if(backgroundInstanceRef.current.getColors) {
        setTypeColor(backgroundInstanceRef.current.getColors().typeColor);
        setForeColor(backgroundInstanceRef.current.getColors().foreColor);
      }
    }
  };

  return (
    <div className="layout-container" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      <div 
        ref={containerRef} 
        id="p5-background" 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1000 }}
      />

      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Outlet context={{ typeColor, foreColor, handleNewPalette }} />
      </div>

    </div>
  );
};

export default Background;