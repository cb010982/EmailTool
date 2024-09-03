// src/components/Layout.js
import React from 'react';
import Sidebar from './sidenav';
import './Layout.css';

function mainlayout({ children }) {
  return (
    <div className="mainlayout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default mainlayout;
