import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from "@dnd-kit/core";
import { FaTrash, FaCopy, FaEdit } from 'react-icons/fa';

interface IDraggable {
  id: string;
  children: React.ReactNode;
  inMiddleBar?: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEdit?: (id: string, newContent: string) => void;
  isImage?: boolean;
  color?: string;
  fontSize?: number;
}

const Draggable: React.FC<IDraggable> = ({ id, children, inMiddleBar, onDelete, onDuplicate, onEdit, isImage, color, fontSize }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(children);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSaveClick = () => {
    if (onEdit && typeof editContent === 'string') {
      onEdit(id, editContent);
    }
    setIsEditing(false);
  };

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      ref={setNodeRef} 
      style={{ 
        padding: '10px', 
        border: '1px solid #ccc', 
        background: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        color: color,
        fontSize: `${fontSize}px`
      }}
    >
      <div {...listeners} {...attributes} style={{ flexGrow: 1, cursor: 'grab' }}>
        {isEditing ? (
          <input 
            ref={inputRef}
            type="text"
            value={typeof editContent === 'string' ? editContent : ''}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSaveClick}
            onClick={handleTextClick} 
          />
        ) : (
          isImage ? <img src={children as string} alt="Dropped Image" style={{ maxWidth: '100%' }} /> : <span onClick={handleTextClick}>{children}</span>
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
            onClick={handleEditClick} 
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
