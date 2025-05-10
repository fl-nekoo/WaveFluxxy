const fs = require("fs")

const handler = async (m, { fluxx, prefix, pushname } = {}) => {
const listmenu = `ʜᴀʟᴏ *${pushname}* ɪɴɪ ᴀᴅᴀʟᴀʜ ʙᴀꜱᴇ ꜱɪᴍᴘᴇʟ ᴅɪʙᴜᴀᴛ ᴜɴᴛᴜᴋ ᴘᴇɴɢᴇᴍʙᴀɴɢ ʙᴏᴛ ᴡᴀ, ᴜɴᴛᴜᴋ ʙᴇʟᴀᴊᴀʀ. ${global.author}

*────── \`[ ᴏᴡɴᴇʀ ᴍᴇɴᴜ ]\` ──────*

- $
- =>
- >
- addowner
- addprem
- delowner
- delprem
- restart
- shutdown

*────── \`[ ꜱᴛɪᴄᴋᴇʀ ᴍᴇɴᴜ ]\` ─────*

- sticker
- cls
- qc

*────── \`[ ᴛᴏᴏʟꜱ ᴍᴇɴᴜ ]\` ──────*

- remini
- tts
- readvo
- tr
- jarak
- kalkulator
- get

*────── \`[ ɢʀᴏᴜᴘ ᴍᴇɴᴜ ]\` ──────*

- add
- kick
- promote
- demote`

fluxx.sendMessage(m.chat, {
    document: fs.readFileSync("./package.json"),
    fileName: global.jpegfile,
    mimetype: 'application/msword',
    jpegThumbnail: fs.readFileSync("./lib/system/gallery/document.jpg"), 
    contextInfo: {
        mentionedJid: [m.sender], 
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: global.ids,
            serverMessageId: null,
            newsletterName: global.nems
        },
    },
    caption: listmenu
}, {quoted: m})
}

handler.command = ["menu", "allmenu"]
module.exports = handler