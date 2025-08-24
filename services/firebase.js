const admin = require('firebase-admin');

let svc;
try {
  svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (e) {
  console.error("❌ Missing or invalid FIREBASE_SERVICE_ACCOUNT_KEY");
}

if (!svc) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY not set");
}

admin.initializeApp({
  credential: admin.credential.cert(svc),
  databaseURL: `https://${svc.project_id}.firebaseio.com`
});

module.exports = admin;
