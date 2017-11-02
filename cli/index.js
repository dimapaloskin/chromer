const { resolve } = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs-extra')

const setup = require('./setup')

const currentPath = process.cwd()

const getConfiguration = async () => {
  const result = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Extension name'
  }, {
    type: 'input',
    name: 'description',
    message: 'Extension description'
  }, {
    type: 'confirm',
    name: 'popup',
    message: 'Add popup page?'
  }, {
    type: 'confirm',
    name: 'options',
    message: 'Add options page?'
  }, {
    type: 'confirm',
    name: 'background',
    message: 'Add background script?'
  }, {
    type: 'confirm',
    name: 'content',
    message: 'Add content script?'
  }, {
    type: 'confirm',
    name: 'inject',
    message: 'Add inject script?'
  }])

  return result
}

const main = async () => {
  try {
    const manifestPath = resolve(currentPath, 'manifest.json')

    const isManifestExists = await fs.pathExists(manifestPath)

    if (isManifestExists) {
      console.log(` ${chalk.bold.red('[E]')} File manifest.json already exists`)
      console.log(`     Remove or rename this file to generate new one\n`)
      process.exit(1)
    }

    const configuration = await getConfiguration()
    await setup(currentPath, configuration)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
