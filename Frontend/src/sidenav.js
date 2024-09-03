// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './layout.css';

function Sidenav() {
  return (
    <div className="sidenav">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/campaigns">Campaigns</Link>
        </li>
        <li>
          <Link to="/subscribers">Subscribers</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidenav;
