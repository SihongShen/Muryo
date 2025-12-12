import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { ReactComponent as FileIcon } from '../icons/file.svg';
import { ReactComponent as UserIcon } from '../icons/user.svg';
import { ReactComponent as CalendarIcon } from '../icons/calendar.svg';

// calculate the color
const isDarkColor = (hex) => {
  if (!hex) return false;
  // remove #
  const c = hex.substring(1);      
  // parse RGB
  const rgb = parseInt(c, 16);   
  const r = (rgb >> 16) & 0xff;  
  const g = (rgb >>  8) & 0xff;  
  const b = (rgb >>  0) & 0xff;  

  // calculate Luma
  // 0.2126 * R + 0.7152 * G + 0.0722 * B
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; 

  return luma < 100; 
};

const Sidebar = ({ activePage = 'file', typeColor = '#000', foreColor = '#fff' }) => {
  const navigate = useNavigate();
  // navigate function to handle navigation
  const handleNav = (path) => {
    navigate(path);
  };

  const menuItems = [
    { id: 'products', path: '/products', icon: <FileIcon />, label: 'Products' },
    { id: 'events', path: '/events', icon: <CalendarIcon />, label: 'Events' },
    { id: 'account', path: '/account', icon: <UserIcon />, label: 'Account' },
  ];

  const isBackgroundDark = isDarkColor(foreColor);

  const finalIconColor = isBackgroundDark ? '#d6d6d6ff' : foreColor;

  return (
    <nav 
      className="sidebar-container" 
      style={{ backgroundColor: foreColor }}
    >
      <div className="sidebar-pill">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.path)}
            className={`sidebar-icon ${activePage === item.id ? 'active' : ''}`}
            style={{ color: finalIconColor }}
            title={item.id}
          >
            {item.icon}
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;