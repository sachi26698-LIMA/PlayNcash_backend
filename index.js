const express = require('express');
const cors = require('cors');
require('./services/firebase');

const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const redeemRoutes = require('./routes/redeem');
const withdrawRoutes = require('./routes/withdraw');
const gameRoutes = require('./routes/games');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/redeem', redeemRoutes);
app.use('/withdraw', withdrawRoutes);
app.use('/games', gameRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ PlayNcash Server running on port ${PORT}`);
});
