import React from 'react';
import '../styles/NotesCell.css';

function NotesCell({ value, onChange }) {
  return (
    <input
      type="text"
      className="notes-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Add notes here"
    />
  );
}

export default NotesCell;
