import React from 'react';
import { useDroppable } from "@dnd-kit/core";

const Middlebar = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'middlebar',
  });


  return (
    <div ref={setNodeRef} style={{ width: '40%', height: '100vh', background: 'lightblue' }}>
      {children}
    </div>
    
  );
};

export default Middlebar;
