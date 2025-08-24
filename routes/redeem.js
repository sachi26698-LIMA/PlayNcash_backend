const express = require('express');
const router = express.Router();
const admin = require('../services/firebase');
const { authMiddleware } = require('../utils/auth');

router.post('/apply', authMiddleware, async (req, res) => {
  const { code } = req.body;
  const db = admin.firestore();

  const codeRef = db.collection('redeemCodes').doc(code);
  const codeSnap = await codeRef.get();

  if (!codeSnap.exists) return res.status(404).json({ error: "Invalid code" });

  const data = codeSnap.data();
  if (data.usesLeft <= 0) return res.status(400).json({ error: "Code expired" });

  const userRef = db.collection('users').doc(req.user.uid);
  await userRef.set({
    coins: admin.firestore.FieldValue.increment(data.reward)
  }, { merge: true });

  await codeRef.update({ usesLeft: admin.firestore.FieldValue.increment(-1) });

  res.json({ reward: data.reward });
});

module.exports = router;
