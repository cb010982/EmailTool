// Section.tsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Section = ({ contents, onContentAdd }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable-section',
  });

  const sectionStyle = {
    border: isOver ? '2px dashed #000' : '1px solid #ccc',
    minHeight: '200px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div ref={setNodeRef} style={sectionStyle}>
      {contents.map((content, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          {content.type === 'text' ? (
            <p>{content.data}</p>
          ) : (
            <img src={content.data} alt="Dropped Content" style={{ maxWidth: '100%' }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Section;
