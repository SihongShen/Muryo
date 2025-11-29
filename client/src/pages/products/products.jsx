import React from 'react';
import { useOutletContext } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import './products.css';

function ProductPage() {
    const { typeColor, foreColor } = useOutletContext();

    return (
        <div className="page-container" style={{ marginLeft: '100px' }}>
        {/* 侧边栏 */}
        <Sidebar activePage="products" typeColor={typeColor} foreColor={foreColor} />

        {/* 页面主要内容 */}
        <div className="content">
            <h1 style={{ color: typeColor }}>My Freebies / Files</h1>
            <p>这里是你的无料列表内容...</p>
            
            {/* 模拟一些卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '30px' }}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ 
                height: '150px', 
                background: foreColor, 
                border: `2px solid ${typeColor}`,
                borderRadius: '10px'
                }} />
            ))}
            </div>
        </div>
        </div>
    );
}

export default ProductPage;