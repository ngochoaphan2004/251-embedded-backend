const { admin, db, firestore } = require('../functions/config/firebase')

const realtime = () => {
    let lastdata = {}
    db.ref('sensor_data').on('value', (snapshot) => {
        const serialized = JSON.stringify(snapshot.val());
        if (lastdata != serialized) {
            const collection = firestore.collection('history_sensor_data')

            const data = snapshot.val()

            collection.add({
                ...data,
                dateTime: new Date(data["timestamp"])
            })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });

            lastdata = serialized
        }
    }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
    });
}

module.exports = realtime;