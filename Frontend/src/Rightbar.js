import React from 'react';
import Draggable from './Draggable.tsx';

const Sidebar = () => {
  return (
    <div
      style={{
        width: '30%',
        height: '100%',
        background: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
      }}
    >
      <Draggable id="Heading">
        <div
          style={{
            padding: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontWeight: 'normal',
            cursor: 'grab',
          }}
        >
          Heading
        </div>
      </Draggable>
      <Draggable id="Text">
        <div
          style={{
            padding: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontWeight: 'normal',
            cursor: 'grab',
          }}
        >
          Text
        </div>
      </Draggable>
      <Draggable id="Image">
        <div
          style={{
            padding: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontWeight: 'normal',
            cursor: 'grab',
          }}
        >
          Image
        </div>
      </Draggable>
      <Draggable id="Button">
        <div
          style={{
            padding: '10px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontWeight: 'normal',
            cursor: 'grab',
          }}
        >
          Button
        </div>
      </Draggable>
    </div>
  );
};

export default Sidebar;
