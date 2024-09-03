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
  const sendEmail = async () => {
    const htmlContent = generateHTML();
    try {
      const response = await axios.post('http://localhost:5000/send-emails', {
        htmlContent: htmlContent
      });
      if (response.data.status === 'success') {
        alert('Emails sent successfully!');
      } else {
        alert('Failed to send emails.');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('An error occurred while sending emails.');
    }
  };
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
          buttonBackgroundColor: itemToDuplicate.buttonBackgroundColor, // Add this line
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
  
      // Set default values if not provided
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
  
      // Construct style string
      const style = `
        color: ${textColor};
        font-size: ${txtFontSize}px;
        background-color: ${bgColor};
        text-align: ${txtAlignment};
        padding: ${txtPadding.top}px ${txtPadding.right}px ${txtPadding.bottom}px ${txtPadding.left}px;
        font-weight: ${textStyle.bold ? 'bold' : 'normal'};
        font-style: ${textStyle.italic ? 'italic' : 'normal'};
        text-decoration: ${[
          textStyle.underline && 'underline',
          textStyle.strikeThrough && 'line-through',
        ].filter(Boolean).join(' ')};
      `;
  
      // Generate HTML content with appropriate tags
      if (isImage) {
        contentHTML = `<img src="${content}" alt="Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto; ${style}" />`;
      } else if (isVideo) {
        contentHTML = `<video controls style="max-width: 100%; ${style}"><source src="${content}" type="video/mp4">Your browser does not support the video tag.</video>`;
      } else if (content === 'Button') {
        contentHTML = `<a href="#" style="display: inline-block; padding: 10px 20px; background-color: ${btnBgColor}; color: ${textColor}; text-decoration: none; border-radius: 4px; text-align: center;">${content}</a>`;
      } else if (content === 'Divider') {
        contentHTML = `<hr style="width: 100%; border: 1px solid #ccc; ${style}" />`;
      } else if (content.toLowerCase().includes('heading')) {
        contentHTML = `<h1 style="${style}">${content}</h1>`;
      } else {
        contentHTML = `<p style="${style}">${content}</p>`;
      }
  
      return contentHTML;
    }).join('');
  
    // Wrap the content in a complete HTML structure
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
  
  

  function generateHTML() {
    const content = droppedItems.map(item => {
      let contentHTML = '';
      const { content, isImage, isVideo, color, fontSize, backgroundColor, buttonBackgroundColor, alignment, padding = {}, textStyle = {} } = item;
  
      // Set default values if not provided
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
  
      // Encode content to prevent encoding issues
      const encodedContent = content.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  
      // Construct style string
      const style = `
        color: ${textColor};
        font-size: ${txtFontSize}px;
        background-color: ${bgColor};
        text-align: ${txtAlignment};
        padding: ${txtPadding.top}px ${txtPadding.right}px ${txtPadding.bottom}px ${txtPadding.left}px;
        font-weight: ${textStyle.bold ? 'bold' : 'normal'};
        font-style: ${textStyle.italic ? 'italic' : 'normal'};
        text-decoration: ${[
          textStyle.underline && 'underline',
          textStyle.strikeThrough && 'line-through',
        ].filter(Boolean).join(' ')};
      `;
  
      // Generate HTML content with appropriate tags
      if (isImage) {
        contentHTML = `<img src="${encodedContent}" alt="Image" style="max-width: 100%; height: auto; display: block; margin: 0 auto; ${style}" />`;
      } else if (isVideo) {
        contentHTML = `<video controls style="max-width: 100%; ${style}"><source src="${encodedContent}" type="video/mp4">Your browser does not support the video tag.</video>`;
      } else if (encodedContent === 'Button') {
        contentHTML = `<a href="#" style="display: inline-block; padding: 10px 20px; background-color: ${btnBgColor}; color: ${textColor}; text-decoration: none; border-radius: 4px; text-align: center;">${encodedContent}</a>`;
      } else if (encodedContent === 'Divider') {
        contentHTML = `<hr style="width: 100%; border: 1px solid #ccc; ${style}" />`;
      } else if (encodedContent.toLowerCase().includes('heading')) {
        contentHTML = `<h1 style="${style}">${encodedContent}</h1>`;
      } else {
        contentHTML = `<p style="${style}">${encodedContent}</p>`;
      }
  
      return contentHTML;
    }).join('');
  
    // Wrap the content in a complete HTML structure
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
}

export default App;
