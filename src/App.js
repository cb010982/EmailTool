import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from './Draggable.tsx';
import Middlebar from './Middlebar'; 
import Sidebar from './Rightbar'; 
import Leftbar from './Leftbar'; 

function App() {
  const [items, setItems] = useState(['heading', 'text']);
  const [droppedItems, setDroppedItems] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => items.filter(item => item !== active.id));
      setDroppedItems((items) => [...items, active.id]);
    }
  }

  function handleDuplicate(id) {
    const newId = `${id}-${Math.random().toString(36).substr(2, 9)}`;
    setDroppedItems((items) => [...items, newId]);
  }

  function handleDelete(id) {
    console.log('Deleting item with id:', id);
    setDroppedItems((currentItems) => currentItems.filter(item => item !== id));
  }

  function handleEdit(id, newContent) {
    setDroppedItems((currentItems) => currentItems.map(item => item === id ? newContent : item));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex' }}>
        <Sidebar>
          {items.map(id => (
            <Draggable key={id} id={id}>
              {id}
            </Draggable>
          ))}
        </Sidebar>
        <Middlebar>
          {droppedItems.map((id) => (
            <Draggable 
              key={id} 
              id={id} 
              inMiddleBar 
              onDelete={() => handleDelete(id)} 
              onDuplicate={() => handleDuplicate(id)}
              onEdit={handleEdit} // Pass the handleEdit function to Draggable
            >
              {id}
            </Draggable>
          ))}
        </Middlebar>
        <Leftbar />
      </div>
    </DndContext>
  );

}

export default App;
