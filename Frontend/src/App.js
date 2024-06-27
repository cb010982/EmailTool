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
  const [alignment, setAlignment] = useState('left');
  const [padding, setPadding] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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
        { id: `${active.id}-${Math.random().toString(36).substr(2, 9)}`, content: active.id, isImage: active.id === 'Image' }
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
    const itemToDuplicate = droppedItems.find(item => item.id === id);
    if (itemToDuplicate) {
      setDroppedItems((currentItems) => [
        ...currentItems,
        { id: `${itemToDuplicate.id}-${Math.random().toString(36).substr(2, 9)}`, content: itemToDuplicate.content, isImage: itemToDuplicate.isImage }
      ]);
    }
  }

  function handleAlign(align) {
    setAlignment(align);
  }

  function handlePaddingChange(newPadding) {
    setPadding(newPadding);
  }

  function handleColorChange(newColor) {
    setColor(newColor);
  }

  function handleFontSizeChange(newFontSize) {
    setFontSize(newFontSize);
  }

  function handleBackgroundColorChange(newBackgroundColor) {
    setBackgroundColor(newBackgroundColor);
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
        <Middlebar alignment={alignment} padding={padding} color={color} fontSize={fontSize} backgroundColor={backgroundColor}>
          {droppedItems.map(({ id, content, isImage }) => (
            <Draggable 
              key={id} 
              id={content} 
              inMiddleBar={true} 
              onDelete={() => handleDelete(id)} 
              onEdit={handleEdit}
              onDuplicate={() => handleDuplicate(id)} 
              isImage={isImage}
              color={color}
              fontSize={fontSize}
              backgroundColor={backgroundColor}
            >
              {content}
            </Draggable>
          ))}
        </Middlebar>
        <Leftbar onAlign={handleAlign} onPaddingChange={handlePaddingChange} onColorChange={handleColorChange} onFontSizeChange={handleFontSizeChange} onBackgroundColorChange={handleBackgroundColorChange} />
      </div>
    </DndContext>
  );
}

export default App;
