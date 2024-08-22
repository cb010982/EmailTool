import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import Sidebar from './Rightbar.js';
import Middlebar from './Middlebar';
import Draggable from './Draggable.tsx';
import Leftbar from './Leftbar';
import axios from 'axios';

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
        {
          id: `${active.id}-${Math.random().toString(36).substr(2, 9)}`,
          content: active.id,
          isImage: active.id === 'Image',
          color: '#000000',
          fontSize: 16,
          backgroundColor: '#ffffff',
          buttonBackgroundColor: '#007bff',
          alignment: 'left',
          padding: { left: 0, right: 0, top: 0, bottom: 0 },
          textStyle: {
            bold: false,
            italic: false,
            underline: false,
            strikeThrough: false,
            highlight: false,
          },
        }
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
        {
          id: `${itemToDuplicate.id}-${Math.random().toString(36).substr(2, 9)}`,
          content: itemToDuplicate.content,
          isImage: itemToDuplicate.isImage,
          color: itemToDuplicate.color,
          fontSize: itemToDuplicate.fontSize,
          backgroundColor: itemToDuplicate.backgroundColor,
          buttonBackgroundColor: itemToDuplicate.buttonBackgroundColor,
          alignment: itemToDuplicate.alignment,
          padding: { ...itemToDuplicate.padding },
          textStyle: { ...itemToDuplicate.textStyle },
        }
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

  function handleTextStyleChange(id, newTextStyle) {
    const updatedItems = droppedItems.map(item => item.id === id ? { ...item, textStyle: newTextStyle } : item);
    setDroppedItems(updatedItems);
    localStorage.setItem('droppedItems', JSON.stringify(updatedItems));
  }

  // Convert droppedItems to HTML
  function generateHTML() {
    return droppedItems.map(item => {
      const style = `
        color: ${item.color};
        font-size: ${item.fontSize}px;
        background-color: ${item.backgroundColor};
        text-align: ${item.alignment};
        padding: ${item.padding.top}px ${item.padding.right}px ${item.padding.bottom}px ${item.padding.left}px;
        ${item.textStyle.bold ? 'font-weight: bold;' : ''}
        ${item.textStyle.italic ? 'font-style: italic;' : ''}
        ${item.textStyle.underline ? 'text-decoration: underline;' : ''}
        ${item.textStyle.strikeThrough ? 'text-decoration: line-through;' : ''}
      `;
      if (item.isImage) {
        return `<div style="${style}"><img src="${item.content}" alt="Image" style="max-width: 100%;"></div>`;
      } else if (item.content === 'Button') {
        return `<div style="${style}"><button style="background-color: ${item.buttonBackgroundColor}; color: ${item.color}; padding: 10px 20px; border: none; border-radius: 5px;">${item.content}</button></div>`;
      } else {
        return `<div style="${style}">${item.content}</div>`;
      }
    }).join('');
  }

  // Send the generated HTML via email
  function sendEmail() {
    const htmlContent = generateHTML();
    
    axios.post('http://localhost:3001/send-email', {
      to: 'senujidimansa@gmail.com', // Replace with the recipient's email
      subject: 'Your EDM Subject', // Replace with the email subject
      html: htmlContent,
    })
    .then(response => {
      console.log('Email sent successfully:', response.data);
      alert('Email sent successfully!');
    })
    .catch(error => {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <Middlebar>
          {droppedItems.map(({ id, content, isImage, color, fontSize, backgroundColor, buttonBackgroundColor, alignment, padding, textStyle }) => (
            <Draggable
              key={id}
              id={id}
              inMiddleBar={true}
              onDelete={() => handleDelete(id)}
              onEdit={handleEdit}
              onDuplicate={() => handleDuplicate(id)}
              color={color}
              fontSize={fontSize}
              backgroundColor={backgroundColor}
              buttonBackgroundColor={buttonBackgroundColor}
              alignment={alignment}
              padding={padding}
              textStyle={textStyle}
              onSelectForStyle={() => setSelectedItemId(id)}
            >
              {content}
            </Draggable>
          ))}
          <button
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              borderRadius: '5px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              alignSelf: 'center',
            }}
            onClick={sendEmail}
          >
            Send as EDM
          </button>
        </Middlebar>
        {selectedItemId && (
          <Leftbar
            onAlign={(align) => handleItemStyleChange(selectedItemId, { alignment: align })}
            onPaddingChange={(newPadding) => handleItemStyleChange(selectedItemId, { padding: { ...newPadding } })}
            onColorChange={(newColor) => handleItemStyleChange(selectedItemId, { color: newColor })}
            onFontSizeChange={(newFontSize) => handleItemStyleChange(selectedItemId, { fontSize: newFontSize })}
            onBackgroundColorChange={(newBackgroundColor) => handleItemStyleChange(selectedItemId, { backgroundColor: newBackgroundColor })}
            onButtonBackgroundColorChange={(newButtonBackgroundColor) => handleItemStyleChange(selectedItemId, { buttonBackgroundColor: newButtonBackgroundColor })}
            onTextStyleChange={(newTextStyle) => handleTextStyleChange(selectedItemId, newTextStyle)}
          />
        )}
      </div>
    </DndContext>
  );
}

export default App;
