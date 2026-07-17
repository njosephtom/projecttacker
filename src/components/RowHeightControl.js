import React from 'react';
import '../styles/RowHeightControl.css';

function RowHeightControl({ rowHeight, onRowHeightChange }) {
  return (
    <div className="row-height-control">
      <label htmlFor="row-height-slider">Row Height:</label>
      <input
        id="row-height-slider"
        type="range"
        min="05"
        max="80"
        value={rowHeight}
        onChange={(e) => onRowHeightChange(parseInt(e.target.value, 10))}
        className="height-slider"
      />
      <span className="height-value">{rowHeight}px</span>
    </div>
  );
}

export default RowHeightControl;
