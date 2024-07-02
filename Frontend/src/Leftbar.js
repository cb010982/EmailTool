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
    highlight: false,
    // Add more styles as needed
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
        <label>Padding Left: </label>
        <input type="number" onChange={(e) => handlePaddingChange('left', parseInt(e.target.value))} />
      </div>
      <div>
        <label>Padding Right: </label>
        <input type="number" onChange={(e) => handlePaddingChange('right', parseInt(e.target.value))} />
      </div>
      <div>
        <label>Padding Top: </label>
        <input type="number" onChange={(e) => handlePaddingChange('top', parseInt(e.target.value))} />
      </div>
      <div>
        <label>Padding Bottom: </label>
        <input type="number" onChange={(e) => handlePaddingChange('bottom', parseInt(e.target.value))} />
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
      <div>
        <label>Text Style: </label>
        <div>
          <input
            type="checkbox"
            id="bold"
            checked={textStyle.bold}
            onChange={() => handleTextStyleChange('bold')}
          />
          <label htmlFor="bold">Bold</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="italic"
            checked={textStyle.italic}
            onChange={() => handleTextStyleChange('italic')}
          />
          <label htmlFor="italic">Italic</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="underline"
            checked={textStyle.underline}
            onChange={() => handleTextStyleChange('underline')}
          />
          <label htmlFor="underline">Underline</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="strikeThrough"
            checked={textStyle.strikeThrough}
            onChange={() => handleTextStyleChange('strikeThrough')}
          />
          <label htmlFor="strikeThrough">Strike Through</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="highlight"
            checked={textStyle.highlight}
            onChange={() => handleTextStyleChange('highlight')}
          />
          <label htmlFor="highlight">Highlight</label>
        </div>
        {/* Add more text styles here */}
      </div>
    </div>
  );
};

export default Leftbar;
