import React from 'react';
import { DndContext } from '@dnd-kit/core';
import Droppable from './Droppable.tsx';
import Sidebar from './Rightbar'; 
import Middlebar from './Middlebar'; 
import Leftbar from './Leftbar.js'; 

function App() {
  return (
    <DndContext>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Middlebar />
        <Leftbar/>
        <Droppable id="droppable">
        </Droppable>
      </div>
    </DndContext>
  );
}

export default App;

