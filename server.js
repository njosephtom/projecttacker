const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
if (Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// GET /api/shots?seq=VALUE&shot=VALUE
app.get('/api/shots', async (req, res) => {
  try {
    const { seq, shot } = req.query;

    if (!seq || !shot) {
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['seq', 'shot'],
        example: '/api/shots?seq=1&shot=Wide'
      });
    }

    const snapshot = await db.collection('shots')
      .where('seq', '==', seq)
      .where('shot', '==', shot)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        error: 'Shot not found',
        query: { seq, shot }
      });
    }

    const shots = snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      count: shots.length,
      data: shots.length === 1 ? shots[0] : shots
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// GET /api/shots/:seq/:shot
app.get('/api/shots/:seq/:shot', async (req, res) => {
  try {
    const { seq, shot } = req.params;

    const snapshot = await db.collection('shots')
      .where('seq', '==', seq)
      .where('shot', '==', shot)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        error: 'Shot not found',
        query: { seq, shot }
      });
    }

    const shots = snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: shots.length === 1 ? shots[0] : shots
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// GET all shots
app.get('/api/shots-all', async (req, res) => {
  try {
    const snapshot = await db.collection('shots').get();
    const shots = snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      count: shots.length,
      data: shots
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🎬 Project Tracker API running on http://localhost:${PORT}`);
  console.log(`GET /api/shots?seq=VALUE&shot=VALUE`);
});
