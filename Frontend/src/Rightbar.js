import React, { useState } from 'react';
import Draggable from './Draggable.tsx';

const Sidebar = () => {
  const [buttonStyle, setButtonStyle] = useState({
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Arial, sans-serif',
    padding: '10px 20px',
  });

  const handleStyleChange = (property, value) => {
    setButtonStyle((prevStyle) => ({
      ...prevStyle,
      [property]: value,
    }));
  };

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
            fontWeight: 'bold',
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
            ...buttonStyle,
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          Button
        </div>
      </Draggable>

      {/* Button Styling Controls */}
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', marginBottom: '10px' }}>Button Styling</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Background Color: </label>
          <input
            type="color"
            value={buttonStyle.backgroundColor}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Text Color: </label>
          <input
            type="color"
            value={buttonStyle.color}
            onChange={(e) => handleStyleChange('color', e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Font Size: </label>
          <input
            type="number"
            value={parseInt(buttonStyle.fontSize)}
            onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Font Family: </label>
          <input
            type="text"
            value={buttonStyle.fontFamily}
            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Padding: </label>
          <input
            type="text"
            value={buttonStyle.padding}
            onChange={(e) => handleStyleChange('padding', e.target.value)}
          />
          <small style={{ display: 'block', marginTop: '5px', fontSize: '12px', color: '#777' }}>
            (e.g., "10px 20px" for top/bottom and left/right padding)
          </small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
