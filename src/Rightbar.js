import React from 'react';
import Draggable from './Draggable.tsx'; 

const sidebar = () => {
  return (
    <div style={{ width: '30%', height: '100%', background: 'lightgray' }}>

      <Draggable id="draggable1">
        <div>Draggable Component 1</div>
      </Draggable>
      <Draggable id="draggable2">
        <div>Draggable Component 2</div>
      </Draggable>
      
    </div>
  );
};

export default sidebar;
