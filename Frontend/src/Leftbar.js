import React, { useState } from 'react';

const Leftbar = ({ onAlign, onPaddingChange, onColorChange, onFontSizeChange, onBackgroundColorChange }) => {
  const [padding, setPadding] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  const handlePaddingChange = (e) => {
    const { name, value } = e.target;
    setPadding({ ...padding, [name]: parseInt(value, 10) });
    onPaddingChange({ ...padding, [name]: parseInt(value, 10) });
  };

  return (
    <div style={{ width: '30%', height: '100vh', background: 'darkblue', padding: '10px', color: 'white' }}>
      <h3>Alignment</h3>
      <button onClick={() => onAlign('left')}>Left</button>
      <button onClick={() => onAlign('center')}>Center</button>
      <button onClick={() => onAlign('right')}>Right</button>
      
      <h3>Padding</h3>
      <label>Left: <input type="number" name="left" value={padding.left} onChange={handlePaddingChange} /></label>
      <label>Right: <input type="number" name="right" value={padding.right} onChange={handlePaddingChange} /></label>
      <label>Top: <input type="number" name="top" value={padding.top} onChange={handlePaddingChange} /></label>
      <label>Bottom: <input type="number" name="bottom" value={padding.bottom} onChange={handlePaddingChange} /></label>

      <h3>Font Color</h3>
      <input type="color" onChange={(e) => onColorChange(e.target.value)} />

      <h3>Font Size</h3>
      <input type="number" onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))} />

      <h3>Background Color</h3>
      <input type="color" onChange={(e) => onBackgroundColorChange(e.target.value)} />
    </div>
  );
};

export default Leftbar;
