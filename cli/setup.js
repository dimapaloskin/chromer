const { resolve } = require('path')
const { copy } = require('fs-extra')
const manifest = require('./templates/manifest.json')

const setupPopup = async ({ path, configuration, manifest }) => {
  const templatePath = resolve(path, 'cli/templates/popup')
  const destination = resolve(path, 'src/popup')
  await copy(templatePath, destination)

  return {
    'default_title': configuration.name,
    'default_icon': 'icons/icon_48.png',
    'default_popup': 'popup.html'
  }
}

const setup = async (path, configuration) => {
  console.log('Configuration:\n', configuration, '\n')

  manifest.name = configuration.name
  manifest.description = configuration.name

  if (configuration.popup) {
    manifest['browser_action'] = await setupPopup({ path, configuration, manifest })
  }

  console.log(JSON.stringify(manifest, null, 2))
}

module.exports = setup
