import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import p5 from 'p5';
import Matter from 'matter-js';
import { initBackground } from './clutter_js/sketch.js'; // 确保路径正确

const Background = () => {
  const containerRef = useRef(null);
  const backgroundInstanceRef = useRef(null);
  
  // 状态提升到 Layout
  const [typeColor, setTypeColor] = useState(null);
  const [foreColor, setForeColor] = useState(null);

  // 1. 监听 window 颜色变化的逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.typeColor && window.typeColor !== typeColor) {
        setTypeColor(window.typeColor);
        setForeColor(window.foreColor);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [typeColor]);

  // 2. 初始化 P5 背景
  useEffect(() => {
    if (!containerRef.current) return;
    try {
      const instance = initBackground({
        parent: containerRef.current,
        P5: p5,
        Matter: Matter
      });
      backgroundInstanceRef.current = instance;
      
      // 初始化获取一次颜色
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

  // 3. 换色功能的逻辑
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
      
      {/* P5 背景层：永远置底 */}
      <div 
        ref={containerRef} 
        id="p5-background" 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1000 }}
      />

      {/* 内容层：通过 Outlet 渲染当前页面 */}
      {/* 我们通过 context 属性把颜色和函数传给子页面 */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        <Outlet context={{ typeColor, foreColor, handleNewPalette }} />
      </div>

    </div>
  );
};

export default Background;