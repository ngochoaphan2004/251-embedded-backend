const mqtt = require('mqtt');

const options = {
    host: 'b1a8cee2a98747619dc16d39314cc87a.s1.eu.hivemq.cloud', 
    port: 8883,
    protocol: 'mqtts', 
    username: 'admin', 
    password: 'Admin123',
    rejectUnauthorized: true 
};
const pumpRPC = "mydevice/rpc/command/pump";
const ledRPC = "mydevice/rpc/command/led";

const client = mqtt.connect(options);


// Event handlers for connection
client.on('connect', () => {
    console.log('✅ Connected to MQTT broker');
});

client.on('error', (err) => {
    console.error('❌ MQTT connection error:', err.message);
});

client.on('offline', () => {
    console.log('⚠️ MQTT client offline');
});

client.on('reconnect', () => {
    console.log('🔄 Reconnecting to MQTT broker...');
});

function turnOnPump() {
    if (!client.connected) {
        console.error('❌ Cannot publish: MQTT client not connected');
        return;
    }
    const cmd = JSON.stringify({ action: "turnOn", turnon: true });
    client.publish(pumpRPC, cmd, (err) => {
        if (err) console.error('❌ Publish error for pump on:', err);
        else console.log('📤 Published pump on command');
    });
}

function turnOffPump() {
    if (!client.connected) {
        console.error('❌ Cannot publish: MQTT client not connected');
        return;
    }
    const cmd = JSON.stringify({ action: "turnOff", turnon: false });
    client.publish(pumpRPC, cmd, (err) => {
        if (err) console.error('❌ Publish error for pump off:', err);
        else console.log('📤 Published pump off command');
    });
}

function turnOnLed() {
    if (!client.connected) {
        console.error('❌ Cannot publish: MQTT client not connected');
        return;
    }
    const cmd = JSON.stringify({ action: "turnOn", turnon: true });
    client.publish(ledRPC, cmd, (err) => {
        if (err) console.error('❌ Publish error for LED on:', err);
        else console.log('📤 Published LED on command');
    });
}

function turnOffLed() {
    if (!client.connected) {
        console.error('❌ Cannot publish: MQTT client not connected');
        return;
    }
    const cmd = JSON.stringify({ action: "turnOff", turnon: false });
    client.publish(ledRPC, cmd, (err) => {
        if (err) console.error('❌ Publish error for LED off:', err);
        else console.log('📤 Published LED off command');
    });
}

module.exports = {
    turnOnPump,
    turnOffPump,
    turnOnLed,
    turnOffLed
};