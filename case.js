/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

require('./lib/system/config')
const { exec, spawn, execSync } = require("child_process")
const fs = require('fs')
const fsx = require('fs-extra')
const util = require('util')
const fetch = require('node-fetch')
const axios = require('axios')
const cheerio = require('cheerio')
const { performance } = require("perf_hooks");
const { TelegraPH } = "."
const { remini, jarak, ssweb, quote, tiktok, PlayStore, BukaLapak, pinterest, stickersearch, lirik } = require("./lib/scraper")
const process = require('process');
const moment = require("moment-timezone")
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;
const speed = require('performance-now')
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const { bytesToSize, checkBandwidth, formatSize, getBuffer, isUrl, jsonformat, nganuin, pickRandom, runtime, shorturl, formatp, color, getGroupAdmins } = require("./lib/function");
const { addExif } = require('./lib/exif')
const chokidar = require('chokidar')
const path = require("path")
const chalk = require("chalk")
const similarity = require('similarity');
const didyoumean = require('didyoumean');
const lolcatjs = require('lolcatjs')

module.exports = fluxx = async (fluxx, m, chatUpdate, store) => {
try {
const body = (m && m?.mtype) ? (
m?.mtype === 'conversation' ? m?.message?.conversation :
m?.mtype === 'imageMessage' ? m?.message?.imageMessage?.caption :
m?.mtype === 'videoMessage' ? m?.message?.videoMessage?.caption :
m?.mtype === 'extendedTextMessage' ? m?.message?.extendedTextMessage?.text :
m?.mtype === 'buttonsResponseMessage' ? m?.message?.buttonsResponseMessage?.selectedButtonId :
m?.mtype === 'listResponseMessage' ? m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId :
m?.mtype === 'templateButtonReplyMessage' ? m?.message?.templateButtonReplyMessage?.selectedId :
m?.mtype === 'messageContextInfo' ? (
m?.message?.buttonsResponseMessage?.selectedButtonId || 
m?.message?.listResponseMessage?.singleSelectReply?.selectedRowId || 
m?.text
) : ''
) : '';
const budy = (m && typeof m?.text === 'string') ? m?.text : '';
const prefix = /^[°zZ#@*+,.?''():√%!¢£¥€π¤ΠΦ_&<`™©®Δ^βα~¦|/\\©^]/.test(body) ? body.match(/^[°zZ#@*+,.?''():√%¢£¥€π¤ΠΦ_&<!`™©®Δ^βα~¦|/\\©^]/gi) : '.'
const isCmd = body.startsWith(prefix)
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''

const prem = JSON.parse(fs.readFileSync("./lib/database/premium.json"))
const owner = JSON.parse(fs.readFileSync('./lib/database/owner.json'))

const args = body.trim().split(/ +/).slice(1);
const full_args = body.replace(command, '').slice(1).trim();
const pushname = m?.pushName || "No Name";
const botNumber = await fluxx.decodeJid(fluxx.user.id);
const isOwner = (m && m?.sender && [botNumber, ...owner, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m?.sender)) || false;
const itsMe = (m && m?.sender && m?.sender == botNumber) || false;
const text = q = args.join(" ");
const fatkuns = m && (m?.quoted || m);
const quoted = (fatkuns?.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] :
(fatkuns?.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] :
(fatkuns?.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] :
m?.quoted || m;
const mime = ((quoted?.msg || quoted) || {}).mimetype || '';
const qmsg = (quoted?.msg || quoted);
const isMedia = /image|video|sticker|audio/.test(mime);
const thisfile = path.basename(__filename, '.js')
const watchDir = path.join(__dirname)

//================== [ GROUP ] ==================//
const groupMetadata = m?.isGroup ? await fluxx.groupMetadata(m?.chat).catch(e => {}) : {};
const groupName = m?.isGroup ? groupMetadata.subject || '' : '';
const participants = m?.isGroup ? await groupMetadata.participants || [] : [];
const groupAdmins = m?.isGroup ? await getGroupAdmins(participants) || [] : [];
const isBotAdmins = m?.isGroup ? groupAdmins.includes(botNumber) : false;
const isAdmins = m?.isGroup ? groupAdmins.includes(m?.sender) : false;
const groupOwner = m?.isGroup ? groupMetadata.owner || '' : '';
const isGroupOwner = m?.isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m?.sender) : false;
const isGroup = m.isGroup;

//================== [ TIME ] ==================//
const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')
const wib = moment.tz('Asia/Jakarta').format('HH : mm : ss')
const wit = moment.tz('Asia/Jayapura').format('HH : mm : ss')
const wita = moment.tz('Asia/Makassar').format('HH : mm : ss')

const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
        if(time2 < "23:59:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ᴍᴀʟᴀᴍ️'
        }
        if(time2 < "19:00:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ᴘᴇᴛᴀɴɢ'
        }
        if(time2 < "18:00:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ꜱᴏʀᴇ'
        }
        if(time2 < "15:00:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ꜱɪᴀɴɢ️'
        }
        if(time2 < "10:00:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ᴘᴀɢɪ'
        }
        if(time2 < "05:00:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ꜱᴜʙᴜʜ'
        }
        if(time2 < "03:00:00"){
        var ucapanWaktu = 'ꜱᴇʟᴀᴍᴀᴛ ᴛᴇɴɢᴀʜ ᴍᴀʟᴀᴍ'
        }

//================== [ DATABASE ] ==================//

const _loadDatabase = require('./handler')
await _loadDatabase.database_loader(m, botNumber)

const userdb = global.db.data.users[m.sender]
const settingdb = global.db.data.settings[botNumber]
const chatdb = global.db.data.chats[m.chat]

const isBan = chatdb.isBanned
const rOwner = m.sender === global.owner
const isPremium = prem.includes(m.sender)

//================== [ HOT RELOAD ] ==================//
chokidar.watch(watchDir, {
  ignored: /(^|[\/\\])\..|node_modules|case|lowdb|\.tmp|session|\.bak|database/,
  persistent: true,
  ignoreInitial: true
}).on('change', filePath => {
  try {
    const resolvedPath = require.resolve(filePath)
    delete require.cache[resolvedPath]
    require(resolvedPath)
  } catch {}
})
//================== [ PLUGIN ] ==================//
const pluginCjsDir = path.resolve(__dirname, "./plugins");
const helper = { fluxx, isOwner, pushname, command, isCmd, text, runtime, qmsg, mime, prefix, botNumber, isPremium, isBan, userdb, chatdb, settingdb };

const pluginsLoader = async (directory) => {
  const plugins = [];
  const files = fs.readdirSync(directory);
  for (let file of files) {
    const plugdir = path.join(directory, file);
    if (plugdir.endsWith(".js")) {
      try {
        const resolvedPath = require.resolve(plugdir);
        if (require.cache[resolvedPath]) delete require.cache[resolvedPath];
        const plugin = require(plugdir);
        plugins.push(plugin);
      } catch (err) {
        ptz.logger.error(`Plugin ${plugdir}: `, err);
      }
    }
  }
  return plugins;
};

let pluginsDisable = true;
const cjsPlugins = await pluginsLoader(pluginCjsDir);
for (let plugin of cjsPlugins) {
  if (!plugin.command?.find(e => e === command.toLowerCase())) continue;
  pluginsDisable = false;
  if (typeof plugin !== "function") continue;
  await plugin(m, helper);
}
if (!pluginsDisable) return;

//================== [ CONTRARY TO CMD ] ==================//
const getCommandCase = (name) => {
  try {
    const code = fs.readFileSync('./case.js', 'utf8');
    const parts = code.split(new RegExp(`case ['"]${name}['"]`));
    if (parts.length > 1) {
      return `case '${name}'${parts[1].split('break')[0]}break`;
    }
    return 'none';
  } catch {
    return 'none';
  }
};

let mean, didYouMeanText, userepu, unp

async function spawnDidYou(input) {
  try {
    const code = fs.readFileSync('./case.js', 'utf8');
    const matches = [...code.matchAll(/case\s+['"]([^'"]+)['"]:/g)].map(m => m[1]);
    const commands = matches.map(v => v.trim().split(' ')[0].toLowerCase()).filter(Boolean);

 if (!commands.includes(input) && !budy.startsWith('$') && !budy.startsWith('=>') && !budy.startsWith('>')) {
  const mean = didyoumean(input, commands);
  const sim = similarity(input, mean || '');
  const percentage = parseInt(sim * 100);

  if (mean.toLowerCase() !== input.toLowerCase()) {
    const didYouMeanText = `*\`[ COMMAND TIDAK ADA ]\`*\n\nMungkin yang Anda maksud adalah: *.${mean}*\n- Persentase: *${percentage}%*`;
    return m.reply(didYouMeanText);
  }
}
} catch {}
}

async function totalFitur() {
  const code = fs.readFileSync('./case.js', 'utf8');
  const count1 = (code.match(/case '/g) || []).length;
  const count2 = (code.match(/case "/g) || []).length;
  return count1 + count2;
}

if (isCmd && m.text.startsWith(prefix)) {
  if (body.length === 1) return;

  const commandCase = await getCommandCase(command);
  if (!command || commandCase === 'none') return spawnDidYou(command);
  if (isBan) {
  if (!isOwner) {
  if (isGroup) return
  return m.reply(mess.banned);
  }
  }
}

//================== [ MORE OPTIONS ] ==================//
const isTrue = (status) => text === 'on' === status;
const sendcontact = async (nomorList, atas) => {
let kontakArray = []
if (atas) {
await kontakArray.push(atas)
}

for (let no of nomorList) {
  let name = await fluxx.getName(no)
  kontakArray.push([no, name])
}

fluxx.sendContact(m.chat, kontakArray, m)
}

if (settingdb.autoread) {
fluxx.readMessages([m.key])
}

if (!prem.includes(global.owner)) {
prem.push(global.owner)
fs.writeFileSync("./lib/database/premium.json", JSON.stringify(prem))
}

if (m.message) {
fluxx.logger.info(m.text)
}

switch (command) {
//================= [ COMMAND - CASE ] ================//
    case 'readchange':
    case 'autoread': {
        if (!isOwner) return m.reply(mess.owner)
        if (args.length < 1) return m.reply(`Contoh ${prefix + command} on/off`)
        if (q === 'on') {
            if (isTrue(settingdb.autoread)) return
            settingdb.autoread = true
            m.reply(`Berhasil mengubah autoread ke ${q}`)
        } else if (q === 'off') {
            if (isTrue(settingdb.autoread)) return
            settingdb.autoread = false
            m.reply(`Berhasil mengubah autoread ke ${q}`)
        }
    }
    break
    //=================================================//
    case "restart": case "shutdown":
    await m.reply("Tunggu beberapa detik dan "+conmand+" telah berhasil")
    setTimeout(() => {
    if (command == "restart") {
    process.send("reset")
    } else {
    process.exit(2)
    }}, 3000)
    break
    //=================================================//
    case "addprem": {
        if (!isOwner) return m.reply(mess.owner)
        if (!args[0]) return m.reply(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} 628xxxxxxxx`)
        userepu = q.split("|")[0].replace(/[^0-9]/g, '')
        let ceknya = await fluxx.onWhatsApp(userepu)
        if (ceknya.length == 0) return m.reply(`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
        prem.push(userepu)
        fs.writeFileSync("./lib/database/premium.json", JSON.stringify(prem))
        m.reply(`Nomor ${userepu} Telah Menjadi Premium!`)
    }
    break
    //=================================================//
    case "delprem": {
        if (!isOwner) return m.reply(mess.owner)
        if (!args[0]) return m.reply(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} 628xxxxxxxx`)
        userepu = q.split("|")[0].replace(/[^0-9]/g, '') + `@s.whatsapp.net`
        unp = prem.indexOf(userepu)
        prem.splice(unp, 1)
        fs.writeFileSync("./lib/database/premium.json", JSON.stringify(prem))
        m.reply(`Nomor ${userepu} Telah Di Hapus Premium!`)
    }
    break
    //=================================================//    
    case 'listprem': {
        const pemilik = [global.owner, "Owner"]
        sendcontact(prem)
    }
    break
    //=================================================//    
    case 'addowner': {
        if (!isOwner) return m.reply(mess.owner)
        if (!args[0]) return m.reply(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} 68xxxxxxxx`)
        userepu = text.replace(/[^0-9]/g, '')
        let cek1 = await fluxx.onWhatsApp(userepu + `@s.whatsapp.net`)
        if (cek1.length == 0) return (`Masukkan Nomor Yang Valid Dan Terdaftar Di WhatsApp!!!`)
        owner.push(userepu)
        fs.writeFileSync('./lib/database/owner.json', JSON.stringify(owner))
        if (!prem.includes(userepu)) {
            prem.push(userepu)
            fs.writeFileSync("./lib/database/premium.json", JSON.stringify(prem))
        }
        m.reply(`*${userepu} Telah menjadi owner dan premium*`)
    }
    break
    //=================================================//    
    case 'delowner': {
        if (!isOwner) return m.reply(mess.owner)
        if (!args[0]) return m.reply(`Penggunaan ${prefix+command} nomor\nContoh ${prefix+command} 68xxxxxxxx`)
        userepu = text.replace(/[^0-9]/g, '')
        unp = owner.indexOf(userepu)
        owner.splice(unp, 1)
        fs.writeFileSync('./lib/database/owner.json', JSON.stringify(owner))
        if (prem.includes(userepu)) {
            let uunp = prem.indexOf(userepu)
            prem.splice(uunp, 1)
            fs.writeFileSync("./lib/database/premium.json", JSON.stringify(prem))
        }
        m.reply(`*${userepu} Tidak lagi Menjadi owner dan premium*`)
    }
    break
    //=================================================//    
    case "dev":
    case 'owner':
    case 'creator': {
        const realit = [global.owner, "Real Owner"]
        sendcontact(owner, realit)
    }
    break
    //=================================================//    
    case 'banned': {
        if (!isOwner) return m.reply(mess.owner)
        if (args[0] === "add") {
            if (isBan) return m.reply('*Chat Ini telah Di Ban*')
            chatdb.isBanned = true
            m.reply(`Succes ban Chat Ini`)
        } else if (args[0] === "remove") {
            if (!isBan) return m.reply('*Chat Ini Telah Di hapus Dari Ban*')
            chatdb.isBanned = false
            m.reply(`*Berhasil Menghapus Chat yang Di Ban*`)
        } else {
            m.reply("add or remove")
        }
    }
    break
    //=================================================//
    case "add": {
        if (m?.isGroup && !isAdmins && !isGroupOwner && isBotAdmins) return
        if (!text && !m?.quoted) m?.reply('masukkan nomor yang ingin di tambahkan')
        let users = m?.quoted ? m?.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await fluxx.groupParticipantsUpdate(m?.chat, [users], 'add').catch(console.log)
    }
    break
    //=================================================//
    case "kick": {
        if (m?.isGroup && !isAdmins && !isGroupOwner && isBotAdmins) return
        if (!text && !m?.quoted) m?.reply('masukkan nomor yang ingin di kick')
        let users = m?.quoted ? m?.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await fluxx.groupParticipantsUpdate(m?.chat, [users], 'remove').catch(console.log)
    }
    break
    //=================================================//
    case "promote": {
        if (m?.isGroup && !isAdmins && !isGroupOwner && isBotAdmins) return
        if (!text && !m?.quoted) m?.reply('masukkan nomor yang ingin di promote')
        let users = m?.quoted ? m?.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await fluxx.groupParticipantsUpdate(m?.chat, [users], 'promote').catch(console.log)
    }
    break
    //=================================================//
    case "demote": {
        if (m?.isGroup && !isAdmins && !isGroupOwner && isBotAdmins) return
        if (!text && !m?.quoted) m?.reply('masukkan nomor yang ingin di demote')
        let users = m?.quoted ? m?.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
        await fluxx.groupParticipantsUpdate(m?.chat, [users], 'demote').catch(console.log)
    }
    break
    //=================================================//
    case "stickers": case "s": {
        if (!text) return m.reply(`Ex : ${prefix + command} kucing`);
        const anu = await stickersearch(text);
        const shuffledStickers = anu.sticker.sort(() => Math.random() - 0.5);
        const randomStickers = shuffledStickers.slice(0, 10);

        if (randomStickers.length > 0) {
            for (let i = 0; i < randomStickers.length; i++) {
                try {
                    await new Promise(resolve => setTimeout(resolve, i * 6000));
                    await fluxx.sendImageAsSticker(m?.chat, randomStickers[i], m, {
                        packname: global.packname,
                        author: global.author
                    });
                } catch (error) {
                    ptz.logger.error(`${error.message}`);
                    await m?.reply(`Failed to send sticker *(${i + 1}/${randomStickers.length})*`);
                }
            }
        }
    }
    break
    //=================================================//
    case "tr": {
        let lang, text
        if (args.length >= 2) {
            lang = args[0] ? args[0] : 'id', text = args.slice(1).join(' ')
        } else if (m?.quoted && m?.quoted.text) {
            lang = args[0] ? args[0] : 'id', text = m?.quoted.text
        } else throw `Ex: ${usedPrefix + command} id hello i am robot`
        const translate = require('@vitalets/google-translate-api')
        let res = await translate(text, {
            to: lang,
            autoCorrect: true
        }).catch(_ => null)
        if (!res) return m?.reply(`Error : Bahasa"${lang}" Tidak Support`)
        m?.reply(`*Terdeteksi Bahasa:* ${res.from?.language.iso}\n*Ke Bahasa:* ${lang}\n\n*Terjemahan:* ${res.text}`.trim())
    }
    break
    //=================================================//
    case "kalkulator": {
        val = text
            .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π|pi/gi, 'Math.PI')
            .replace(/e/gi, 'Math.E')
            .replace(/\/+/g, '/')
            .replace(/\++/g, '+')
            .replace(/-+/g, '-')
        let format = val
            .replace(/Math\.PI/g, 'π')
            .replace(/Math\.E/g, 'e')
            .replace(/\//g, '÷')
            .replace(/\*×/g, '×')
        try {
            let result = (new Function('return ' + val))()
            if (!result) throw result
            m?.reply(`*${format}* = _${result}_`)
        } catch (e) {
            if (e == undefined) return m?.reply('Isinya?')
            m?.reply('Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport')
        }
    }
    break
    //=================================================//
    case "jarak": {
        var [from, to] = text.split`|`
        if (!(from && to)) return m.reply(`Ex: ${prefix + command} jakarta|bandung`)
        var data = await jarak(from, to)
        if (data.img) return fluxx.sendMessage(m?.chat, {
            image: data.img,
            caption: data.desc
        }, {
            quoted: m
        })
        else m?.reply(data.desc)
    }
    break
    //=================================================//
    case 'cls': {
        if (!m?.quoted) return m?.reply('Reply with a sticker!')
        let stiker = false
        try {
            let [packname, ...author] = text.split('|')
            author = (author || []).join('|')
            let mime = m?.quoted.mimetype || ''
            if (!/webp/.test(mime)) throw 'Reply with a sticker!'
            let img = await m?.quoted.download()
            if (!img) throw 'Failed to download sticker!'
            stiker = await addExif(img, packname || global.packname, author || global.author)
        } catch (e) {
            fluxx.logger.error(e)
            if (Buffer.isBuffer(e)) stiker = e
            else throw 'An error occurred: ' + e
        } finally {
            if (stiker) fluxx.sendFile(m?.chat, stiker, 'wms.webp', '', m, false, {
                asSticker: true
            })
            else throw 'Conversion failed'
        }
    }
    break
    //=================================================//
    case 'tts': {
        if (!text) return m?.reply(`[ ! ] ${prefix}${command} halo world`)
        const a = await (await axios.post("https://gesserit.co/api/tiktok-tts", {
            text: text,
            voice: "id_001"
        }, {
            headers: {
                Referer: "https://gesserit.co/tiktok",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                responseType: "arraybuffer"
            }
        })).data
        const b = Buffer.from(a.audioUrl)
        fluxx.sendMessage(m?.chat, {
            audio: Buffer.from(a.audioUrl.split("base64,")[1], "base64"),
            mimetype: "audio/mpeg"
        })
    }
    break
    //=================================================//
    case 'remini': {
        if (!quoted) return m?.reply(`Balas Image Dengan Caption ${prefix + command}`)
        if (!/image/.test(mime)) return m?.reply("hanya support gambar")
        let media = await quoted.download()
        const This = await remini(media, "enhance");
        fluxx.sendFile(m?.chat, This, "", "Done", m);
    }
    break
    //=================================================//
    case "get": {
        if (!/^https?:\/\//.test(text)) return m?.reply('Awali *URL* dengan http:// atau https://')
        let linknyaurl = await shorturl(text)
        let _url = new URL(text)
        let url = `${_url.origin}${_url.pathname}${_url.search}`;
        let res = await fetch(url)
        if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
            delete res
            throw `Content-Length: ${res.headers.get('content-length')}`
        }
        if (!/text|json/.test(res.headers.get('content-type'))) return fluxx.sendFile(m?.chat, url, 'file', `*Link:* ${linknyaurl}\n\n2024 © PutuOfc`, m)
        let txt = await res.buffer()
        try {
            txt = util.format(JSON.parse(txt + ''))
        } catch (e) {
            txt = txt + ''
        } finally {
            m?.reply(txt.slice(0, 65536) + '')
        }
    }
    break
    //=================================================//
    case 'readvo':
    case 'readviewonce': {
        if (!m?.quoted) return m?.reply('reply gambar/video yang ingin Anda lihat')
        if (m?.quoted.mtype !== 'viewOnceMessageV2') return m?.reply('Ini bukan pesan view-once.')
        let msg = m?.quoted.message
        let type = Object.keys(msg)[0]
        const {
            downloadContentFromMessage
        } = require('@adiwajshing/baileys')
        let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
        let buffer = Buffer.from([])
        for await (const chunk of media) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (/video/.test(type)) {
            return fluxx.sendFile(m?.chat, buffer, 'media.mp4', msg[type].caption || '', m)
        } else if (/image/.test(type)) {
            return fluxx.sendFile(m?.chat, buffer, 'media.jpg', msg[type].caption || '', m)
        }
    }
    break
    //=================================================//
    case 'qc': {
        let text
        if (args.length >= 1) {
            text = args.slice(0).join(" ")
        } else if (m?.quoted && m?.quoted.text) {
            text = m?.quoted.text
        } else m?.reply("Input teks atau reply teks yang ingin di jadikan quote!")
        if (!text) return m?.reply('masukan text')
        if (text.length > 30) return m?.reply('Maksimal 30 Teks!')
        let ppnyauser = await await fluxx.profilePictureUrl(m?.sender, 'image').catch(_ => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')
        const rest = await quote(text, pushname, ppnyauser)
        fluxx.sendImageAsSticker(m?.chat, rest.result, m, {
            packname: `${global.packname}`,
            author: `${global.author}`
        })
    }
    break
    //=================================================//
    case 'sticker':
    case 'stiker':
    case 's': {
        if (!quoted) return m?.reply(`Balas Video/Image Dengan Caption ${prefix + command}`)
        if (/image/.test(mime)) {
            let media = await quoted.download()
            let encmedia = await fluxx.sendImageAsSticker(m?.chat, media, m, {
                packname: global.packname,
                author: global.author
            })
            await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 11) return m?.reply('Maksimal 10 detik!')
            let media = await quoted.download()
            let encmedia = await fluxx.sendVideoAsSticker(m?.chat, media, m, {
                packname: global.packname,
                author: global.author
            })
            await fs.unlinkSync(encmedia)
        } else {
            return m?.reply(`Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`)
        }
    }
    break
    //=================================================//
    case 'swm': {
        let [teks1, teks2] = text.split`|`
        if (!teks1) return m?.reply(`Kirim/reply image/video dengan caption ${prefix + command} teks1|teks2`)
        if (!teks2) return m?.reply(`Kirim/reply image/video dengan caption ${prefix + command} teks1|teks2`)
        if (/image/.test(mime)) {
            let media = await fluxx.downloadMediaMessage(qmsg)
            let encmedia = await fluxx.sendImageAsSticker(m?.chat, media, m, {
                packname: teks1,
                author: teks2
            })
            await fs.unlinkSync(encmedia)
        } else if (/video/.test(mime)) {
            if ((quoted.msg || quoted).seconds > 11) return m?.reply('Maksimal 10 detik!')
            let media = await fluxx.downloadMediaMessage(qmsg)
            let encmedia = await fluxx.sendVideoAsSticker(m?.chat, media, m, {
                packname: teks1,
                author: teks2
            })
            await fs.unlinkSync(encmedia)
        } else {
            return m?.reply(`Kirim Gambar/Video Dengan Caption ${prefix + command}\nDurasi Video 1-9 Detik`)
        }
    }
    break
    
    //============ [ IF STATEMENT - DEFAULT ] ============//
    default:
        if (budy.startsWith('=>')) {
            if (!isOwner) return

            function Return(sul) {
                sat = JSON.stringify(sul, null, 2)
                bang = util.format(sat)
                if (sat == undefined) {
                    bang = util.format(sul)
                }
                return m?.reply(bang)
            }
            try {
                m?.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
            } catch (e) {
                m?.reply(String(e))
            }
        }

        if (budy.startsWith('>')) {
            if (!isOwner) return
            let kode = budy.trim().split(/ +/)[0]
            let teks
            try {
                teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
            } catch (e) {
                teks = e
            } finally {
                await m?.reply(require('util').format(teks))
            }
        }

        if (budy.startsWith('$')) {
            if (!isOwner) return
            exec(budy.slice(2), (err, stdout) => {
                if (err) return m?.reply(`${err}`)
                if (stdout) return m?.reply(stdout)
            })
        }
}
} catch (err) {
    fluxx.logger.error(util.format(err))
}
}

let file = require.resolve(__filename)
 fs.watchFile(file, () => {
     fs.unwatchFile(file)
     delete require.cache[file]
     require(file)
 })