// Button styles
export const BUTTON_PRIMARY = {
  padding: '8px 16px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export const BUTTON_WARNING = {
  padding: '4px 8px',
  background: '#ffc107',
  color: '#333',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

export const BUTTON_DANGER = {
  padding: '4px 8px',
  background: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

export const BUTTON_SECONDARY = {
  padding: '8px 16px',
  background: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

// Table styles
export const TABLE_HEADER_CELL = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '13px',
  borderBottom: '2px solid #ddd'
};

export const TABLE_CELL = {
  padding: '12px'
};

export const TABLE_ROW = {
  borderBottom: '1px solid #ddd'
};

// Form styles
export const INPUT_TEXT = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  boxSizing: 'border-box'
};

export const INPUT_LABEL = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  fontSize: '13px'
};

// Modal styles
export const MODAL_OVERLAY = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

export const MODAL_CONTENT = {
  background: 'white',
  padding: '30px',
  borderRadius: '8px',
  minWidth: '400px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
};

export const MODAL_CONTENT_SHOT = {
  ...MODAL_CONTENT,
  maxHeight: '90vh',
  overflowY: 'auto'
};

// Container styles
export const MAIN_CONTAINER = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  background: '#f5f5f5',
  color: '#333',
  minHeight: '100vh'
};

export const CONTENT_WRAPPER = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '20px'
};

export const TABLE_WRAPPER = {
  overflowX: 'auto',
  background: 'white',
  borderRadius: '4px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

// Colors
export const CAT_COLORS = {
  'Camera': '#cfe2ff',
  'Characters': '#e7d4f5',
  'Environments': '#d1e7dd',
  'Props': '#fff3cd'
};

export const STATUS_COLORS = {
  'approved': { bg: '#d4edda', text: '#155724' },
  'wip': { bg: '#fff3cd', text: '#856404' },
  'hold': { bg: '#f8d7da', text: '#721c24' },
  'omitted': { bg: '#e2e3e5', text: '#383d41' }
};
