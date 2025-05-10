/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

const pino = require('pino');
const { makeInMemoryStore } = require('@adiwajshing/baileys');

const logger = pino({
  level: 'silent',
  transport: {
    targets: []
  }
})

const store = makeInMemoryStore({ logger });

module.exports = { logger, store };