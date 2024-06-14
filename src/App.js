import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from './Draggable.tsx';
import Middlebar from './Middlebar'; 
import Sidebar from './Rightbar'; 
import Leftbar from './Leftbar'; 

function App() {
  const [items, setItems] = useState(['draggable1', 'draggable2']);
  const [droppedItems, setDroppedItems] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex' }}>
        <Sidebar>
          {items.map(id => (
            <Draggable key={id} id={id} onDuplicate={() => handleDuplicate(id)} onDelete={() => handleDelete(id)}>
              {id}
            </Draggable>
          ))}
        </Sidebar>
        <Middlebar>
          {droppedItems.map(id => (
            <Draggable key={id} id={id} onDuplicate={() => handleDuplicate(id)} onDelete={() => handleDelete(id)}>
              {id}
            </Draggable>
          ))}
        </Middlebar>
        <Leftbar/>
      </div>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => items.filter(item => item !== active.id));
      setDroppedItems((items) => [...items, active.id]);
    }
  }

  function handleDuplicate(id) {
    // Handle duplication logic here
  }

  function handleDelete(id) {
    setItems((items) => items.filter(item => item !== id));
    setDroppedItems((items) => items.filter(item => item !== id));
  }
}

export default App;
