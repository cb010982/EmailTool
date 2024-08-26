import React, { useState } from 'react';
import Draggable from './Draggable.tsx';

const Sidebar = () => {
  const [textOpen, setTextOpen] = useState(true);
  const [mediaOpen, setMediaOpen] = useState(true);
  const [miscOpen, setMiscOpen] = useState(true);
  const [sectionsOpen, setSectionsOpen] = useState(true);

  const toggleSection = (section) => {
    if (section === 'text') setTextOpen(!textOpen);
    if (section === 'media') setMediaOpen(!mediaOpen);
    if (section === 'misc') setMiscOpen(!miscOpen);
    if (section === 'sections') setSectionsOpen(!sectionsOpen);
  };

  const sectionStyle = {
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontWeight: 'normal',
    cursor: 'grab',
  };

  return (
    <div
      style={{
        width: '30%',
        height: '100%',
        background: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflowY: 'auto',
      }}
    >
      <div>
        <h3 style={{ cursor: 'pointer' }} onClick={() => toggleSection('text')}>Text Elements</h3>
        {textOpen && (
          <div style={{ marginBottom: '15px' }}>
            <Draggable id="Heading"><div style={sectionStyle}>Heading</div></Draggable>
            <Draggable id="Text"><div style={sectionStyle}>Text</div></Draggable>
            <Draggable id="HTML"><div style={sectionStyle}>HTML</div></Draggable>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ cursor: 'pointer' }} onClick={() => toggleSection('media')}>Media Elements</h3>
        {mediaOpen && (
          <div style={{ marginBottom: '15px' }}>
            <Draggable id="Image"><div style={sectionStyle}>Image</div></Draggable>
            <Draggable id="Video"><div style={sectionStyle}>Video</div></Draggable>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ cursor: 'pointer' }} onClick={() => toggleSection('misc')}>Miscellaneous Elements</h3>
        {miscOpen && (
          <div style={{ marginBottom: '15px' }}>
            <Draggable id="Divider"><div style={sectionStyle}>Divider</div></Draggable>
            <Draggable id="SocialLinks"><div style={sectionStyle}>Social Links</div></Draggable>
            <Draggable id="Button"><div style={sectionStyle}>Button</div></Draggable>
          </div>
        )}
      </div>

      <div>
        <h3 style={{ cursor: 'pointer' }} onClick={() => toggleSection('sections')}>Section Blocks</h3>
        {sectionsOpen && (
            <div style={{ marginBottom: '15px' }}>
              <Draggable id="FullWidthSection">
                <div style={sectionStyle}>Full Width Section</div>
              </Draggable>
              <Draggable id="TwoColumnSection">
                <div style={sectionStyle}>Two Column Section</div>
              </Draggable>
              <Draggable id="ThreeColumnSection">
                <div style={sectionStyle}>Three Column Section</div>
              </Draggable>
            </div>
          )}
      </div>
    </div>
  );
};

export default Sidebar;
