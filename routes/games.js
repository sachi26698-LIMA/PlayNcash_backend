const express = require('express');
const router = express.Router();
const admin = require('../services/firebase');
const { authMiddleware } = require('../utils/auth');

router.post('/bonus', authMiddleware, async (req, res) => {
  const uid = req.user.uid;
  const db = admin.firestore();
  const ref = db.collection('users').doc(uid);

  const userDoc = await ref.get();
  const user = userDoc.data() || { coins: 0, lastBonus: 0 };
  const now = Date.now();

  if (now - (user.lastBonus || 0) < 24 * 60 * 60 * 1000) {
    return res.status(400).json({ error: "Already claimed today" });
  }

  const reward = Math.floor(Math.random() * 3) + 3; // 3-5 coins
  await ref.set({
    coins: (user.coins || 0) + reward,
    lastBonus: now
  }, { merge: true });

  res.json({ added: reward });
});

module.exports = router;
