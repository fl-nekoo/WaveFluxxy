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
const low = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const {
    Low,
    JSONFile
} = low;
const mongoDB = require('./lib/mongoDB');
const chalk = require('chalk');

try {
    const dbFolder = path.join(__dirname, './lib/database');
    if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, {
        recursive: true
    });

    const dbFile = path.join(dbFolder, 'data.json');
    if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({}));

    let db = new JSONFile(dbFile);
    lolcatjs.fromString("[Berhasil tersambung ke database Lokal]");

    global.opts = yargs(process.argv.slice(2)).exitProcess(false).parse();

    global.db = new Low(db);
    global.DATABASE = global.db;

    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function() {
            (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null)
        }, 1 * 1000));
        if (global.db.data !== null) return;

        global.db.READ = true;
        await global.db.read();
        global.db.READ = false;

        global.db.data = {
            users: {},
            chats: {},
            database: {},
            game: {},
            settings: {},
            others: {},
            sticker: {},
            ...(global.db.data || {})
        };

        global.db.chain = _.chain(global.db.data);
    };

    global.loadDatabase();

    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write()
    }, 30 * 1000)

    exports.database_loader = async(m, bot) => {
        await global.loadDatabase();

        let isNumber = x => typeof x === 'number' && !isNaN(x);

        let user = global.db.data.users[m.sender] || {};
        if (typeof user !== 'object') global.db.data.users[m.sender] = {};
        if (!("isBanned" in user)) user.isBanned = false;

        let chat = global.db.data.chats[m.chat] || {};
        if (typeof chat !== 'object') global.db.data.chats[m.chat] = {};
        if (!('isBanned' in chat)) chat.isBanned = false;
        if (!('lastUpdate' in chat)) chat.lastUpdate = null;

        let setting = global.db.data.settings[bot] || {};
        if (typeof setting !== 'object') global.db.data.settings[bot] = {};
        if (!("autoread" in setting)) setting.autoread = false;
    }

} catch (err) {
    console.log(chalk.red(err));
}