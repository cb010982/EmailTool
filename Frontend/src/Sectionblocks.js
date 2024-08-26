import React from 'react';

export const FullWidthSection = ({ content }) => (
  <div style={{ width: '100%', padding: '20px', backgroundColor: '#e0e0e0', margin: '10px 0' }}>
    {content || "Full Width Section"}
  </div>
);

export const TwoColumnSection = ({ leftContent, rightContent }) => (
  <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#d0d0d0' }}>{leftContent || "Left Column"}</div>
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#d0d0d0' }}>{rightContent || "Right Column"}</div>
  </div>
);

export const ThreeColumnSection = ({ leftContent, centerContent, rightContent }) => (
  <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#c0c0c0' }}>{leftContent || "Left Column"}</div>
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#c0c0c0' }}>{centerContent || "Center Column"}</div>
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#c0c0c0' }}>{rightContent || "Right Column"}</div>
  </div>
);
