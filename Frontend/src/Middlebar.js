import React from 'react';
import { useDroppable } from "@dnd-kit/core";

const Middlebar = ({ children, alignment, padding, color, fontSize, backgroundColor }) => {
  const { setNodeRef } = useDroppable({
    id: 'middlebar',
  });

  const alignmentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: alignment,
    paddingLeft: `${padding.left}px`,
    paddingRight: `${padding.right}px`,
    paddingTop: `${padding.top}px`,
    paddingBottom: `${padding.bottom}px`,
    backgroundColor: backgroundColor,
  };

  return (
    <div ref={setNodeRef} style={{ width: '40%', height: '100vh', ...alignmentStyle }}>
      {children}
    </div>
  );
};

export default Middlebar;
