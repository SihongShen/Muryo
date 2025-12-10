import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar/sidebar';
import './user.css';

const UserIcon = () => (<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const LogoutIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const StarIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>);

function UserPage() {
    const { typeColor, foreColor } = useOutletContext();
    const navigate = useNavigate();

    const fColor = String(foreColor).toLowerCase();
    const tColor = String(typeColor).toLowerCase();
    const colorMap = { '#f2eadf': '#0a3a40', '#122459': '#122459', '#bfbdb8': '#000000' };
    const displayTypeColor = (tColor === '#ffffff' && colorMap[fColor]) ? colorMap[fColor] : typeColor;

    const [stats, setStats] = useState({
        totalCount: 0,    
        totalTypes: 0,     
        topCharacter: 'None' 
    });
    const username = localStorage.getItem('username') || 'Admin';

    // get data and calculate statistics
    useEffect(() => {
        const calculateStats = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/products');
                // const res = await fetch('/api/products');
                const data = await res.json();

                // 1. Sum of events
                // currently static for display
                const totalEvents = 3;

                // 2. Calculate Top Character
                const charMap = {};
                data.forEach(item => {
                    if (item.character) {
                        charMap[item.character] = (charMap[item.character] || 0) + 1;
                    }
                });
                
                // find the most frequent key
                let maxChar = 'None';
                let maxCount = 0;
                for (const char in charMap) {
                    if (charMap[char] > maxCount) {
                        maxCount = charMap[char];
                        maxChar = char;
                    }
                }

                setStats({
                    quantityEvents: totalEvents,
                    totalTypes: data.length,
                    topCharacter: maxChar
                });

            } catch (err) {
                console.error("Failed to load stats");
                setStats({ quantityEvents: 0, totalTypes: 0, topCharacter: '-' });
            }
        };
        calculateStats();
    }, []);

    // logout 
    const handleLogout = () => {
        if(window.confirm("Ready to leave?")) {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('username');
            navigate('/login');
        }
    };

    return (
        <div className="product-page-wrapper">
            <Sidebar activePage="account" typeColor={displayTypeColor} foreColor={foreColor} />

            <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                
                <div className="profile-card" style={{ borderColor: displayTypeColor, color: displayTypeColor }}>
                    <div className="avatar-circle" style={{ background: displayTypeColor, color: foreColor }}>
                        {username.charAt(0).toUpperCase()}
                    </div>
                    
                    <h2 className="username">{username}</h2>
                    <p className="user-tag" style={{ borderColor: displayTypeColor, opacity: 0.7 }}>
                        Level 99 Collector
                    </p>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">{stats.totalTypes}</span>
                            <span className="stat-label">Items</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.quantityEvents}</span>
                            <span className="stat-label">Events</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value" style={{fontSize: '1.2rem', marginTop:'5px'}}>
                                {stats.topCharacter}
                            </span>
                            <span className="stat-label">Top Pick</span>
                        </div>
                    </div>
                </div>

                <div className="settings-list">
                    <div className="setting-item" style={{ borderColor: displayTypeColor, color: displayTypeColor }}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <StarIcon /> <span>My Wishlist</span>
                        </div>
                        <span>→</span>
                    </div>
                    
                    <div className="setting-item" onClick={handleLogout} style={{ borderColor: displayTypeColor, color: displayTypeColor, cursor: 'pointer' }}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <LogoutIcon /> <span>Log Out</span>
                        </div>
                        <span>→</span>
                    </div>
                </div>

                <p style={{ marginTop: '30px', fontSize: '0.8rem', opacity: 0.5, color: displayTypeColor }}>
                    Muryo v1.0.0
                </p>

            </div>
        </div>
    );
}

export default UserPage;