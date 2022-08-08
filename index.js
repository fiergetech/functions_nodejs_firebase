const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.database.ref('notification/status').onUpdate(evt => {
    const payload = {
        notification:{
            title : 'PERINGATAN',
            body : 'Ada seseorang memasuki rumahmu!',
            badge : '1',
            sound : 'default'
        }
    };

    return admin.database().ref('fcm-token').once('value').then(allToken => {
        if(allToken.val() && evt.after.val() == 'yes'){
            console.log('token available');
            const token = Object.keys(allToken.val());
            return admin.messaging().sendToDevice(token,payload);
        }else{
            console.log('No token available');
        }
    });
});