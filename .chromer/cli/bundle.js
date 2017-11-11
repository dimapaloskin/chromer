const fs = require('fs');
const { resolve } = require('path');
const crx = require('crx');


// TODO: .crxignore
const main = async () => {
  try {
    const packer = new crx({
      // if autoupdate: codebase: 'http://link-to-crx',
      privateKey: fs.readFileSync(resolve(process.cwd(), 'keys/key.pem'))
    })
    const extension = await packer.load(resolve(process.cwd(), 'dist'))
    const buffer = await extension.pack()

    /*
    If autoupdate:
    fs.writeFile(
      resolve(process.cwd(), 'bundle/update.xml'),
      await extension.generateUpdateXML()
    )*/
    fs.writeFile(resolve(process.cwd(), 'bundle/extension.crx'), buffer)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

main()
