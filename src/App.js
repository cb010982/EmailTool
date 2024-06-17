import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from './Frontend/Draggable.tsx';
import Middlebar from './Frontend/Middlebar.js'; 
import Sidebar from './Frontend/Rightbar.js'; 
import Leftbar from './Frontend/Leftbar.js'; 

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
      setDroppedItems((items) => [
        ...items, 
        { id: `${active.id}-${Math.random().toString(36).substr(2, 9)}`, content: active.id }
      ]);
    }
  }

  function handleDelete(id) {
    console.log('Deleting item with id:', id);
    setDroppedItems((currentItems) => currentItems.filter(item => item.id !== id));
  }

   function handleDuplicate(id) {
    const newId = `${id}-${Math.random().toString(36).substr(2, 9)}`;
    setDroppedItems((items) => [...items, newId]);
  }

  function handleEdit(id, newContent) {
    setDroppedItems((currentItems) => currentItems.map(item => item.id === id ? { ...item, content: newContent } : item));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex' }}>
        <Sidebar>
          {items.map(id => (
            <Draggable 
              key={id} 
              id={id} 
              inMiddleBar={false} 
              onDelete={() => handleDelete(id)} 
             onDuplicate={() => handleDuplicate(id)}
              onEdit={handleEdit} 
            >
              {id}
            </Draggable>
          ))}
        </Sidebar>
        <Middlebar>
          {droppedItems.map(({ id, content }) => (
            <Draggable 
              key={id} 
              id={id} 
              inMiddleBar={true} 
              onDelete={() => handleDelete(id)} 
               onDuplicate={() => handleDuplicate(id)}
              onEdit={handleEdit} 
            >
              {content}
            </Draggable>
          ))}
        </Middlebar>
        <Leftbar />
      </div>
    </DndContext>
  );
}

export default App;
