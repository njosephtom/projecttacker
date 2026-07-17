import React from 'react';
import '../styles/CollapsibleSection.css';

function CollapsibleSection({ section, isExpanded, onToggle, children }) {
  return (
    <div className="collapsible-section">
      <div className="section-header" onClick={onToggle}>
        <div className="header-left">
          <span className="toggle-arrow">{isExpanded ? '▼' : '▶'}</span>
          <span className="section-icon">{section.icon}</span>
          <h2 className="section-label">{section.label}</h2>
          <span className="item-count">({section.count})</span>
        </div>
      </div>
      {isExpanded && (
        <div className="section-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;
