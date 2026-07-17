import React from 'react';
import DataTable from './DataTable';
import '../styles/TabContainer.css';

function TabContainer({ tabs, activeTab, onTabChange, data, currentTab, onDataChange }) {
  return (
    <div className="tab-container">
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <DataTable
          data={data}
          tab={currentTab}
          onDataChange={onDataChange}
        />
      </div>
    </div>
  );
}

export default TabContainer;
