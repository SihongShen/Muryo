import React from 'react';

/**
 * Shuffle 组件：创建一个按钮，点击时调用传入的 onShuffle 函数。
 * * @param {string} className - 可选，CSS 类名。
 * @param {object} style - 可选，内联样式对象。
 * @param {React.ReactNode} children - 可选，按钮内部的内容。
 * @param {function} onShuffle - **点击按钮时要执行的函数。**
 */
export default function Shuffle({ className, style, children, onShuffle }){
  
  // 按钮是否可用取决于是否传入了 onShuffle 函数
  const isAvailable = typeof onShuffle === 'function'; 

  const handleClick = () => {
    if (isAvailable) {
      try {
        // 直接调用父组件传入的函数
        onShuffle(); 
      } catch(e){ 
        console.error('Shuffle/reinit failed during execution:', e); 
      }
    } else {
      console.warn('onShuffle callback not provided to Shuffle component.');
    }
  };

  return (
    <button
      onClick={handleClick}
      // 禁用状态取决于 onShuffle 是否存在
      disabled={!isAvailable} 
      className={className}
      // 保持原始的默认样式，但现在依赖于 isAvailable
      style={style || {
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 1000,
        padding: '8px 12px',
        borderRadius: 6,
        border: 'none',
        // 根据是否可用改变样式
        background: isAvailable ? 'rgba(255,255,255,0.95)' : 'rgba(220,220,220,0.8)',
        color: '#000',
        cursor: isAvailable ? 'pointer' : 'default',
        opacity: isAvailable ? 1 : 0.7
      }}
    >
      {/* 按钮内容也根据是否可用进行调整 */}
      {children || (isAvailable ? 'Shuffle Palette' : 'Error: No Handler')}
    </button>
  );
}