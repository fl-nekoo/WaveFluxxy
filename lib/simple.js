/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

const {
    default: makeWASocket,
    makeWALegacySocket,
    extractMessageContent,
    makeInMemoryStore,
    proto,
    prepareWAMessageMedia,
    downloadContentFromMessage,
    getBinaryNodeChild,
    jidDecode,
    useMultiFileAuthState,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    getContentType,
    delay,
    makeCacheableSignalKeyStore,
    WAMessageStubType,
    WA_DEFAULT_EPHEMERAL,
} = require('@adiwajshing/baileys')
const {
    toAudio,
    toPTT,
    toVideo
} = require('./converter')
const chalk = require('chalk')
const fetch = require("node-fetch")
const FileType = require('file-type')
const moment = require("moment-timezone")
const PhoneNumber = require('awesome-phonenumber')
const fs = require('fs')
const path = require('path')
let Jimp = require('jimp')
const pino = require('pino')
const {
    store,
    logger
} = require('./store')
const {
    imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} = require('./exif')
const ephemeral = {
    ephemeralExpiration: 8600
}
const {
    sizeFormatter
} = require('human-readable');
const {
    connect
} = require("./connection")
const {
    Boom
} = require("@hapi/boom");
const wib = moment.tz('Asia/Jakarta').format('HH : mm : ss')
const wit = moment.tz('Asia/Jayapura').format('HH : mm : ss')
const wita = moment.tz('Asia/Makassar').format('HH : mm : ss')
const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
const hariini = moment.tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')
const hari = `${hariini} - ${time2}`

const smsg = async (fluxx, m) => {
    try {
        if (!m) return m;
        let M = proto.WebMessageInfo;
        if (m.key) {
            m.id = m.key.id;
            m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
            m.chat = m.key.remoteJid;
            m.fromMe = m.key.fromMe;
            m.isGroup = m.chat.endsWith('@g.us');
            m.sender = fluxx.decodeJid(m.fromMe && fluxx.user.id || m.participant || m.key.participant || m.chat || '');
            if (m.isGroup) m.participant = fluxx.decodeJid(m.key.participant) || '';
        }
        if (m.message) {
            m.mtype = getContentType(m.message);
            m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype]);
            m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text;
            let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null;
            m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
            if (m.msg.caption) {
                m.caption = m.msg.caption;
            }
            if (m.quoted) {
                let type = Object.keys(m.quoted)[0];
                m.quoted = m.quoted[type];
                if (['productMessage'].includes(type)) {
                    type = Object.keys(m.quoted)[0];
                    m.quoted = m.quoted[type];
                }
                if (typeof m.quoted === 'string') m.quoted = {
                    text: m.quoted
                };
                m.quoted.mtype = type;
                m.quoted.id = m.msg.contextInfo.stanzaId;
                m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat;
                m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false;
                m.quoted.sender = fluxx.decodeJid(m.msg.contextInfo.participant);
                m.quoted.fromMe = m.quoted.sender === fluxx.decodeJid(fluxx.user.id);
                m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || '';
                m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : [];
                m.getQuotedObj = m.getQuotedMessage = async () => {
                    if (!m.quoted.id) return false;
                    let q = await store.loadMessage(m.chat, m.quoted.id, fluxx);
                    return smsg(fluxx, q, store);
                };
                let vM = m.quoted.fakeObj = M.fromObject({
                    key: {
                        remoteJid: m.quoted.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id
                    },
                    message: quoted,
                    ...(m.isGroup ? {
                        participant: m.quoted.sender
                    } : {})
                });
                m.quoted.delete = () => fluxx.sendMessage(m.quoted.chat, {
                    delete: vM.key
                });
                m.quoted.copyNForward = (jid, forceForward = false, options = {}) => fluxx.copyNForward(jid, vM, forceForward, options);
                m.quoted.download = () => fluxx.downloadMediaMessage(m.quoted);
            }
        }
        if (m.msg.url) m.download = () => fluxx.downloadMediaMessage(m.msg);
        m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || '';
       m.reply = (text, chatId = m.chat, options = {}) => {
  if (Buffer.isBuffer(text)) {
    return fluxx.sendMedia(chatId, text, 'file', '', m, { ...options });
  }
  const safeText = typeof text === 'string' ? text : String(text);
  return fluxx.sendText(chatId, safeText, m, { ...options });
};
        m.copy = () => smsg(fluxx, M.fromObject(M.toObject(m)));
        m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => fluxx.copyNForward(jid, m, forceForward, options);
        fluxx.appenTextMessage = async (text, chatUpdate) => {
            let messages = await generateWAMessage(m.chat, {
                text: text,
                mentions: m.mentionedJid
            }, {
                userJid: fluxx.user.id,
                quoted: m.quoted && m.quoted.fakeObj
            });
            messages.key.fromMe = areJidsSameUser(m.sender, fluxx.user.id);
            messages.key.id = m.key.id;
            messages.pushName = m.pushName;
            if (m.isGroup) messages.participant = m.sender;
            let msg = {
                ...chatUpdate,
                messages: [proto.WebMessageInfo.fromObject(messages)],
                type: 'append'
            };
            fluxx.ev.emit('messages.upsert', msg);
        };

        return m;
    } catch (e) {

    }
};

const tocase = async (chatUpdate, fluxx) => {
    const mek = chatUpdate.messages[0]
    if (!mek.message) return
    mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        await fluxx.readMessages([mek.key])
    }
    if (!fluxx.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
    if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
    const m = await smsg(fluxx, mek, store)
    require("../case")(fluxx, m, chatUpdate, store)
}

const newSockets = async (start, connectionOptions, options = {}) => {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState("./lib/system/session")
    const auth = {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
    }

    let Corener = {
        ...connectionOptions,
        auth,
        logger,
    }
    let fluxx = await makeWASocket(Corener)

    fluxx.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
        } else return jid;
    };

    if (fluxx.user && fluxx.user.id) fluxx.user.jid = fluxx.decodeJid(fluxx.user.id)
    if (!fluxx.chats) fluxx.chats = {}

    function updateNameToDb(contacts) {
        if (!contacts) return
        for (const contact of contacts) {
            const id = fluxx.decodeJid(contact.id)
            if (!id) continue
            let chats = fluxx.chats[id]
            if (!chats) chats = fluxx.chats[id] = {
                id
            }
            fluxx.chats[id] = {
                ...chats,
                ...({
                    ...contact,
                    id,
                    ...(id.endsWith('@g.us') ? {
                        subject: contact.subject || chats.subject || ''
                    } : {
                        name: contact.notify || chats.name || chats.notify || ''
                    })
                } || {})
            }
        }
    }


    store.bind(fluxx.ev);
    fluxx.ev.on('messages.upsert', async (chatUpdate) => {
        tocase(chatUpdate, fluxx, store)
    });

    fluxx.ev.on('contacts.update', (update) => {
        for (let contact of update) {
            let id = fluxx.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            };
        }
    });

    fluxx.ev.on('creds.update', saveCreds);

    fluxx.ev.on('connection.update', async (update) => {
        connect(update, fluxx, start)
    })

    fluxx.ev.on('contacts.upsert', updateNameToDb)
    fluxx.ev.on('groups.update', updateNameToDb)
    fluxx.ev.on('chats.set', async ({
        chats
    }) => {
        for (const {
                id,
                name,
                readOnly
            }
            of chats) {
            id = fluxx.decodeJid(id)
            if (!id) continue
            const isGroup = id.endsWith('@g.us')
            let chats = fluxx.chats[id]
            if (!chats) chats = fluxx.chats[id] = {
                id
            }
            chats.isChats = !readOnly
            if (name) chats[isGroup ? 'subject' : 'name'] = name
            if (isGroup) {
                const metadata = await fluxx.groupMetadata(id).catch(_ => null)
                if (!metadata) continue
                chats.subject = name || metadata.subject
                chats.metadata = metadata
            }
        }
    })
    fluxx.ev.on('group-participants.update', async function updateParticipantsToDb({
        id,
        participants,
        action
    }) {
        id = fluxx.decodeJid(id)
        if (!(id in fluxx.chats)) fluxx.chats[id] = {
            id
        }
        fluxx.chats[id].isChats = true
        const groupMetadata = await fluxx.groupMetadata(id).catch(_ => null)
        if (!groupMetadata) return
        fluxx.chats[id] = {
            ...fluxx.chats[id],
            subject: groupMetadata.subject,
            metadata: groupMetadata
        }
    })

    fluxx.ev.on('groups.update', async function groupUpdatePushToDb(groupsUpdates) {
        for (const update of groupsUpdates) {
            const id = fluxx.decodeJid(update.id)
            if (!id) continue
            const isGroup = id.endsWith('@g.us')
            if (!isGroup) continue
            let chats = fluxx.chats[id]
            if (!chats) chats = fluxx.chats[id] = {
                id
            }
            chats.isChats = true
            const metadata = await fluxx.groupMetadata(id).catch(_ => null)
            if (!metadata) continue
            chats.subject = metadata.subject
            chats.metadata = metadata
        }
    })
    fluxx.ev.on('chats.upsert', async function chatsUpsertPushToDb(chatsUpsert) {
        const {
            id,
            name
        } = chatsUpsert
        if (!id) return
        let chats = fluxx.chats[id] = {
            ...fluxx.chats[id],
            ...chatsUpsert,
            isChats: true
        }
        const isGroup = id.endsWith('@g.us')
        if (isGroup) {
            const metadata = await fluxx.groupMetadata(id).catch(_ => null)
            if (metadata) {
                chats.subject = name || metadata.subject
                chats.metadata = metadata
            }
            const groups = await fluxx.groupFetchAllParticipating().catch(_ => ({})) || {}
            for (const group in groups) fluxx.chats[group] = {
                id: group,
                subject: groups[group].subject,
                isChats: true,
                metadata: groups[group]
            }
        }
    })
    fluxx.ev.on('presence.update', async function presenceUpdatePushToDb({
        id,
        presences
    }) {
        const sender = Object.keys(presences)[0] || id
        const _sender = fluxx.decodeJid(sender)
        const presence = presences[sender]['lastKnownPresence'] || 'composing'
        let chats = fluxx.chats[_sender]
        if (!chats) chats = fluxx.chats[_sender] = {
            id: sender
        }
        chats.presences = presence
        if (id.endsWith('@g.us')) {
            let chats = fluxx.chats[id]
            if (!chats) {
                const metadata = await fluxx.groupMetadata(id).catch(_ => null)
                if (metadata) chats = fluxx.chats[id] = {
                    id,
                    subject: metadata.subject,
                    metadata
                }
            }
            chats.isChats = true
        }
    })


    fluxx.logger = {
        ...fluxx.logger,
        info(...args) { console.log(chalk.cyan.bold(`INFO [${chalk.rgb(255, 255, 255)(hari)}]: `), chalk.cyan(...args)) },
        error(...args) { console.log(chalk.bold.rgb(247, 38, 33)(`ERROR [${chalk.rgb(255, 255, 255)(hari)}]: `), chalk.rgb(255, 38, 0)(...args)) },
        warn(...args) { console.log(chalk.bold.rgb(239, 225, 3)(`WARNING [${chalk.rgb(255, 255, 255)(hari)}]: `), chalk.keyword('orange')(...args)) }
    }

    /**
     * getBuffer hehe
     * @param {fs.PathLike} path
     * @param {Boolean} returnFilename
     */
    fluxx.getFile = async (PATH, returnAsFilename) => {
        let res, filename
        const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        const type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
        return {
            res,
            filename,
            ...type,
            data,
            deleteFile() {
                return filename && fs.promises.unlink(filename)
            }
        }
    }


    /**
     * waitEvent
     * @param {Partial<BaileysEventMap>|String} eventName 
     * @param {Boolean} is 
     * @param {Number} maxTries 
     * @returns 
     */
    fluxx.waitEvent = (eventName, is = () => true, maxTries = 25) => {
        return new Promise((resolve, reject) => {
            let tries = 0
            let on = (...args) => {
                if (++tries > maxTries) reject('Max tries reached')
                else if (is()) {
                    fluxx.ev.off(eventName, on)
                    resolve(...args)
                }
            }
            fluxx.ev.on(eventName, on)
        })
    }
    
  fluxx.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
     
   /**
     * 
     * @param {String} text 
     * @returns 
     */
    fluxx.filter = (text) => {
      let mati = ["q", "w", "r", "t", "y", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]
      if (/[aiueo][aiueo]([qwrtypsdfghjklzxcvbnm])?$/i.test(text)) return text.substring(text.length - 1)
      else {
        let res = Array.from(text).filter(v => mati.includes(v))
        let resu = res[res.length - 1]
        for (let huruf of mati) {
            if (text.endsWith(huruf)) {
                resu = res[res.length - 2]
            }
        }
        let misah = text.split(resu)
        return resu + misah[misah.length - 1]
      }
    }
    
    /**
     * ms to date
     * @param {String} ms
     */
    fluxx.msToDate = (ms) => {
      let days = Math.floor(ms / (24 * 60 * 60 * 1000));
      let daysms = ms % (24 * 60 * 60 * 1000);
      let hours = Math.floor((daysms) / (60 * 60 * 1000));
      let hoursms = ms % (60 * 60 * 1000);
      let minutes = Math.floor((hoursms) / (60 * 1000));
      let minutesms = ms % (60 * 1000);
      let sec = Math.floor((minutesms) / (1000));
      return days + " Hari " + hours + " Jam " + minutes + " Menit";
    }
    
     /**
    * isi
    */
    fluxx.rand = async (isi) => {
        return isi[Math.floor(Math.random() * isi.length)]
    }
    
    /**
    * Send Media All Type 
    * @param {String} jid
    * @param {String|Buffer} path
    * @param {Object} quoted
    * @param {Object} options 
    */
    fluxx.sendMedia = async (jid, path, quoted, options = {}) => {
        let { ext, mime, data } = await fluxx.getFile(path)
        messageType = mime.split("/")[0]
        pase = messageType.replace('application', 'document') || messageType
        return await fluxx.sendMessage(jid, { [`${pase}`]: data, mimetype: mime, ...options }, { quoted })
    }
    
    fluxx.adReply = (jid, text, title = '', body = '', buffer, source = '', quoted, options) => {
                let { data } = fluxx.getFile(buffer, true)
                return fluxx.sendMessage(jid, { text: text, 
                    contextInfo: {
                        mentionedJid: fluxx.parseMention(text),
                        externalAdReply: {
                            showAdAttribution: true,
                            mediaType: 1,
                            title: title,
                            body: body,
                            thumbnailUrl: 'https://telegra.ph/file/dc25ebc5fe9ccf01.jpg',
                            renderLargerThumbnail: true,
                            sourceUrl: source
                        }
                    }
                }, { quoted: quoted, ...options, ...ephemeral })
                
                enumerable: true
            },

    /**
    * Send Media/File with Automatic Type Specifier
    * @param {String} jid
    * @param {String|Buffer} path
    * @param {String} filename
    * @param {String} caption
    * @param {proto.WebMessageInfo} quoted
    * @param {Boolean} ptt
    * @param {Object} options
    */
    fluxx.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await fluxx.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } }
            catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '', mimetype = type.mime, convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) (
            convert = await (ptt ? toPTT : toAudio)(file, type.ext),
            file = convert.data,
            pathFile = convert.filename,
            mtype = 'audio',
            mimetype = 'audio/ogg; codecs=opus'
        )
        else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: { url: pathFile },
            mimetype
        }
        let m
        try {
            m = await fluxx.sendMessage(jid, message, { ...opt, ...options })
        } catch (e) {
            console.error(e)
            m = null
        } finally {
            if (!m) m = await fluxx.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
            return m
        }
    }

     fluxx.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await fluxx.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
    
    /**
     * Send Contact
     * @param {String} jid 
     * @param {String} number 
     * @param {String} name 
     * @param {Object} quoted 
     * @param {Object} options 
     */
     fluxx.sendContact = async (jid, data, quoted, options) => {
                if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
                let contacts = []
                for (let [number, name] of data) {
                    number = number.replace(/[^0-9]/g, '')
                    let njid = number + '@s.whatsapp.net'
                    let biz = await fluxx.getBusinessProfile(njid).catch(_ => null) || {}
                    let vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${name.replace(/\n/g, '\\n')}
ORG:
item1.TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
item1.X-ABLabel:Ponsel${biz.description ? `
item2.EMAIL;type=INTERNET:${(biz.email || '').replace(/\n/g, '\\n')}
item2.X-ABLabel:Email
PHOTO;BASE64:${(await fluxx.getFile(await fluxx.profilePictureUrl(njid)).catch(_ => ({})) || {}).number?.toString('base64')}
X-WA-BIZ-DESCRIPTION:${(biz.description || '').replace(/\n/g, '\\n')}
X-WA-BIZ-NAME:${name.replace(/\n/g, '\\n')}
` : ''}
END:VCARD
`.trim()
                    contacts.push({
                        vcard,
                        displayName: name
                    })

                }
                return fluxx.sendMessage(jid, {
                    ...options,
                    contacts: {
                        ...options,
                        displayName: (contacts.length >= 2 ? `${contacts.length} kontak` : contacts[0].displayName) || null,
                        contacts,
                    }
                }, {
                    quoted,
                    ...options
                })
                enumerable: true
            },
            
      fluxx.sendList = async (jid, header, footer, separate, buttons, rows, quoted, options) => {
                const inputArray = rows.flat()
                const result = inputArray.reduce((acc, curr, index) => {
                    if (index % 2 === 1) {
                        const [title, rowId, description] = curr[0]
                        acc.push({
                            title,
                            rowId,
                            description
                        })
                    }
                    return acc
                }, [])
                let teks = result
                    .map((v, index) => {
                        return `${v.title || ''}\n${v.rowId || ''}\n${v.description || ''}`.trim()
                    })
                    .filter(v => v)
                    .join("\n\n")
                return fluxx.sendMessage(jid, {
                    ...options,
                    text: teks
                }, {
                    quoted,
                    ...options
                })
            },
            
    
    /**
     * Reply to a message
     * @param {String} jid
     * @param {String|Object} text
     * @param {Object} quoted
     * @param {Object} options
     */
    fluxx.reply = (jid, text = '', quoted, options = {}) => {
    const mentions = fluxx.parseMention(text)
    if (Buffer.isBuffer(text)) {
        return fluxx.sendFile(jid, text, 'file', '', quoted, false, options)
    } else {
        return fluxx.sendMessage(
            jid,
            { text, mentions, ...options },
            { quoted, ...options, mentions }
        )
    }
}



fluxx.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await fluxx.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}
    
    fluxx.resize = async (image, width, height) => {
                let oyy = await Jimp.read(image)
                let kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG)
                return kiyomasa
            }
    
    fluxx.fakeReply = (jid, text = '', fakeJid = fluxx.user.jid, fakeText = '', fakeGroupJid, options) => {
        return fluxx.sendMessage(jid, { text: text }, { ephemeralExpiration: 86400, quoted: { key: { fromMe: fakeJid == fluxx.user.jid, participant: fakeJid, ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}) }, message: { conversation: fakeText }, ...options } })
    }
    
    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    fluxx.sendText = (jid, text, quoted = '', options) => fluxx.sendMessage(jid, { text: text, ...options }, { quoted })
    
    /**
    * sendGroupV4Invite
    * @param {String} jid 
    * @param {*} participant 
    * @param {String} inviteCode 
    * @param {Number} inviteExpiration 
    * @param {String} groupName 
    * @param {String} caption 
    * @param {*} options 
    * @returns 
    */
    fluxx.sendGroupV4Invite = async (jid, participant, inviteCode, inviteExpiration, groupName = 'unknown subject', caption = 'Invitation to join my WhatsApp group', options = {}) => {
        let msg = proto.Message.fromObject({
            groupInviteMessage: proto.GroupInviteMessage.fromObject({
                inviteCode,
                inviteExpiration: parseInt(inviteExpiration) || + new Date(new Date + (3 * 86400000)),
                groupJid: jid,
                groupName: groupName ? groupName : this.getName(jid),
                caption
            })
        })
        let message = await this.prepareMessageFromContent(participant, msg, options)
        await this.relayWAMessage(message)
        return message
    }

    /**
    * cMod
    * @param {String} jid 
    * @param {proto.WebMessageInfo} message 
    * @param {String} text 
    * @param {String} sender 
    * @param {*} options 
    * @returns 
    */
    fluxx.cMod = (jid, message, text = '', sender = fluxx.user.jid, options = {}) => {
        let copy = message.toJSON()
        let mtype = Object.keys(copy.message)[0]
        let isEphemeral = false // mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
        let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
        else if (content.caption) content.caption = text || content.caption
        else if (content.text) content.text = text || content.text
        if (typeof content !== 'string') msg[mtype] = { ...content, ...options }
        if (copy.participant) sender = copy.participant = sender || copy.participant
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
        copy.key.remoteJid = jid
        copy.key.fromMe = areJidsSameUser(sender, fluxx.user.id) || false
        return proto.WebMessageInfo.fromObject(copy)
    }

    /**
     * Exact Copy Forward
     * @param {String} jid
     * @param {proto.WebMessageInfo} message
     * @param {Boolean|Number} forwardingScore
     * @param {Object} options
     */
    fluxx.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
        let m = generateForwardMessageContent(message, !!forwardingScore)
        let mtype = Object.keys(m)[0]
        if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore
        m = generateWAMessageFromContent(jid, m, { ...options, userJid: fluxx.user.id })
        await fluxx.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
        return m
    }
    
    fluxx.loadMessage = fluxx.loadMessage || (async (messageID) => {
        return Object.entries(fluxx.chats)
            .filter(([_, { messages }]) => typeof messages === 'object')
            .find(([_, { messages }]) => Object.entries(messages)
                .find(([k, v]) => (k === messageID || v.key?.id === messageID)))
            ?.[1].messages?.[messageID]
    })

    /**
     * Download media message
     * @param {Object} m
     * @param {String} type 
     * @param {fs.PathLike|fs.promises.FileHandle} filename
     * @returns {Promise<fs.PathLike|fs.promises.FileHandle|Buffer>}
     */
    fluxx.downloadM = async (m, type, saveToFile) => {
        if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
        const stream = await downloadContentFromMessage(m, type)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        if (saveToFile) var { filename } = await fluxx.getFile(buffer, true)
        return saveToFile && fs.existsSync(filename) ? filename : buffer
    }
    
    
    fluxx.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }


    /**
     * parseMention(s)
     * @param {string} text 
     * @returns {string[]}
     */
    fluxx.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    /**
     * Read message
     * @param {String} jid 
     * @param {String|undefined|null} participant 
     * @param {String} messageID 
     */
    fluxx.chatRead = async (jid, participant = fluxx.user.jid, messageID) => {
        return await fluxx.sendReadReceipt(jid, participant, [messageID])
    }
    
    fluxx.sendStimg = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }
        await fluxx.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    fluxx.sendStvid = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }
        await fluxx.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * Parses string into mentionedJid(s)
     * @param {String} text
     */
    fluxx.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    
     fluxx.sendTextWithMentions = async (jid, text, quoted, options = {}) => fluxx.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

    /**
     * Get name from jid
     * @param {String} jid
     * @param {Boolean} withoutContact
     */
    
fluxx.getName = (jid, withoutContact = false) => {
id = fluxx.decodeJid(jid);
withoutContact = fluxx.withoutContact || withoutContact;
let v;
if (id.endsWith("@g.us"))
return new Promise(async (resolve) => {
v = store.contacts[id] || {};
if (!(v.name || v.subject)) v = fluxx.groupMetadata(id) || {};
resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
});
else
v =
id === "0@s.whatsapp.net"
? {
id,
name: "WhatsApp",
}
: id === fluxx.decodeJid(fluxx.user.id)
? fluxx.user
: store.contacts[id] || {};
return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
};

/*
  * Send Polling
*/

fluxx.sendPoll = async (jid, name = '', optiPoll, options) => {
    if (!Array.isArray(optiPoll[0]) && typeof optiPoll[0] === 'string') optiPoll = [optiPoll];
    if (!options) options = {};
    const pollMessage = {
        name: name,
        options: optiPoll.map(btn => ({ optionName: btn[0] || '' })),
        selectableOptionsCount: 1
    };
    return fluxx.relayMessage(jid, { pollCreationMessage: pollMessage }, { ...options });
};

/*
  * Get file
*/

fluxx.getFile = async (path) => {
      let res
      let data = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (res = await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      let type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
      }

      return {
        res,
        ...type,
        data
      }
    }
    
/*
   * Set auto Bio
*/

fluxx.setBio = async (status) => {
        return await fluxx.query({
            tag: 'iq',
            attrs: {
                to: 's.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [
                {
                    tag: 'status',
                    attrs: {},
                    content: Buffer.from(status, 'utf-8')
                }
            ]
        })
    }
    
    /**
     * 
     * @param  {...any} args 
     * @returns 
     */
    fluxx.format = (...args) => {
        return util.format(...args)
    }
    
    /**
     * 
     * @param {String} url 
     * @param {Object} options 
     * @returns 
     */
    fluxx.getBuffer = async (url, options) => {
        try {
            options ? options : {}
            const res = await axios({
                method: "get",
                url,
                headers: {
                    'DNT': 1,
                    'Upgrade-Insecure-Request': 1
                },
                ...options,
                responseType: 'arraybuffer'
            })
            return res.data
        } catch (e) {
            console.log(`Error : ${e}`)
        }
    }

    /**
     * Serialize Message, so it easier to manipulate
     * @param {Object} m
     */

    fluxx.public = true;
    fluxx.serializeM = (m) => smsg(fluxx, m, store)

    return fluxx;
}

module.exports = {
    newSockets,
    smsg
};