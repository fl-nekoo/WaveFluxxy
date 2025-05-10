/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

const lolcatjs = require('lolcatjs')
const {
    DisconnectReason
} = require("@adiwajshing/baileys")
const {
    Boom
} = require("@hapi/boom");
const fs = require('fs');

exports.connect = (update, fluxx, start) => {
    const {
        connection,
        lastDisconnect,
        qr
    } = update
    try {
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                const files = fs.readdirSync('./system/session/');
                const sessionFiles = files.filter(file => file.includes('session') && file.endsWith('.json'));

                if (sessionFiles.length > 0) {
                    console.log(`Bad Session File, Please Delete Session and Verifikasi Again`);
                    fluxx.logout();
                } else {
                    return;
                }
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnecting....");
                start();
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnecting...");
                start();
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
                fluxx.logout();
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`Device Logged Out, Please Verifikasi Again And Run.`);
                fluxx.logout();
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("Restart Required, Restarting...");
                start();
            } else if (reason === DisconnectReason.timedOut) {
                console.log("Connection TimedOut, Reconnecting...");
                start();
            } else fluxx.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            lolcatjs.fromString('[ Connected ] : welcome owner !')
        }
    } catch (err) {
        console.log('Error Di Connection.update ' + err)
    }
}