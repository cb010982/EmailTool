// src/pages/Campaigns.js
import React, { useState } from 'react';
import Sidenav from './sidenav';
import GroupModal from './GroupModal';  
import './layout.css';

function Campaigns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Implement the logic to filter campaigns based on the search query
  };

  const handleCreateCampaign = (campaignName) => {
    setCampaigns([...campaigns, campaignName]);
    // Additional logic to handle the created campaign can go here
  };

  return (
    <div className="campaigns-container">
      <Sidenav />
      <div className="campaigns-content">
        <h1>Campaigns</h1>
        <div className="campaigns-actions">
          <button onClick={() => setIsModalOpen(true)} className="create-campaign-button">
            Create Campaign
          </button>
          <div className="search-section">
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              value={searchQuery} 
              onChange={handleSearchChange} 
              className="search-bar"
            />
            <button className="search-button">Search</button>
          </div>
        </div>

        {/* List of created campaigns */}
        <div className="campaign-list">
          {campaigns.map((campaign, index) => (
            <div key={index} className="campaign-item">
              {campaign}
            </div>
          ))}
        </div>


        {/* Modal for creating a campaign */}
        <GroupModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onCreateGroup={handleCreateCampaign} 
        />
      </div>
    </div>
  );
}

export default Campaigns;
