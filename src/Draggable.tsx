import React from 'react';
import { useDraggable } from "@dnd-kit/core";
import { FaTrash, FaCopy, FaEdit } from 'react-icons/fa';

interface IDraggable {
  id: string;
  children: React.ReactNode;
  inMiddleBar?: boolean;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEdit?: () => void;
}

const Draggable: React.FC<IDraggable> = ({ id, children, inMiddleBar, onDelete, onDuplicate, onEdit }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={{ padding: '10px', border: '1px solid #ccc', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>{children}</div>
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
            onClick={(e) => { 
              e.stopPropagation(); 
              onEdit && onEdit(); 
            }} 
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
