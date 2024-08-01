import React, { useState } from 'react';

const Leftbar = ({
  onAlign,
  onPaddingChange,
  onColorChange,
  onFontSizeChange,
  onBackgroundColorChange,
  onTextStyleChange,
}) => {
  const [textStyle, setTextStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
  });

  const handlePaddingChange = (position, value) => {
    onPaddingChange({ [position]: value });
  };

  const handleTextStyleChange = (style) => {
    const newTextStyle = { ...textStyle, [style]: !textStyle[style] };
    setTextStyle(newTextStyle);
    onTextStyleChange(newTextStyle);
  };

  return (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ddd',
        width: '30%',
        backgroundColor: '#fafafa',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Align:</label>
        <select
          onChange={(e) => onAlign(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Padding Left:</label>
        <input
          type="number"
          onChange={(e) => handlePaddingChange('left', parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Padding Right:</label>
        <input
          type="number"
          onChange={(e) => handlePaddingChange('right', parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Padding Top:</label>
        <input
          type="number"
          onChange={(e) => handlePaddingChange('top', parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Padding Bottom:</label>
        <input
          type="number"
          onChange={(e) => handlePaddingChange('bottom', parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Color:</label>
        <input
          type="color"
          onChange={(e) => onColorChange(e.target.value)}
          style={{
            width: '100%',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Font Size:</label>
        <input
          type="number"
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Background Color:</label>
        <input
          type="color"
          onChange={(e) => onBackgroundColorChange(e.target.value)}
          style={{
            width: '100%',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Text Style:</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <input
              type="checkbox"
              id="bold"
              checked={textStyle.bold}
              onChange={() => handleTextStyleChange('bold')}
            />
            <label htmlFor="bold" style={{ marginLeft: '5px' }}>Bold</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="italic"
              checked={textStyle.italic}
              onChange={() => handleTextStyleChange('italic')}
            />
            <label htmlFor="italic" style={{ marginLeft: '5px' }}>Italic</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="underline"
              checked={textStyle.underline}
              onChange={() => handleTextStyleChange('underline')}
            />
            <label htmlFor="underline" style={{ marginLeft: '5px' }}>Underline</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="strikeThrough"
              checked={textStyle.strikeThrough}
              onChange={() => handleTextStyleChange('strikeThrough')}
            />
            <label htmlFor="strikeThrough" style={{ marginLeft: '5px' }}>Strikethrough</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leftbar;
