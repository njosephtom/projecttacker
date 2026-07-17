import React, { useState } from 'react';
import './App.css';
import CollapsibleSection from './components/CollapsibleSection';
import DataTable from './components/DataTable';
import RowHeightControl from './components/RowHeightControl';
import { charactersData, propsData, setsData } from './data';

function App() {
  const [rowHeight, setRowHeight] = useState(40);
  const [expandedSections, setExpandedSections] = useState({
    characters: true,
    props: true,
    sets: true,
  });
  const [data, setData] = useState({
    characters: charactersData,
    props: propsData,
    sets: setsData,
  });

  const handleDataChange = (category, itemIndex, field, value) => {
    setData(prevData => {
      const newData = { ...prevData };
      newData[category][itemIndex][field] = value;
      return newData;
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    { id: 'characters', label: 'Characters', icon: '👤', count: data.characters.length },
    { id: 'props', label: 'Props', icon: '🎬', count: data.props.length },
    { id: 'sets', label: 'Sets', icon: '🏠', count: data.sets.length },
  ];

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🎬 Project Tracker</h1>
            <p>Production Pipeline Status</p>
          </div>
          <RowHeightControl rowHeight={rowHeight} onRowHeightChange={setRowHeight} />
        </div>
      </header>

      <div className="content-wrapper">
        {sections.map(section => (
          <CollapsibleSection
            key={section.id}
            section={section}
            isExpanded={expandedSections[section.id]}
            onToggle={() => toggleSection(section.id)}
          >
            {expandedSections[section.id] && (
              <DataTable
                data={data[section.id]}
                category={section.id}
                onDataChange={handleDataChange}
                rowHeight={rowHeight}
              />
            )}
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}

export default App;
