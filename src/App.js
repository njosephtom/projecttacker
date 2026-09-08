import React, { useState, useEffect } from 'react';
import './App.css';
import { firebaseConfig } from './firebaseConfig';
import * as S from './styles';

function App() {
  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState('assets');
  const [assets, setAssets] = useState([]);
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [assetModal, setAssetModal] = useState({ open: false, editing: null });
  const [shotModal, setShotModal] = useState({ open: false, editing: null });

  // Form states
  const [assetForm, setAssetForm] = useState({
    id: '',
    prefix: '',
    assetName: '',
    assetNameManual: false,
    category: 'Camera',
    gdrivePath: '',
    status: 'approved',
    json: {},
    gdriveManual: false
  });

  const [shotForm, setShotForm] = useState({
    id: '',
    seq: '',
    shot: '',
    dept: '',
    filename: '',
    gdrivePath: '',
    status: 'approved',
    json: {},
    filenameManual: false,
    gdriveManual: false
  });

  const [assetSort, setAssetSort] = useState('id');
  const [shotSort, setShotSort] = useState('id');

  // Initialize Firebase
  useEffect(() => {
    const initFirebase = async () => {
      if (!window.firebase) {
        console.error('Firebase not loaded');
        return;
      }
      try {
        if (!window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        setDb(window.firebase.firestore());
        // Load sort preferences
        const savedAssetSort = localStorage.getItem('assetSortBy') || 'id';
        const savedShotSort = localStorage.getItem('shotSortBy') || 'id';
        setAssetSort(savedAssetSort);
        setShotSort(savedShotSort);
      } catch (err) {
        setError(err.message);
      }
    };
    initFirebase();
  }, []);

  // Load assets
  const loadAssets = async () => {
    if (!db) return;
    try {
      setLoading(true);
      const snap = await db.collection('assets').get();
      const docs = snap.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      const sorted = docs.sort((a, b) => String(a[assetSort] || '').localeCompare(String(b[assetSort] || '')));
      setAssets(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load shots
  const loadShots = async () => {
    if (!db) return;
    try {
      setLoading(true);
      const snap = await db.collection('shots').get();
      const docs = snap.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
      const sorted = docs.sort((a, b) => String(a[shotSort] || '').localeCompare(String(b[shotSort] || '')));
      setShots(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data when db or sort changes
  useEffect(() => {
    if (db) {
      loadAssets();
      loadShots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, assetSort, shotSort]);

  // Asset helpers
  const generateAssetName = (prefix, id) => prefix && id ? `${prefix}_${id}` : '';
  const generateAssetGdrivePath = (id, category) => {
    if (!id || !category) return '';
    return category === 'Camera' ? '/Assets/Camera' : `/Assets/${category}/${id}`;
  };

  const updateAssetFields = (newForm) => ({
    ...newForm,
    assetName: !newForm.assetNameManual ? generateAssetName(newForm.prefix, newForm.id) : newForm.assetName,
    gdrivePath: !newForm.gdriveManual ? generateAssetGdrivePath(newForm.id, newForm.category) : newForm.gdrivePath
  });

  // Shot helpers
  const generateShotId = (seq, shot) => {
    if (seq && shot) return `${seq}_${shot}`;
    return '';
  };

  const generateShotFilename = (seq, shot, dept) => {
    if (!seq || !shot || !dept) return '';
    const seqNum = seq.replace(/\D/g, '');
    const shotNum = shot.replace(/\D/g, '');
    return `SQ${seqNum}_Sh${shotNum}_${dept}_v0000.ma`;
  };

  const generateShotGdrivePath = (seq, shot) => {
    if (seq && shot) return `/Shots/${seq}/${seq}_${shot}`;
    return '';
  };

  // Asset Modal handlers
  const openAssetModal = () => {
    setAssetForm({
      id: '',
      prefix: '',
      assetName: '',
      assetNameManual: false,
      category: 'Camera',
      gdrivePath: '',
      status: 'approved',
      json: {},
      gdriveManual: false
    });
    setAssetModal({ open: true, editing: null });
  };

  const editAsset = async (docId) => {
    if (!db) return;
    try {
      const doc = await db.collection('assets').doc(docId).get();
      if (doc.exists) {
        const data = doc.data();
        setAssetForm({
          id: data.id || '',
          prefix: data.prefix || '',
          assetName: data.assetName || '',
          assetNameManual: data.assetNameManual || false,
          category: data.category || 'Camera',
          gdrivePath: data.gdrivePath || '',
          status: data.status || 'approved',
          json: data.json || {},
          gdriveManual: data.gdriveManual || false
        });
        setAssetModal({ open: true, editing: docId });
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const saveAsset = async () => {
    if (!assetForm.id || !assetForm.gdrivePath) {
      alert('ID and GDrive Path required');
      return;
    }

    try {
      if (assetModal.editing) {
        await db.collection('assets').doc(assetModal.editing).update(assetForm);
      } else {
        await db.collection('assets').add(assetForm);
      }
      setAssetModal({ open: false, editing: null });
      loadAssets();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteAsset = async (docId) => {
    if (!window.confirm('Delete this asset?')) return;
    try {
      await db.collection('assets').doc(docId).delete();
      loadAssets();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Shot Modal handlers
  const openShotModal = () => {
    setShotForm({
      id: '',
      seq: '',
      shot: '',
      dept: '',
      filename: '',
      gdrivePath: '',
      status: 'approved',
      json: {},
      filenameManual: false,
      gdriveManual: false
    });
    setShotModal({ open: true, editing: null });
  };

  const editShot = async (docId) => {
    if (!db) return;
    try {
      const doc = await db.collection('shots').doc(docId).get();
      if (doc.exists) {
        const data = doc.data();
        setShotForm({
          id: data.id || '',
          seq: data.seq || '',
          shot: data.shot || '',
          dept: data.dept || '',
          filename: data.filename || '',
          gdrivePath: data.gdrivePath || '',
          status: data.status || 'approved',
          json: data.json || {},
          filenameManual: data.filenameManual || false,
          gdriveManual: data.gdriveManual || false
        });
        setShotModal({ open: true, editing: docId });
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const saveShot = async () => {
    if (!shotForm.id || !shotForm.seq || !shotForm.shot || !shotForm.dept || !shotForm.filename || !shotForm.gdrivePath) {
      alert('ID, Seq, Shot, Dept, Filename, and GDrive Path required');
      return;
    }

    try {
      if (shotModal.editing) {
        await db.collection('shots').doc(shotModal.editing).update(shotForm);
      } else {
        await db.collection('shots').add(shotForm);
      }
      setShotModal({ open: false, editing: null });
      loadShots();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const deleteShot = async (docId) => {
    if (!window.confirm('Delete this shot?')) return;
    try {
      await db.collection('shots').doc(docId).delete();
      loadShots();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleShotFormChange = (field, value) => {
    let updated = { ...shotForm, [field]: value };

    if (field === 'seq' || field === 'shot' || field === 'dept') {
      const id = generateShotId(updated.seq, updated.shot);
      updated.id = id;
      if (!updated.filenameManual) {
        updated.filename = generateShotFilename(updated.seq, updated.shot, updated.dept);
      }
      if (!updated.gdriveManual) {
        updated.gdrivePath = generateShotGdrivePath(updated.seq, updated.shot);
      }
    }

    setShotForm(updated);
  };


  return (
    <div style={S.MAIN_CONTAINER}>
      <div style={S.CONTENT_WRAPPER}>
        <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>🎬 HC Project Tracker</h1>

        {error && <div style={{ color: '#dc3545', marginBottom: '10px' }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
          <button
            onClick={() => setActiveTab('assets')}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: activeTab === 'assets' ? '3px solid #007bff' : '3px solid transparent',
              color: activeTab === 'assets' ? '#007bff' : '#333',
              fontWeight: activeTab === 'assets' ? 'bold' : 'normal'
            }}
          >
            📦 Assets
          </button>
          <button
            onClick={() => setActiveTab('shots')}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: activeTab === 'shots' ? '3px solid #007bff' : '3px solid transparent',
              color: activeTab === 'shots' ? '#007bff' : '#333',
              fontWeight: activeTab === 'shots' ? 'bold' : 'normal'
            }}
          >
            🎥 Shots
          </button>
        </div>

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button onClick={openAssetModal} style={{ ...S.BUTTON_PRIMARY, marginRight: '15px' }}>
                + Add Asset
              </button>
              <select
                value={assetSort}
                onChange={(e) => {
                  setAssetSort(e.target.value);
                  localStorage.setItem('assetSortBy', e.target.value);
                }}
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="prefix">Sort by Prefix</option>
                <option value="id">Sort by ID</option>
                <option value="assetName">Sort by Asset Name</option>
                <option value="category">Sort by Category</option>
                <option value="gdrivePath">Sort by GDrive Path</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            <div style={S.TABLE_WRAPPER}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={S.TABLE_HEADER_CELL}>Prefix</th>
                    <th style={S.TABLE_HEADER_CELL}>ID</th>
                    <th style={S.TABLE_HEADER_CELL}>Asset Name</th>
                    <th style={S.TABLE_HEADER_CELL}>Category</th>
                    <th style={S.TABLE_HEADER_CELL}>GDrive Path</th>
                    <th style={S.TABLE_HEADER_CELL}>Status</th>
                    <th style={S.TABLE_HEADER_CELL}>JSON Data</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '13px', borderBottom: '2px solid #ddd', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</td></tr>
                  ) : assets.length === 0 ? (
                    <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No assets yet</td></tr>
                  ) : (
                    assets.map(asset => (
                      <tr key={asset.docId} style={S.TABLE_ROW}>
                        <td style={{ padding: '12px' }}><strong>{asset.prefix || '—'}</strong></td>
                        <td style={{ padding: '12px' }}><strong>{asset.id || asset.docId}</strong></td>
                        <td style={{ padding: '12px', color: asset.assetNameManual ? '#ff9800' : '#666', fontWeight: asset.assetNameManual ? 'bold' : 'normal' }}>
                          {asset.assetName || '—'}{asset.assetNameManual ? ' ✎' : ''}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            background: S.CAT_COLORS[asset.category] || '#f0f0f0'
                          }}>
                            {asset.category || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: asset.gdriveManual ? '#ff9800' : '#666', fontWeight: asset.gdriveManual ? 'bold' : 'normal' }}>
                          {asset.gdrivePath || '—'}{asset.gdriveManual ? ' ✎' : ''}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            background: S.STATUS_COLORS[asset.status]?.bg || '#e2e3e5',
                            color: S.STATUS_COLORS[asset.status]?.text || '#383d41'
                          }}>
                            {asset.status || 'approved'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <code style={{ fontSize: '11px' }}>
                            {JSON.stringify(asset.json || {}).slice(0, 50)}...
                          </code>
                        </td>
                        <td style={{ padding: '12px', display: 'flex', gap: '6px' }}>
                          <button onClick={() => editAsset(asset.docId)} style={S.BUTTON_WARNING}>Edit</button>
                          <button onClick={() => deleteAsset(asset.docId)} style={S.BUTTON_DANGER}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Shots Tab */}
        {activeTab === 'shots' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <button onClick={openShotModal} style={{ ...S.BUTTON_PRIMARY, marginRight: '15px' }}>
                + Add Shot
              </button>
              <select
                value={shotSort}
                onChange={(e) => {
                  setShotSort(e.target.value);
                  localStorage.setItem('shotSortBy', e.target.value);
                }}
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="id">Sort by ID</option>
                <option value="seq">Sort by Seq</option>
                <option value="shot">Sort by Shot</option>
                <option value="filename">Sort by Filename</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            <div style={S.TABLE_WRAPPER}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={S.TABLE_HEADER_CELL}>ID</th>
                    <th style={S.TABLE_HEADER_CELL}>Seq</th>
                    <th style={S.TABLE_HEADER_CELL}>Shot</th>
                    <th style={S.TABLE_HEADER_CELL}>Filename</th>
                    <th style={S.TABLE_HEADER_CELL}>GDrive Path</th>
                    <th style={S.TABLE_HEADER_CELL}>Status</th>
                    <th style={S.TABLE_HEADER_CELL}>JSON Data</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', fontSize: '13px', borderBottom: '2px solid #ddd', width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</td></tr>
                  ) : shots.length === 0 ? (
                    <tr><td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No shots yet</td></tr>
                  ) : (
                    shots.map(shot => (
                      <tr key={shot.docId} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '12px' }}><strong>{shot.id || shot.docId}</strong></td>
                        <td style={{ padding: '12px' }}>{shot.seq || '—'}</td>
                        <td style={{ padding: '12px' }}>{shot.shot || '—'}</td>
                        <td style={{ padding: '12px', color: shot.filenameManual ? '#ff9800' : '#666', fontWeight: shot.filenameManual ? 'bold' : 'normal' }}>
                          <code style={{ fontSize: '11px' }}>
                            {shot.filename || '—'}{shot.filenameManual ? ' ✎' : ''}
                          </code>
                        </td>
                        <td style={{ padding: '12px', color: shot.gdriveManual ? '#ff9800' : '#666', fontWeight: shot.gdriveManual ? 'bold' : 'normal' }}>
                          {shot.gdrivePath || '—'}{shot.gdriveManual ? ' ✎' : ''}
                        </td>
                        <td style={S.TABLE_CELL}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '3px',
                            fontSize: '12px',
                            background: S.STATUS_COLORS[shot.status]?.bg || '#e2e3e5',
                            color: S.STATUS_COLORS[shot.status]?.text || '#383d41'
                          }}>
                            {shot.status || 'approved'}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <code style={{ fontSize: '11px' }}>
                            {JSON.stringify(shot.json || {}).slice(0, 50)}...
                          </code>
                        </td>
                        <td style={{ padding: '12px', display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => editShot(shot.docId)}
                            style={{
                              padding: '4px 8px',
                              background: '#ffc107',
                              color: '#333',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteShot(shot.docId)}
                            style={{
                              padding: '4px 8px',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Asset Modal */}
        {assetModal.open && (
          <div style={S.MODAL_OVERLAY}>
            <div style={S.MODAL_CONTENT}>
              <h2 style={{ marginBottom: '15px' }}>
                {assetModal.editing ? 'Edit Asset' : 'Add Asset'}
              </h2>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Prefix</label>
                <input
                  type="text"
                  value={assetForm.prefix}
                  onChange={(e) => {
                    const updated = { ...assetForm, prefix: e.target.value };
                    setAssetForm(updateAssetFields(updated));
                  }}
                  placeholder="e.g., Concerto"
                  style={S.INPUT_TEXT}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>ID</label>
                <input
                  type="text"
                  value={assetForm.id}
                  onChange={(e) => {
                    const updated = { ...assetForm, id: e.target.value };
                    setAssetForm(updateAssetFields(updated));
                  }}
                  placeholder="e.g., cameraRig"
                  style={S.INPUT_TEXT}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>
                  Asset Name <span style={{ fontSize: '11px', color: '#999' }}>(auto-generated, editable)</span>
                </label>
                <input
                  type="text"
                  value={assetForm.assetName}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    const generated = generateAssetName(assetForm.prefix, assetForm.id);
                    setAssetForm({
                      ...assetForm,
                      assetName: val,
                      assetNameManual: val !== generated
                    });
                  }}
                  placeholder="e.g., Concerto_cameraRig"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${assetForm.assetNameManual ? '#ff9800' : '#28a745'}`,
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  color: assetForm.assetNameManual ? '#ff9800' : '#28a745'
                }}>
                  {assetForm.assetNameManual ? '✎ Manually edited' : '✓ Auto-generated'}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Category</label>
                <select
                  value={assetForm.category}
                  onChange={(e) => {
                    const updated = { ...assetForm, category: e.target.value };
                    setAssetForm(updateAssetFields(updated));
                  }}
                  style={{ ...S.INPUT_TEXT, boxSizing: 'border-box' }}
                >
                  <option value="Camera">Camera</option>
                  <option value="Characters">Characters</option>
                  <option value="Environments">Environments</option>
                  <option value="Props">Props</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>
                  GDrive Path <span style={{ fontSize: '11px', color: '#999' }}>(auto-generated, editable)</span>
                </label>
                <input
                  type="text"
                  value={assetForm.gdrivePath}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    const generated = generateAssetGdrivePath(assetForm.id, assetForm.category);
                    setAssetForm({
                      ...assetForm,
                      gdrivePath: val,
                      gdriveManual: val !== generated
                    });
                  }}
                  placeholder="e.g., /Assets/..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${assetForm.gdriveManual ? '#ff9800' : '#28a745'}`,
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  color: assetForm.gdriveManual ? '#ff9800' : '#28a745'
                }}>
                  {assetForm.gdriveManual ? '✎ Manually edited' : '✓ Auto-generated'}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Status</label>
                <select
                  value={assetForm.status}
                  onChange={(e) => setAssetForm({ ...assetForm, status: e.target.value })}
                  style={{ ...S.INPUT_TEXT, boxSizing: 'border-box' }}
                >
                  <option value="approved">Approved</option>
                  <option value="wip">WIP</option>
                  <option value="hold">Hold</option>
                  <option value="omitted">Omitted</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>JSON Data (optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={JSON.stringify(assetForm.json)}
                    onChange={(e) => {
                      try {
                        setAssetForm({ ...assetForm, json: JSON.parse(e.target.value) });
                      } catch {}
                    }}
                    placeholder='e.g., {"key": "value"}'
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button onClick={() => setAssetForm({ ...assetForm, json: {} })} title="Clear JSON data" style={{ ...S.BUTTON_DANGER, whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '13px' }}>
                    Clear
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button onClick={() => setAssetModal({ open: false, editing: null })} style={S.BUTTON_SECONDARY}>Cancel</button>
                <button onClick={saveAsset} style={S.BUTTON_PRIMARY}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Shot Modal */}
        {shotModal.open && (
          <div style={S.MODAL_OVERLAY}>
            <div style={S.MODAL_CONTENT_SHOT}>
              <h2 style={{ marginBottom: '15px' }}>
                {shotModal.editing ? 'Edit Shot' : 'Add Shot'}
              </h2>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>ID</label>
                <input
                  type="text"
                  value={shotForm.id}
                  readOnly
                  placeholder="Auto-generated"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box',
                    background: '#f5f5f5'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Seq</label>
                <input
                  type="text"
                  value={shotForm.seq}
                  onChange={(e) => handleShotFormChange('seq', e.target.value)}
                  placeholder="e.g., 1"
                  style={S.INPUT_TEXT}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Shot</label>
                <input
                  type="text"
                  value={shotForm.shot}
                  onChange={(e) => handleShotFormChange('shot', e.target.value)}
                  placeholder="e.g., Wide"
                  style={S.INPUT_TEXT}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Dept</label>
                <input
                  type="text"
                  value={shotForm.dept}
                  onChange={(e) => handleShotFormChange('dept', e.target.value)}
                  placeholder="e.g., Anim, VFX, Lighting"
                  style={S.INPUT_TEXT}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>
                  Filename <span style={{ fontSize: '11px', color: '#999' }}>(auto-generated, editable)</span>
                </label>
                <input
                  type="text"
                  value={shotForm.filename}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    const generated = generateShotFilename(shotForm.seq, shotForm.shot, shotForm.dept);
                    setShotForm({
                      ...shotForm,
                      filename: val,
                      filenameManual: val !== generated
                    });
                  }}
                  placeholder="e.g., SQ200_Sh001_Anim_v0000.ma"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${shotForm.filenameManual ? '#ff9800' : '#28a745'}`,
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  color: shotForm.filenameManual ? '#ff9800' : '#28a745'
                }}>
                  {shotForm.filenameManual ? '✎ Manually edited' : '✓ Auto-generated'}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>
                  GDrive Path <span style={{ fontSize: '11px', color: '#999' }}>(auto-generated, editable)</span>
                </label>
                <input
                  type="text"
                  value={shotForm.gdrivePath}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    const generated = generateShotGdrivePath(shotForm.seq, shotForm.shot);
                    setShotForm({
                      ...shotForm,
                      gdrivePath: val,
                      gdriveManual: val !== generated
                    });
                  }}
                  placeholder="e.g., /Shots/..."
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${shotForm.gdriveManual ? '#ff9800' : '#28a745'}`,
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  color: shotForm.gdriveManual ? '#ff9800' : '#28a745'
                }}>
                  {shotForm.gdriveManual ? '✎ Manually edited' : '✓ Auto-generated'}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>Status</label>
                <select
                  value={shotForm.status}
                  onChange={(e) => setShotForm({ ...shotForm, status: e.target.value })}
                  style={{ ...S.INPUT_TEXT, boxSizing: 'border-box' }}
                >
                  <option value="approved">Approved</option>
                  <option value="wip">WIP</option>
                  <option value="hold">Hold</option>
                  <option value="omitted">Omitted</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={S.INPUT_LABEL}>JSON Data (optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={JSON.stringify(shotForm.json)}
                    onChange={(e) => {
                      try {
                        setShotForm({ ...shotForm, json: JSON.parse(e.target.value) });
                      } catch {}
                    }}
                    placeholder='e.g., {"key": "value"}'
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={() => setShotForm({ ...shotForm, json: {} })}
                    title="Clear JSON data"
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setShotModal({ open: false, editing: null })}
                  style={{
                    padding: '8px 16px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveShot}
                  style={{
                    padding: '8px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
