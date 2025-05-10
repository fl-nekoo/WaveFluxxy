/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

require('../../handler')
require('./config')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode,
    proto,
    getContentType,
    downloadContentFromMessage,
    fetchLatestWaWebVersion,
    makeCacheableSignalKeyStore
} = require("@adiwajshing/baileys");
const fs = require("fs");
const pino = require("pino");
const lolcatjs = require('lolcatjs')
const path = require('path');
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const fetch = require("node-fetch")
const FileType = require('file-type')
const _ = require('lodash')
const {
    Boom
} = require("@hapi/boom");
const PhoneNumber = require("awesome-phonenumber");
const readline = require("readline");
const {
    color,
    getBuffer
} = require("../function")
const {
    newSockets,
    smsg
} = require("../simple")
const low = require('../lowdb');
const yargs = require('yargs/yargs');
const {
    Low,
    JSONFile
} = low;
const mongoDB = require('../mongoDB');
const {
    options
} = require('../sockets');

const folderName = "../../tmp";
const folderPath = path.join(__dirname, folderName);
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    lolcatjs.fromString(`Folder '${folderName}' berhasil dibuat.`);
} else {
    lolcatjs.fromString(`Folder '${folderName}' sudah ada.`);
}

const useMobile = process.argv.includes("--mobile")
const usePairingCode = true
const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
};

async function start() {
    const fluxx = await newSockets(start, options);
    if (usePairingCode && !fluxx.authState.creds.registered) {
        const phoneNumber = await question('Masukan Nomer Yang Aktif Awali Dengan 62 Recode :\n');
        const code = await fluxx.requestPairingCode(phoneNumber.trim(), custompair)
        lolcatjs.fromString(`Pairing code: ${code}`)
    }
}

start();