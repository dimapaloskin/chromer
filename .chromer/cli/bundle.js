const { readFile, writeFile } = require('fs-extra');
const { resolve } = require('path');
const crx = require('crx');


// TODO: Support .crxignore
const main = async () => {
  try {
    const packer = new crx({
      // TODO: Add update_url to manifest.json
      // https://developer.chrome.com/apps/autoupdate
      // codebase: 'http://link-to-crx',
      privateKey: await readFile(resolve(process.cwd(), 'keys/key.pem'))
    })
    const extension = await packer.load(resolve(process.cwd(), 'dist'))
    const buffer = await extension.pack()

    /*
    TODO: autoupdate
    fs.writeFile(
      resolve(process.cwd(), 'bundle/update.xml'),
      await extension.generateUpdateXML()
    )*/
    writeFile(resolve(process.cwd(), 'bundle/extension.crx'), buffer)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
