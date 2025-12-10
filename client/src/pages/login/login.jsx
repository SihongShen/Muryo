import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './login.css';

function LoginPage() {
    const { typeColor, foreColor } = useOutletContext();
    const navigate = useNavigate();
    
    const fColor = String(foreColor).toLowerCase();
    const tColor = String(typeColor).toLowerCase();
    const colorMap = { '#f2eadf': '#0a3a40', '#122459': '#122459', '#bfbdb8': '#000000' };
    const displayTypeColor = (tColor === '#ffffff' && colorMap[fColor]) ? colorMap[fColor] : typeColor;

    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (credentials.username && credentials.password === '123456') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('username', credentials.username);
            
            navigate('/products');
        } else {
            setError('Incorrect password. (Try: 123456)');
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="glass-background-layer" />

            <div className="login-container">
                <div className="login-card" style={{ borderColor: displayTypeColor, color: displayTypeColor }}>
                    <h1 style={{ marginBottom: '10px', fontSize: '2.5rem' }}>Muryo</h1>
                    <p style={{ opacity: 0.7, marginBottom: '30px', fontStyle: 'italic' }}>
                        Log in to view your archive.
                    </p>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label>Username</label>
                            <input 
                                name="username" 
                                type="text" 
                                placeholder="Enter your name"
                                value={credentials.username} 
                                onChange={handleChange} 
                                style={{ borderColor: displayTypeColor, color: displayTypeColor }}
                                autoFocus
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••"
                                value={credentials.password} 
                                onChange={handleChange} 
                                style={{ borderColor: displayTypeColor, color: displayTypeColor }}
                            />
                        </div>

                        {error && <p className="error-msg">{error}</p>}

                        <button type="submit" className="login-btn" style={{ background: displayTypeColor, color: foreColor }}>
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;