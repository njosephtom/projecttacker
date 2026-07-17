import React, { useState } from 'react';
import './App.css';
import CollapsibleSection from './components/CollapsibleSection';
import DataTable from './components/DataTable';
import AssetPropsTable from './components/AssetPropsTable';
import ShotsTable from './components/ShotsTable';
import RowHeightControl from './components/RowHeightControl';
import { charactersData, propsData, setsData, assetCharacterPropsData, shotsData } from './data';

function App() {
  const [rowHeight, setRowHeight] = useState(40);
  const [expandedSections, setExpandedSections] = useState({
    characters: true,
    props: true,
    sets: true,
    assetProps: false,
    shots: false,
  });
  const [data, setData] = useState({
    characters: charactersData,
    props: propsData,
    sets: setsData,
    assetProps: assetCharacterPropsData,
    shots: shotsData,
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
    { id: 'assetProps', label: 'Assets', icon: '📦', count: data.assetProps.length },
    { id: 'shots', label: 'Shots', icon: '🎞️', count: data.shots.length },
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
              <>
                {section.id === 'assetProps' && (
                  <AssetPropsTable
                    data={data[section.id]}
                    category={section.id}
                    onDataChange={handleDataChange}
                    rowHeight={rowHeight}
                  />
                )}
                {section.id === 'shots' && (
                  <ShotsTable
                    data={data[section.id]}
                    category={section.id}
                    onDataChange={handleDataChange}
                    rowHeight={rowHeight}
                  />
                )}
                {['characters', 'props', 'sets'].includes(section.id) && (
                  <DataTable
                    data={data[section.id]}
                    category={section.id}
                    onDataChange={handleDataChange}
                    rowHeight={rowHeight}
                  />
                )}
              </>
            )}
          </CollapsibleSection>
        ))}
      </div>
    </div>
  );
}

export default App;
