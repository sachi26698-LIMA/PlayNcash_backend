const express = require("express");
const router = express.Router();
const admin = require("../services/firebase");

// 🔹 Signup / Login endpoint
router.post("/login", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID required" });

    const user = await admin.auth().getUser(uid).catch(() => null);

    if (!user) {
      await admin.auth().createUser({ uid });
      return res.json({ message: "New user created", uid });
    }

    res.json({ message: "Login success", uid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
