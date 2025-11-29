const { db, firestore } = require('./firebase/firebase');

console.log('✅ SmartFarm Realtime Listener Started');

let lastTimestamp = null;
let isInitialized = false;

db.ref('sensor_data').on('value', async (snapshot) => {
  if (isInitialized) {
    const data = snapshot.val();
    if (!data) return;

    if (data.timestamp <= lastTimestamp) return;
    lastTimestamp = data.timestamp;

    try {
      const docRef = await firestore.collection('history_sensor_data').add({
        ...data,
        dateTime: new Date(data.timestamp),
      });
      console.log('📘 Inserted data → doc ID:', docRef.id);
    } catch (err) {
      console.error('❌ Firestore write error:', err);
    }
  }
  isInitialized = true;

});