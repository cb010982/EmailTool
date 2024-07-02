import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from './Draggable.tsx';
import Middlebar from './Middlebar';
import Sidebar from './Rightbar'; 
import Leftbar from './Leftbar'; 

function App() {
  const [items, setItems] = useState(['Heading', 'Text', 'Image']);
  const [droppedItems, setDroppedItems] = useState(() => {
    const savedDroppedItems = localStorage.getItem('droppedItems');
    return savedDroppedItems ? JSON.parse(savedDroppedItems) : [];
  });
  const [selectedItemId, setSelectedItemId] = useState(null);

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
        { id: `${active.id}-${Math.random().toString(36).substr(2, 9)}`, content: active.id, isImage: active.id === 'Image', color: '#000000', fontSize: 16, backgroundColor: '#ffffff' }
      ]);
    }
  }

  function handleDelete(id) {
    const updatedItems = droppedItems.filter(item => item.id !== id);
    setDroppedItems(updatedItems);
    localStorage.setItem('droppedItems', JSON.stringify(updatedItems));
    if (selectedItemId === id) setSelectedItemId(null);
  }

  function handleEdit(id, newContent) {
    const updatedItems = droppedItems.map(item => item.id === id ? { ...item, content: newContent } : item);
    setDroppedItems(updatedItems);
    localStorage.setItem('droppedItems', JSON.stringify(updatedItems));
  }

  function handleDuplicate(id) {
    const itemToDuplicate = droppedItems.find(item => item.id === id);
    if (itemToDuplicate) {
      const updatedItems = [
        ...droppedItems,
        { id: `${itemToDuplicate.id}-${Math.random().toString(36).substr(2, 9)}`, content: itemToDuplicate.content, isImage: itemToDuplicate.isImage, color: itemToDuplicate.color, fontSize: itemToDuplicate.fontSize, backgroundColor: itemToDuplicate.backgroundColor }
      ];
      setDroppedItems(updatedItems);
      localStorage.setItem('droppedItems', JSON.stringify(updatedItems));
    }
  }

  function handleItemStyleChange(id, styleChanges) {
    const updatedItems = droppedItems.map(item => item.id === id ? { ...item, ...styleChanges } : item);
    setDroppedItems(updatedItems);
    localStorage.setItem('droppedItems', JSON.stringify(updatedItems));
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
          {droppedItems.map(({ id, content, isImage, color, fontSize, backgroundColor }) => (
            <Draggable 
              key={id} 
              id={id} 
              inMiddleBar={true} 
              onDelete={() => handleDelete(id)} 
              onEdit={handleEdit}
              onDuplicate={() => handleDuplicate(id)} 
              isImage={isImage}
              color={color}
              fontSize={fontSize}
              backgroundColor={backgroundColor}
              onSelectForStyle={() => setSelectedItemId(id)}
            >
              {content}
            </Draggable>
          ))}
        </Middlebar>
        {selectedItemId && (
          <Leftbar 
            onAlign={(align) => handleItemStyleChange(selectedItemId, { textAlign: align })}
            onPaddingChange={(newPadding) => handleItemStyleChange(selectedItemId, { padding: newPadding })}
            onColorChange={(newColor) => handleItemStyleChange(selectedItemId, { color: newColor })}
            onFontSizeChange={(newFontSize) => handleItemStyleChange(selectedItemId, { fontSize: newFontSize })}
            onBackgroundColorChange={(newBackgroundColor) => handleItemStyleChange(selectedItemId, { backgroundColor: newBackgroundColor })}
          />
        )}
      </div>
    </DndContext>
  );
}

export default App;
