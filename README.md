# 🎬 Project Tracker

A React-based project tracker for managing production pipeline status with a Google Sheets-like interface. Track Characters, Props, and Sets through different production stages (Modeling, Surfacing, Rigging).

## Features

- 📊 **Sheet-like Interface**: Clean, spreadsheet-inspired design
- 🎯 **Three Main Categories**: Characters, Props, and Sets
- 📋 **Status Tracking**: Track workflow stages with color-coded statuses
- ✏️ **Editable Cells**: Update artist assignments and notes in real-time
- 🎨 **Visual Status Indicators**: Color-coded workflow stages
  - Green: APPROVED
  - Yellow: WIP (Work In Progress)
  - Red: NOT STARTED
  - Light Blue: READY TO START

## Project Structure

```
projecttacker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DataTable.js
│   │   ├── NotesCell.js
│   │   ├── StatusCell.js
│   │   └── TabContainer.js
│   ├── styles/
│   │   ├── DataTable.css
│   │   ├── NotesCell.css
│   │   ├── StatusCell.css
│   │   └── TabContainer.css
│   ├── App.js
│   ├── App.css
│   ├── data.js
│   ├── index.js
│   └── index.css
├── package.json
├── .gitignore
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

- **Switch Tabs**: Click the tab buttons to switch between Characters, Props, and Sets
- **Update Status**: Click any status cell to select from available options
- **Edit Artist**: Type artist names directly in the Active Artist column
- **Add Notes**: Add or edit notes in the Notes column

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite

## Technologies Used

- React 18
- CSS3
- JavaScript ES6+

## Data Structure

Each item (Character, Prop, or Set) contains:
- `name` - Item name
- `modeling` - Modeling stage status
- `surfacing` - Surfacing stage status
- `rigging` - Rigging stage status
- `artist` - Active artist name
- `notes` - Additional notes

## Customization

To modify the data, edit `src/data.js` to add, remove, or update items in any category.