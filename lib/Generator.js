const { getRepoList, getTagList } = require('./http')
const path = require('path')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const chalk = require('chalk')

const spinner = ora(message)

async function wrapLoading(fn, message, ...args) {
  spinner.start()

  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    return false
    // spinner.fail('Request failed, refetch ...')
  }
}

module.exports = class Generator {
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async getRepo() {
    const prefix = 'acnb-template'
    const repoList = await wrapLoading(getRepoList, 'Fetching template ...')
    if (!repoList) return

    const choices = repoList
      .map(repo => repo.name)
      .filter(repoName => repoName.slice(0, prefix.length) === prefix)

    choices[0] = choices[0] + '（推荐）'

    const { repo } = await inquirer.prompt({
      choices,
      name: 'repo',
      type: 'list',
      message: 'Please choose a template to init a cnblog theme project',
    })

    return repo
  }

  async getTag(repo) {
    const tags = await wrapLoading(getTagList, 'Fetching tags ...', repo)
    if (!tags.length) return false

    const tagsList = tags.map(item => item.name)
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Please choose a tag to create project.',
    })

    return tag
  }

  /**
   *
   * @param {string} repo - template repo name
   * @param {string} tag - template repo tag
   */
  async download(repo, tag) {
    const requestUrl = `awescnb/${repo}${tag ? '#' + tag : ''}`
    await wrapLoading(
      this.downloadGitRepo,
      'Downloading template ...',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
  }

  async init() {
    const repo = await this.getRepo()
    const tag = 'latest' || (await this.getTag(repo))

    try {
      await this.download(repo, tag)

      console.log(
        `\r\n${chalk.green(
          '✔'
        )} Successfully created theme project: ${chalk.cyan(this.name)}`
      )
      console.log(`\r\n  1. cd ${chalk.cyan(this.name)}`)
      console.log('  2. npm install')
      console.log('  3. npm run dev')
    } catch (error) {
      console.log(error)
    }
  }
}
