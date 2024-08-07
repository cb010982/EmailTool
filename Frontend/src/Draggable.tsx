import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FaTrash, FaCopy, FaEdit, FaPaintBrush } from 'react-icons/fa';

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  inMiddleBar: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: (id: string, newContent: any) => void;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right';
  padding?: { left: number; right: number; top: number; bottom: number };
  onSelectForStyle?: (id: string) => void;
  textStyle?: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikeThrough: boolean;
    highlight: boolean;
  };
}

const Draggable: React.FC<DraggableProps> = ({
  id,
  children,
  inMiddleBar,
  onDelete,
  onDuplicate,
  onEdit,
  color,
  fontSize,
  backgroundColor,
  alignment,
  padding,
  onSelectForStyle,
  textStyle,
}) => {
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
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
          if (onEdit) {
            onEdit(id, event.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditContent(children);
  }, [children]);

  const textStyles = {
    fontWeight: textStyle?.bold ? 'bold' : 'normal',
    fontStyle: textStyle?.italic ? 'italic' : 'normal',
    textDecoration: [
      textStyle?.underline && 'underline',
      textStyle?.strikeThrough && 'line-through',
      textStyle?.highlight && 'background: yellow;', // example of highlighting, might need adjustment based on implementation
    ]
      .filter(Boolean)
      .join(' '),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: `${padding?.top ?? 0}px ${padding?.right ?? 0}px ${padding?.bottom ?? 0}px ${padding?.left ?? 0}px`,
        border: '1px solid #ccc',
        background: backgroundColor || 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        {...listeners}
        {...attributes}
        style={{
          flexGrow: 1,
          cursor: 'grab',
          color: color,
          fontSize: `${fontSize}px`,
          textAlign: alignment,
          padding: `${padding?.top ?? 0}px ${padding?.right ?? 0}px ${padding?.bottom ?? 0}px ${padding?.left ?? 0}px`,
          ...textStyles,
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={typeof editContent === 'string' ? editContent : ''}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSaveClick}
            onClick={handleTextClick}
            style={{
              color: color,
              fontSize: `${fontSize}px`,
              background: backgroundColor || 'white',
            }}
          />
        ) : (
          children === 'Button' ? (
            <button
              style={{
                backgroundColor: backgroundColor || '#007bff',
                color: color || '#ffffff',
                padding: '10px 20px',
                border: '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: `${fontSize}px`,
                textAlign: alignment,
                transition: 'background-color 0.3s, box-shadow 0.3s',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              }}
              onClick={handleTextClick} // Optional: Add a real onClick event for button functionality
            >
              {editContent}
            </button>
          ) : (
            children === 'Image' && !imageSrc ? (
              <input type="file" onChange={handleImageChange} />
            ) : (
              <span onClick={handleTextClick} style={textStyles}>
                {imageSrc ? <img src={imageSrc} alt="Uploaded" style={{ maxWidth: '100%' }} /> : editContent}
              </span>
            )
          )
        )}
      </div>
      {inMiddleBar && (
        <div>
          <FaPaintBrush
            onClick={(e) => {
              e.stopPropagation();
              onSelectForStyle && onSelectForStyle(id);
            }}
            style={{ cursor: 'pointer', margin: '0 5px' }}
          />
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
