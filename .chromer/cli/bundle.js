const { resolve } = require('path');
const { readFile, writeFile, pathExists, readJson } = require('fs-extra');
const crx = require('crx');
const chalk = require('chalk')
const { paramCase } = require('change-case')


// TODO: Support .crxignore
const main = async () => {
  try {
    const distDir = resolve(process.cwd(), 'dist')
    const builtManifestPath = resolve(distDir, 'manifest.json')
    const keyPath = resolve(process.cwd(), 'keys/key.pem')

    const isManifestExists = await pathExists(builtManifestPath)
    const isKeyExists = await pathExists(keyPath)

    if (!isManifestExists) {
      console.error(`${chalk.bold('manifest.json')} does not exist. Run ${chalk.dim('yarn build')} before.`)
      process.exit(1)
    }

    if (!isKeyExists) {
      console.error(`${chalk.bold('Private key')} does not exist. Run ${chalk.dim('yarn generate_key')} before.`)
      process.exit(1)
    }

    const { name: extensionName } = await readJson(builtManifestPath)
    // transform name, for example "Test Extension" to "test-extension"
    const transformedExtensionName = paramCase(extensionName)

    const packer = new crx({
      // TODO: Add update_url to manifest.json
      // https://developer.chrome.com/apps/autoupdate
      // codebase: 'http://link-to-crx',
      privateKey: await readFile(keyPath)
    })

    const extension = await packer.load(distDir)
    const buffer = await extension.pack()

    /*
    TODO: autoupdate
    fs.writeFile(
      resolve(process.cwd(), 'bundle/update.xml'),
      await extension.generateUpdateXML()
    )*/
    writeFile(resolve(process.cwd(), `bundle/${transformedExtensionName}.crx`), buffer)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
