import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import jsx from 'rollup-plugin-jsx'

import { copy } from 'fs-extra'

import manifest from './manifest.json'

const constants = {
  dist: 'dist'
}

// check what parts needed to be bundled
const chunks = {
  withOptions: manifest.hasOwnProperty('options_page'),
  withBackground: manifest.hasOwnProperty('background'),
  withPopup: manifest.hasOwnProperty('browser_action'),
  withInject: manifest.hasOwnProperty('web_accessible_resources'),
  withContent: manifest.hasOwnProperty('content_scripts')
}

const createConfigChunk = name => ({
  input: `src/${name}/index.js`,
  output: {
    file: `${constants.dist}/js/${name}.js`,
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    jsx({factory: 'h'}),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
})

const prepare = async () => {
  try {
    await copy('manifest.json', `${constants.dist}/manifest.json`)
    await copy('icons', `${constants.dist}/icons`)

    if (chunks.withPopup) {
      await copy('src/popup/index.html', `${constants.dist}/popup.html`)
    }

    if (chunks.withOptions) {
      await copy('src/options/index.html', `${constants.dist}/options.html`)
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const createConfig = () => {
  const config = []
  if (chunks.withBackground) {
    config.push(createConfigChunk('background'))
  }

  if (chunks.withContent) {
    config.push(createConfigChunk('content'))
  }

  if (chunks.withInject) {
    config.push(createConfigChunk('inject'))
  }

  if (chunks.withOptions) {
    config.push(createConfigChunk('options'))
  }

  if (chunks.withPopup) {
    config.push(createConfigChunk('popup'))
  }

  return config
}

prepare()

export default createConfig()
