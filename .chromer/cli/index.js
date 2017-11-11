const inquirer = require('inquirer')

const { assertNoManifest } = require('./helper');
const setup = require('./setup')

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
    await assertNoManifest()
    await setup(process.cwd(), await getConfiguration())
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
