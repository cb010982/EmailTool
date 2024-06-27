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
  backgroundColor?: string;
}

const Draggable: React.FC<IDraggable> = ({ id, children, inMiddleBar, onDelete, onDuplicate, onEdit, isImage, color, fontSize, backgroundColor }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(children);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        background: backgroundColor || 'white', 
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
          isImage ? (
            <>
              {imageSrc ? (
                <img src={imageSrc} alt="Dropped" style={{ maxWidth: '100%' }} />
              ) : (
                <div>
                  <p>Select Image</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
              )}
            </>
          ) : (
            <span onClick={handleTextClick}>{children}</span>
          )
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
