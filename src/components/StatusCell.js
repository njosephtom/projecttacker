import React from 'react';
import '../styles/StatusCell.css';

function StatusCell({ status, options, onChange }) {
  return (
    <select
      className="status-select"
      value={status}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default StatusCell;
