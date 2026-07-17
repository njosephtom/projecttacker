import React from 'react';
import StatusCell from './StatusCell';
import NotesCell from './NotesCell';
import '../styles/DataTable.css';

function DataTable({ data, tab, onDataChange }) {
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

  const statusOptions = ['APPROVED', 'WIP', 'NOT STARTED', 'READY TO START'];

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th style={{ width: '200px' }}>{tab === 'characters' ? 'CHARACTER' : tab === 'props' ? 'PROP' : 'SET'}</th>
          <th style={{ width: '140px', backgroundColor: '#ffeb3b', color: '#000' }}>MODELING</th>
          <th style={{ width: '140px', backgroundColor: '#00bcd4', color: '#fff' }}>SURFACING</th>
          <th style={{ width: '140px', backgroundColor: '#e91e63', color: '#fff' }}>RIGGING</th>
          <th style={{ width: '180px', backgroundColor: '#fff9c4', color: '#000' }}>ACTIVE ARTIST</th>
          <th style={{ minWidth: '250px', backgroundColor: '#e0e0e0', color: '#333' }}>Notes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.id}>
            <td className="item-name">{item.name}</td>
            <td className={`status-cell ${getStatusClass(item.modeling)}`}>
              <StatusCell
                status={item.modeling}
                options={statusOptions}
                onChange={(value) => onDataChange(tab, index, 'modeling', value)}
              />
            </td>
            <td className={`status-cell ${getStatusClass(item.surfacing)}`}>
              <StatusCell
                status={item.surfacing}
                options={statusOptions}
                onChange={(value) => onDataChange(tab, index, 'surfacing', value)}
              />
            </td>
            <td className={`status-cell ${getStatusClass(item.rigging)}`}>
              <StatusCell
                status={item.rigging}
                options={statusOptions}
                onChange={(value) => onDataChange(tab, index, 'rigging', value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.artist}
                onChange={(e) => onDataChange(tab, index, 'artist', e.target.value)}
                placeholder="Enter artist name"
              />
            </td>
            <td>
              <input
                type="text"
                className="notes-input"
                value={item.notes}
                onChange={(e) => onDataChange(tab, index, 'notes', e.target.value)}
                placeholder="Add notes here"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
