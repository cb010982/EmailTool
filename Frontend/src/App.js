import React, { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Rightbar';
import Middlebar from './Middlebar';
import Draggable from './Draggable.tsx';
import Leftbar from './Leftbar';
import axios from 'axios';
import Campaigns from './Campaigns'; 
import Subscribers from './Subscribers'; 

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
          isVideo: active.id === 'Video',
          color: '#000000',
          fontSize: 16,
          backgroundColor: '#ffffff',
          buttonBackgroundColor: '#007bff', // Default button background color
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
          isVideo: itemToDuplicate.isVideo,
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

  function generateHTML() {
    const content = droppedItems.map(item => {
      let contentHTML = '';
      const { content, isImage, isVideo, color, fontSize, backgroundColor, buttonBackgroundColor, alignment, padding = {}, textStyle = {} } = item;
  
      const sanitizedContent = sanitizeContent(content);  // Sanitize the content here
  
      const textColor = color || '#000000';
      const bgColor = backgroundColor || '#ffffff';
      const btnBgColor = buttonBackgroundColor || '#007bff';
      const txtAlignment = alignment || 'left';
      const txtFontSize = fontSize || 16;
      const txtPadding = {
        top: padding.top !== undefined ? padding.top : 0,
        right: padding.right !== undefined ? padding.right : 0,
        bottom: padding.bottom !== undefined ? padding.bottom : 0,
        left: padding.left !== undefined ? padding.left : 0
      };
  
      // Set default text-decoration to 'none'
      const textDecoration = [
        textStyle.underline && 'underline',
        textStyle.strikeThrough && 'line-through',
      ].filter(Boolean).join(' ') || 'none';  // Default to 'none' if no decoration is applied
  
      const style = `
        color: ${textColor};
        font-size: ${txtFontSize}px;
        background-color: ${bgColor};
        text-align: ${txtAlignment};
        padding: ${txtPadding.top}px ${txtPadding.right}px ${txtPadding.bottom}px ${txtPadding.left}px;
        font-weight: ${textStyle.bold ? 'bold' : 'normal'};
        font-style: ${textStyle.italic ? 'italic' : 'normal'};
        text-decoration: ${textDecoration};  
      `;
  
      // Checking if the element is a heading
      if (sanitizedContent.toLowerCase().includes('heading')) {
        // Determine heading level based on content or other properties, e.g., H1, H2, etc.
        if (sanitizedContent === 'Heading 1') {
          contentHTML = `<h1 style="${style}">${sanitizedContent}</h1>`;
        } else if (sanitizedContent === 'Heading 2') {
          contentHTML = `<h2 style="${style}">${sanitizedContent}</h2>`;
        } else {
          contentHTML = `<h3 style="${style}">${sanitizedContent}</h3>`; // Default to H3 for other heading types
        }
      } else if (isImage) {
        contentHTML = `<img src="${sanitizedContent}" alt="Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto; ${style}" />`;
      } else if (isVideo) {
        contentHTML = `<video controls style="max-width: 100%; ${style}"><source src="${sanitizedContent}" type="video/mp4">Your browser does not support the video tag.</video>`;
      } else if (sanitizedContent === 'Button') {
        contentHTML = `<a href="#" style="display: inline-block; padding: 10px 20px; background-color: ${btnBgColor}; color: ${textColor}; text-decoration: none; border-radius: 4px; text-align: center;">${sanitizedContent}</a>`;
      } else if (sanitizedContent === 'Divider') {
        contentHTML = `<hr style="width: 100%; border: 1px solid #ccc; ${style}" />`;
      } else {
        contentHTML = `<p style="${style}">${sanitizedContent}</p>`; // Regular content as paragraph
      }
  
      return contentHTML;
    }).join('');
  
    const htmlDocument = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EDM Template</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 5px;">
          ${content}
        </div>
      </body>
      </html>
    `;
  
    return htmlDocument;
  }
  function sanitizeContent(content) {
    return content
      .replace(/’/g, '&rsquo;')  // Curly right single quote
      .replace(/‘/g, '&lsquo;')  // Curly left single quote
      .replace(/“/g, '&ldquo;')  // Curly left double quote
      .replace(/”/g, '&rdquo;')  // Curly right double quote
      .replace(/'/g, '&#39;')    // Regular apostrophe
      .replace(/"/g, '&quot;');  // Regular double quote
  }
  

  // Save HTML content as a file
  function saveHTML() {
    const htmlContent = generateHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'email_template.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Router>
      <Routes>
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/subscribers" element={<Subscribers />} />
        <Route
          path="/"
          element={
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div style={{ display: 'flex' }}>
                <Sidebar />
                <Middlebar>
                  {droppedItems.map(({ id, content, isImage, isVideo, color, fontSize, backgroundColor, buttonBackgroundColor, alignment, padding, textStyle }) => (
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
              <button onClick={saveHTML} style={{ padding: '10px 20px', margin: '20px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                Save as HTML
              </button>
            </DndContext>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
