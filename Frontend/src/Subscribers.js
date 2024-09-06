import React, { useState } from 'react';
import Sidenav from './sidenav';
import GroupModal from './GroupModal';  
import './layout.css';

function Subscribers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateGroup = (groupName) => {
    console.log(`Creating group: ${groupName}`);
    setGroups([...groups, groupName]);
    console.log(`Updated groups: ${JSON.stringify(groups)}`);
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
          {groups
            .filter(group => group.toLowerCase().includes(searchQuery.toLowerCase()))  // Filter groups based on search query
            .map((group, index) => (
              <div key={index} className="group-item">
                {/* Link to Dash app page with the group name */}
                <a href={`http://localhost:8050/upload/${group}`} className="group-link">
                  {group}
                </a>
              </div>
            ))
          }
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
