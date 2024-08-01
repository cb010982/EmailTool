import React from 'react';
import { useDroppable } from "@dnd-kit/core";

const Middlebar = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'middlebar',
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        width: '40%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f7f7f7',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};

export default Middlebar;
