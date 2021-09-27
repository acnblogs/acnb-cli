const path = require('path')
const Generator = require('./Generator')
const fs = require('fs-extra')
const inquirer = require('inquirer')

module.exports = async function (themeName, options) {
  const cwd = process.cwd()
  const targetAir = path.join(cwd, themeName)

  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite',
            },
            {
              name: 'Cancel',
              value: false,
            },
          ],
        },
      ])

      if (!action) return
      if (action === 'overwrite') {
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }

  const generator = new Generator(themeName, targetAir)
  generator.init()
}
