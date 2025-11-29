import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { ReactComponent as FileIcon } from '../icons/file.svg';
import { ReactComponent as UserIcon } from '../icons/user.svg';
import { ReactComponent as CalendarIcon } from '../icons/calendar.svg';

const Sidebar = ({ activePage = 'file', typeColor = '#000', foreColor = '#fff' }) => {
  const navigate = useNavigate();
  // navigate function to handle navigation
  const handleNav = (path) => {
    navigate(path);
  };

  const menuItems = [
    { id: 'products', path: '/products', icon: <FileIcon /> },
    { id: 'events', path: '/events', icon: <CalendarIcon /> },
    { id: 'account', path: '/account', icon: <UserIcon /> },
  ];

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
            style={{ color: typeColor }}
            title={item.id}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;