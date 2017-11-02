const { resolve } = require('path')
const { copy, writeJson } = require('fs-extra')
const chalk = require('chalk')

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

const setupOptionsPage = async ({ path, configuration, manifest }) => {
  const templatePath = resolve(path, 'cli/templates/options')
  const destination = resolve(path, 'src/options')
  await copy(templatePath, destination)

  return 'options.html'
}

const setupBackgroundScript = async ({ path, configuration, manifest }) => {
  const templatePath = resolve(path, 'cli/templates/background')
  const destination = resolve(path, 'src/background')
  await copy(templatePath, destination)

  return {
    'persistent': false,
    'scripts': ['src/js/background.js']
  }
}

const setupContentScript = async ({ path, configuration, manifest }) => {
  const templatePath = resolve(path, 'cli/templates/content')
  const destination = resolve(path, 'src/content')
  await copy(templatePath, destination)

  return {
    'matches': [
      '*'
    ],
    'js': ['js/content.js']
  }
}

const setupInjectScript = async ({ path, configuration, manifest }) => {
  const templatePath = resolve(path, 'cli/templates/inject')
  const destination = resolve(path, 'src/inject')
  await copy(templatePath, destination)

  return ['js/inject.js']
}

const setup = async (path, configuration) => {
  console.log('Configuration:\n', configuration, '\n')

  manifest.name = configuration.name
  manifest.description = configuration.name

  if (configuration.popup) {
    manifest['browser_action'] = await setupPopup({ path, configuration, manifest })
  }

  if (configuration.options) {
    manifest['options_page'] = await setupOptionsPage({ path, configuration, manifest })
  }

  if (configuration.background) {
    manifest['background'] = await setupBackgroundScript({ path, configuration, manifest })
  }

  if (configuration.content) {
    manifest['content_scripts'] = await setupContentScript({ path, configuration, manifest })
  }

  if (configuration.inject) {
    manifest['web_accessible_resources'] = await setupInjectScript({ path, configuration, manifest })
  }

  const outManifestPath = resolve(path, 'manifest.json')
  await writeJson(outManifestPath, manifest, {
    spaces: 2
  })

  console.log(`${chalk.bold.green('[+]')} Done`)
  console.log(`    Run ${chalk.dim('yarn build')} now\n`)
}

module.exports = setup
