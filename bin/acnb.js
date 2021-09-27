#!/usr/bin/env node

const program = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')

program
  .command('init <theme-name>')
  .description('init a new theme')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => require('../lib/init.js')(name, options))

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <path>', 'get value from option')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options) => console.log(value, options))

program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action(option => {
    console.log(option)
  })

program.on('--help', () => {
  console.log(
    '\r\n' +
      figlet.textSync('acnb', {
        font: 'Standard',
        horizontalLayout: 'full',
      })
  )

  console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)} show details\r\n`)
})

program.parse(process.argv)
