import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from './Draggable.tsx';
import Middlebar from './Middlebar';
import Sidebar from './Rightbar'; 
import Leftbar from './Leftbar'; 

function App() {
  const [items, setItems] = useState(['heading', 'text']);
  const [droppedItems, setDroppedItems] = useState(() => {
    const savedDroppedItems = localStorage.getItem('droppedItems');
    return savedDroppedItems ? JSON.parse(savedDroppedItems) : [];
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    localStorage.setItem('droppedItems', JSON.stringify(droppedItems));
  }, [droppedItems]);

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

  function handleEdit(id, newContent) {
    setDroppedItems((currentItems) => currentItems.map(item => item.id === id ? { ...item, content: newContent } : item));
  }

  function handleDuplicate(id) {
    // Find the item to duplicate
    const itemToDuplicate = droppedItems.find(item => item.id === id);
    if (itemToDuplicate) {
      // Duplicate the item
      setDroppedItems((currentItems) => [
        ...currentItems,
        { id: `${itemToDuplicate.id}-${Math.random().toString(36).substr(2, 9)}`, content: itemToDuplicate.content }
      ]);
    }
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
                onEdit={handleEdit}
                onDuplicate={() => handleDuplicate(id)} // Pass handleDuplicate function
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
