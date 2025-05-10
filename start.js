/** 
 # ============================ #
 • Author : anggara z
 • Type : plugin n case
 • Java script : cjs
 # ============================ #
**/

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

function run() {
  let args = [path.join(__dirname, '/lib/system/index.js'), ...process.argv.slice(2)]
  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })

  p.on('message', data => {
    if (data == 'reset') {
      console.log(chalk.red('[ Info ] : Restarting Bot...'))
      p.kill()
      startBot()
    }
  }).on('exit', code => {
    console.log(chalk.red('[ Info ] : Bot exited with code:', code))
    if (code == 0 || code == 1) run()
  })
}

run()