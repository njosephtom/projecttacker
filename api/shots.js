const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

if (!admin.apps.length && Object.keys(serviceAccount).length > 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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
};
