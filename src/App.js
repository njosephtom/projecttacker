import React, { useState } from 'react';
import './App.css';
import TabContainer from './components/TabContainer';
import { charactersData, propsData, setsData } from './data';

function App() {
  const [activeTab, setActiveTab] = useState('characters');
  const [data, setData] = useState({
    characters: charactersData,
    props: propsData,
    sets: setsData,
  });

  const handleDataChange = (tab, itemIndex, field, value) => {
    setData(prevData => {
      const newData = { ...prevData };
      newData[tab][itemIndex][field] = value;
      return newData;
    });
  };

  const tabs = [
    { id: 'characters', label: 'Characters', icon: '👤' },
    { id: 'props', label: 'Props', icon: '🎬' },
    { id: 'sets', label: 'Sets', icon: '🏠' },
  ];

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎬 Project Tracker</h1>
        <p>Production Pipeline Status</p>
      </header>

      <TabContainer
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        data={data[activeTab]}
        currentTab={activeTab}
        onDataChange={handleDataChange}
      />
    </div>
  );
}

export default App;
