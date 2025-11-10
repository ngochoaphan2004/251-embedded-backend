const moment = require("moment");
const { firestore } = require("./functions/config/firebase.js");

const smooth = 0.03

let first = true
let pre_value = null

function generateRandomData(timestamp) {
  if (first) {
    first = false
    return {
      dateTime: new Date(timestamp),
      timestamp: timestamp,
      temperature: +(20 + Math.random() * 20).toFixed(1),   // 20–40°C
      humidity: +(60 + Math.random() * 20).toFixed(1),      // 60–80%
      rainfall: +(10 + Math.random() * 50).toFixed(2),      // 10–60 mm
      soilMoisture: +(5 + Math.random() * 15).toFixed(1),   // 5–20%
      waterLevel: +(2 + Math.random() * 5).toFixed(1),      // 2–7 cm
      ledState: Math.random() > 0.5,
      pumpState: Math.random() > 0.7,
    };
  }
  const target = {
    temperature: +(20 + Math.random() * 20).toFixed(1),
    humidity: +(60 + Math.random() * 20).toFixed(1),
    rainfall: +(10 + Math.random() * 50).toFixed(2),
    soilMoisture: +(5 + Math.random() * 15).toFixed(1),
    waterLevel: +(2 + Math.random() * 5).toFixed(1),
    ledState: Math.random() > 0.5,
    pumpState: Math.random() > 0.7,
  };
  return {
    dateTime: new Date(timestamp),
    timestamp,
    temperature: +(
      pre_value.temperature + smooth * (target.temperature - pre_value.temperature)
    ).toFixed(1),
    humidity: +(
      pre_value.humidity + smooth * (target.humidity - pre_value.humidity)
    ).toFixed(1),
    rainfall: +(
      pre_value.rainfall + smooth * (target.rainfall - pre_value.rainfall)
    ).toFixed(2),
    soilMoisture: +(
      pre_value.soilMoisture + smooth * (target.soilMoisture - pre_value.soilMoisture)
    ).toFixed(1),
    waterLevel: +(
      pre_value.waterLevel + smooth * (target.waterLevel - pre_value.waterLevel)
    ).toFixed(1),
    ledState: Math.random() > 0.9 ? !pre_value.ledState : pre_value.ledState,
    pumpState: Math.random() > 0.95 ? !pre_value.pumpState : pre_value.pumpState,
  };;
}

async function insertData() {
  try {
    const start = moment("2025-11-09 00:00:00", "YYYY-MM-DD HH:mm:ss");
    const end = moment("2025-11-10 23:59:59", "YYYY-MM-DD HH:mm:ss");
    const intervalMinutes = 10;

    console.log(`🌱 Bắt đầu tạo dữ liệu từ ${start.format()} đến ${end.format()}...`);

    const batch = firestore.batch();
    let count = 0;

    for (let time = moment(start); time.isBefore(end); time.add(intervalMinutes, "minutes")) {
      const ts = time.valueOf();
      const data = generateRandomData(ts);
      pre_value = data
      const docRef = firestore.collection("history_sensor_data").doc();
      batch.set(docRef, data);

      count++;

      if (count % 500 === 0) {
        await batch.commit();
        console.log(`✅ Đã ghi ${count} bản ghi...`);
      }
    }

    await batch.commit();
    console.log(`🎉 Hoàn tất! Tổng cộng ${count} bản ghi được chèn vào Firestore.`);
  } catch (error) {
    console.error("❌ Lỗi khi chèn dữ liệu:", error);
  }
}

insertData();
