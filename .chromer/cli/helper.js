const fs = require('fs-extra')
const chalk = require('chalk')
const { resolve } = require('path')


const isManifestExists =
  async () => fs.pathExists(resolve(process.cwd(), 'src/manifest.json'))

const assertNoManifest = async () => {
  if (await isManifestExists()) {
    console.log(` ${chalk.bold.red('[E]')} File manifest.json already exists`)
    console.log(`     Remove or rename this file to generate new one\n`)
    process.exit(1)
  }
}

module.exports = {
  isManifestExists,
  assertNoManifest
}
