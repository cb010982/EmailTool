import React, { useState } from 'react';

const Leftbar = ({ onAlign, onPaddingChange, onColorChange, onFontSizeChange, onBackgroundColorChange }) => {
  const [padding, setPadding] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const handlePaddingChange = (side, value) => {
    const newPadding = { ...padding, [side]: value };
    setPadding(newPadding);
    onPaddingChange(newPadding);
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    onColorChange(newColor);
  };

  const handleFontSizeChange = (event) => {
    const newFontSize = parseInt(event.target.value, 10);
    setFontSize(newFontSize);
    onFontSizeChange(newFontSize);
  };

  const handleBackgroundColorChange = (newColor) => {
    setBackgroundColor(newColor);
    onBackgroundColorChange(newColor);
  };

  return (
    <div style={{ width: '30%', height: '100vh', background: 'darkblue', color: 'white', padding: '10px' }}>
      <h3>Alignment</h3>
      <button onClick={() => onAlign('left')}>Left</button>
      <button onClick={() => onAlign('center')}>Center</button>
      <button onClick={() => onAlign('right')}>Right</button>

      <h3>Padding</h3>
      <label>
        Left:
        <input 
          type="number" 
          value={padding.left} 
          onChange={(e) => handlePaddingChange('left', parseInt(e.target.value) || 0)} 
        />
      </label>
      <label>
        Right:
        <input 
          type="number" 
          value={padding.right} 
          onChange={(e) => handlePaddingChange('right', parseInt(e.target.value) || 0)} 
        />
      </label>
      <label>
        Top:
        <input 
          type="number" 
          value={padding.top} 
          onChange={(e) => handlePaddingChange('top', parseInt(e.target.value) || 0)} 
        />
      </label>
      <label>
        Bottom:
        <input 
          type="number" 
          value={padding.bottom} 
          onChange={(e) => handlePaddingChange('bottom', parseInt(e.target.value) || 0)} 
        />
      </label>

      <h3>Font Color</h3>
      <label>
        Color:
        <input 
          type="color" 
          value={color} 
          onChange={handleColorChange} 
        />
      </label>

      <h3>Font Size</h3>
      <label>
        Size:
        <input 
          type="range" 
          min="10" 
          max="50" 
          value={fontSize} 
          onChange={handleFontSizeChange} 
        />
        <span>{fontSize}px</span>
      </label>

      <h3>Background Color</h3>
      <label>
        Color:
        <input 
          type="color" 
          value={backgroundColor} 
          onChange={(e) => handleBackgroundColorChange(e.target.value)} 
        />
      </label>
    </div>
  );
};

export default Leftbar;