// src/pages/Subscribers.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidenav from './sidenav';
import GroupModal from './GroupModal';  
import './layout.css';

function Subscribers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  // Fetch existing groups from the database when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/get_groups')
      .then(response => {
        setGroups(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the groups!", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Implement the logic to filter groups based on the search query
  };

  const handleCreateGroup = (groupName) => {
    axios.post('http://localhost:5000/create_group', { group_name: groupName })
      .then(response => {
        if (response.data.status === 'success') {
          setGroups([...groups, { id: groups.length + 1, group_name: groupName }]);
        } else {
          alert(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error creating the group!", error);
      });
  };

  return (
    <div className="subscribers-container">
      <Sidenav />
      <div className="subscribers-content">
        <h1>Subscribers</h1>
        <div className="subscribers-actions">
          <button onClick={() => setIsModalOpen(true)} className="create-group-button">
            Create Group
          </button>
          <div className="search-section">
            <input 
              type="text" 
              placeholder="Search groups..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className="search-bar"
            />
            <button className="search-button">Search</button>
          </div>
        </div>

        {/* List of created groups */}
        <div className="group-list">
          {groups.map((group) => (
            <div key={group.id} className="group-item">
              <a href={`http://localhost:8050/upload/${group.group_name}`} className="group-link">
                {group.group_name}
              </a>
            </div>
          ))}
        </div>

        {/* Modal for creating a group */}
        <GroupModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreateGroup={handleCreateGroup} 
        />
      </div>
    </div>
  );
}

export default Subscribers;
