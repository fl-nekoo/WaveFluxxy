/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

const pino = require("pino");
const NodeCache = require("node-cache");
const { makeInMemoryStore, jidNormalizedUser } = require("@adiwajshing/baileys");
const { store, logger } = require("./store.js")

function options(pairingCode, useMobile) {
  return {
    printQRInTerminal: !pairingCode,
    isLatest: true,
    msgRetryCounterCache: new NodeCache(),
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: undefined,
    keepAliveIntervalMs: 10000,
    emitOwnEvents: true,
    fireInitQueries: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: true,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    mobile: useMobile,
    patchMessageBeforeSending(message) {
      const requiresPatch = !!(
        message.buttonsMessage ||
        message.templateMessage ||
        message.listMessage
      );
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...message,
            },
          },
        };
      }
      return message;
    },
  };
}

module.exports = {
  options
};