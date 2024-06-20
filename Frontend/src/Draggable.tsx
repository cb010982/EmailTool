import React, { useState, useRef } from 'react';
import { useDraggable } from "@dnd-kit/core";
import { FaTrash, FaCopy, FaEdit } from 'react-icons/fa';

interface IDraggable {
  id: string;
  children: React.ReactNode;
  inMiddleBar?: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEdit?: (id: string, newContent: string) => void;
}

const Draggable: React.FC<IDraggable> = ({ id, children, inMiddleBar, onDelete, onDuplicate, onEdit }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(children);
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input field

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation of the click event
    setIsEditing(true);
    // Focus the input field when the edit button is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSaveClick = () => {
    if (onEdit) {
      if (typeof editContent === 'string') {
        onEdit(id, editContent);
      }
    }
    setIsEditing(false);
  };

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation of the click event
  };

  return (
    <div ref={setNodeRef} style={{ padding: '10px', border: '1px solid #ccc', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div {...listeners} {...attributes} style={{ flexGrow: 1, cursor: 'grab' }}>
        {isEditing ? (
          <input 
            ref={inputRef} // Assign the ref to the input field
            type="text" 
            value={typeof editContent === 'string' ? editContent : ''} // Ensure editContent is string type
            onChange={(e) => setEditContent(e.target.value)} 
            onBlur={handleSaveClick}
          />
        ) : (
          <span onClick={handleTextClick}>{children}</span> // Add onClick handler for text
        )}
      </div>
      {inMiddleBar && (
        <div>
          <FaCopy 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDuplicate && onDuplicate(); 
            }} 
            style={{ cursor: 'pointer', margin: '0 5px' }} 
          />
          <FaEdit 
            onClick={handleEditClick} // Pass handleEditClick directly
            style={{ cursor: 'pointer', margin: '0 5px' }} 
          />
          <FaTrash 
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete && onDelete(); 
            }} 
            style={{ cursor: 'pointer', margin: '0 5px' }} 
          />
        </div>
      )}
    </div>
  );
};

export default Draggable;
