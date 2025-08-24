const express = require('express');
const router = express.Router();
const admin = require('../services/firebase');
const { authMiddleware } = require('../utils/auth');

router.get('/', authMiddleware, async (req, res) => {
  const uid = req.user.uid;
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  const data = snap.exists ? snap.data() : { coins: 0 };
  res.json({ coins: data.coins || 0 });
});

module.exports = router;
