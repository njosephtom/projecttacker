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
  const [activeTab, setActiveTab] = useState('asset');
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

  const assetSections = [
    { id: 'characters', label: 'Characters', icon: '👤', count: data.characters.length },
    { id: 'props', label: 'Props', icon: '🎬', count: data.props.length },
    { id: 'sets', label: 'Sets', icon: '🏠', count: data.sets.length },
  ];

  const tabs = [
    { id: 'asset', label: 'Asset', icon: '📦' },
    { id: 'shots', label: 'Shots', icon: '🎞️' },
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

      <div className="tabs-wrapper">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-wrapper">
        {activeTab === 'asset' && (
          <>
            {assetSections.map(section => (
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
          </>
        )}

        {activeTab === 'shots' && (
          <ShotsTable
            data={data.shots}
            category="shots"
            onDataChange={handleDataChange}
            rowHeight={rowHeight}
          />
        )}
      </div>
    </div>
  );
}

export default App;
