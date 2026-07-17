import React from 'react';
import '../styles/DataTable.css';

function ShotsTable({ data, category, onDataChange, rowHeight = 40 }) {
  const statusOptions = ['APPROVED', 'WIP', 'NOT STARTED', 'READY TO START'];

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'WIP':
        return 'status-wip';
      case 'NOT STARTED':
        return 'status-not-started';
      case 'READY TO START':
        return 'status-ready';
      default:
        return '';
    }
  };

  return (
    <table className="data-table" style={{ '--row-height': `${rowHeight}px` }}>
      <thead>
        <tr>
          <th style={{ width: '100px' }}>SHOT</th>
          <th style={{ width: '120px' }}>SCENE</th>
          <th style={{ width: '150px' }}>CHARACTERS</th>
          <th style={{ width: '100px', backgroundColor: '#ff6b6b', color: '#fff' }}>ANIMATION</th>
          <th style={{ width: '100px', backgroundColor: '#ffa94d', color: '#fff' }}>LIGHTING</th>
          <th style={{ width: '100px', backgroundColor: '#4ecdc4', color: '#fff' }}>FX</th>
          <th style={{ width: '120px', backgroundColor: '#95e1d3', color: '#fff' }}>COMPOSITING</th>
          <th style={{ width: '140px', backgroundColor: '#fff9c4', color: '#000' }}>ARTIST</th>
          <th style={{ minWidth: '200px', backgroundColor: '#e0e0e0', color: '#333' }}>NOTES</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.id} style={{ height: `${rowHeight}px` }}>
            <td className="item-name">{item.shot_number}</td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.scene}
                onChange={(e) => onDataChange(category, index, 'scene', e.target.value)}
                placeholder="Scene name"
              />
            </td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.characters}
                onChange={(e) => onDataChange(category, index, 'characters', e.target.value)}
                placeholder="Characters in shot"
              />
            </td>
            <td className={`status-cell ${getStatusClass(item.animation)}`}>
              <select
                className="status-select"
                value={item.animation}
                onChange={(e) => onDataChange(category, index, 'animation', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </td>
            <td className={`status-cell ${getStatusClass(item.lighting)}`}>
              <select
                className="status-select"
                value={item.lighting}
                onChange={(e) => onDataChange(category, index, 'lighting', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </td>
            <td className={`status-cell ${getStatusClass(item.fx)}`}>
              <select
                className="status-select"
                value={item.fx}
                onChange={(e) => onDataChange(category, index, 'fx', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </td>
            <td className={`status-cell ${getStatusClass(item.compositing)}`}>
              <select
                className="status-select"
                value={item.compositing}
                onChange={(e) => onDataChange(category, index, 'compositing', e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.artist}
                onChange={(e) => onDataChange(category, index, 'artist', e.target.value)}
                placeholder="Artist name"
              />
            </td>
            <td>
              <input
                type="text"
                className="notes-input"
                value={item.notes}
                onChange={(e) => onDataChange(category, index, 'notes', e.target.value)}
                placeholder="Add notes"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ShotsTable;
