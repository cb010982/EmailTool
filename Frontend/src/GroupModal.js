// src/components/GroupModal.js
import React from 'react';
import './GroupModal';

function GroupModal({ isOpen, onClose, onCreateGroup }) {
  const [groupName, setGroupName] = React.useState('');

  const handleCreate = () => {
    onCreateGroup(groupName);
    onClose(); // new model is created 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create Group</h2>
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="modal-input"
        />
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel">Cancel</button>
          <button onClick={handleCreate} className="modal-button create">Create</button>
        </div>
      </div>
    </div>
  );
}

export default GroupModal;
