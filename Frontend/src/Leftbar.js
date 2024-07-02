import React from 'react';

const Leftbar = ({ onAlign, onPaddingChange, onColorChange, onFontSizeChange, onBackgroundColorChange }) => {
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', width: '200px' }}>
      <div>
        <label>Align: </label>
        <select onChange={(e) => onAlign(e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label>Padding: </label>
        <input type="number" onChange={(e) => onPaddingChange(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Color: </label>
        <input type="color" onChange={(e) => onColorChange(e.target.value)} />
      </div>
      <div>
        <label>Font Size: </label>
        <input type="number" onChange={(e) => onFontSizeChange(parseInt(e.target.value))} />
      </div>
      <div>
        <label>Background Color: </label>
        <input type="color" onChange={(e) => onBackgroundColorChange(e.target.value)} />
      </div>
    </div>
  );
};

export default Leftbar;
