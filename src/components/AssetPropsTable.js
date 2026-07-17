import React from 'react';
import '../styles/DataTable.css';

function AssetPropsTable({ data, category, onDataChange, rowHeight = 40 }) {
  return (
    <table className="data-table" style={{ '--row-height': `${rowHeight}px` }}>
      <thead>
        <tr>
          <th style={{ width: '180px' }}>ASSET NAME</th>
          <th style={{ width: '140px', backgroundColor: '#9c27b0', color: '#fff' }}>PARENT CHARACTER</th>
          <th style={{ width: '200px', backgroundColor: '#673ab7', color: '#fff' }}>PROPS ASSIGNED</th>
          <th style={{ width: '120px', backgroundColor: '#3f51b5', color: '#fff' }}>STATUS</th>
          <th style={{ width: '180px', backgroundColor: '#fff9c4', color: '#000' }}>ARTIST</th>
          <th style={{ minWidth: '250px', backgroundColor: '#e0e0e0', color: '#333' }}>NOTES</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.id} style={{ height: `${rowHeight}px` }}>
            <td className="item-name">{item.name}</td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.parent_character}
                onChange={(e) => onDataChange(category, index, 'parent_character', e.target.value)}
                placeholder="Enter parent character"
              />
            </td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.props_assigned}
                onChange={(e) => onDataChange(category, index, 'props_assigned', e.target.value)}
                placeholder="Enter assigned props"
              />
            </td>
            <td>
              <select
                className="status-select"
                value={item.status}
                onChange={(e) => onDataChange(category, index, 'status', e.target.value)}
              >
                <option>APPROVED</option>
                <option>WIP</option>
                <option>NOT STARTED</option>
                <option>READY TO START</option>
              </select>
            </td>
            <td>
              <input
                type="text"
                className="artist-input"
                value={item.artist}
                onChange={(e) => onDataChange(category, index, 'artist', e.target.value)}
                placeholder="Enter artist name"
              />
            </td>
            <td>
              <input
                type="text"
                className="notes-input"
                value={item.notes}
                onChange={(e) => onDataChange(category, index, 'notes', e.target.value)}
                placeholder="Add notes here"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AssetPropsTable;
