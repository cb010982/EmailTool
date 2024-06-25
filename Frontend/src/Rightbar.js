import React from 'react';
import Draggable from './Draggable.tsx';

const Sidebar = () => {
  return (
    <div style={{ width: '30%', height: '100%', background: 'lightgray', padding: '10px' }}>
      <Draggable id="Heading">
        <div>Heading</div>
      </Draggable>
      <Draggable id="Text">
        <div>Text</div>
      </Draggable>
      <Draggable id="Image" isImage>
        <div>Image</div>
      </Draggable>
    </div>
  );
};

export default Sidebar;
