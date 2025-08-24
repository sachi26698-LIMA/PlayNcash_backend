const express = require('express');
const router = express.Router();
const admin = require('../services/firebase');
const { authMiddleware } = require('../utils/auth');

router.post('/request', authMiddleware, async (req, res) => {
  const { upi, amount } = req.body;
  const db = admin.firestore();
  const userRef = db.collection('users').doc(req.user.uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists || (userDoc.data().coins || 0) < amount) {
    return res.status(400).json({ error: "Not enough coins" });
  }

  await userRef.update({
    coins: admin.firestore.FieldValue.increment(-amount)
  });

  await db.collection('withdrawRequests').add({
    uid: req.user.uid,
    upi,
    amount,
    status: "pending",
    createdAt: Date.now()
  });

  res.json({ success: true });
});

module.exports = router;
