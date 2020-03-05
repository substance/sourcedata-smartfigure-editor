/* eslint-disable no-template-curly-in-string */

const b = require('substance-bundler')
const vfs = require('substance-bundler/extensions/vfs')
const rollup = require('substance-bundler/extensions/rollup')
const fork = require('substance-bundler/extensions/fork')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const postcss = require('substance-bundler/extensions/postcss')
const scssMixins = require('substance-bundler/extensions/postcss/postcss-scss-mixins')
const nestedCss = require('postcss-nested')
const path = require('path')
const fs = require('fs')
const yazl = require('yazl')

const DIST = 'dist/'
const TMP = 'dist/'
const APPDIST = 'app-dist/'

const POSTCSS_PLUGINS = [
  require('postcss-import'),
  scssMixins,
  nestedCss,
  require('postcss-reporter')
]
const PACKAGE_JSON = require.resolve('./package.json')
const APP_PACKAGE_JSON_TEMPLATE = require.resolve('./desktop/package.json')

// Server configuration
const port = process.env.PORT || 4020
b.setServerPort(port)
b.serve({ static: true, route: '/', folder: './dist' })

b.task('clean', function () {
  b.rm(DIST)
  b.rm(TMP)
  b.rm(APPDIST)
}).describe('removes all generated files and folders.')

// used for dev bundling a web-only demo
b.task('demo', ['clean', 'build:web:assets', 'build:fonts', 'build:css', 'build:demo'])

b.task('default', ['demo'])

b.task('build:demo', () => {
  rollup(b, {
    input: 'web-page/demo.js',
    output: {
      file: DIST + 'demo.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        mainFields: ['esnext', 'module', 'main']
      }),
      commonjs()
    ]
  })
})

b.task('build:fonts', () => {
  b.copy('./node_modules/@fortawesome/fontawesome-free', DIST + 'fonts/fontawesome')
  b.copy('./styles/fonts.css', DIST + 'styles/fonts.css')
})

b.task('build:css', () => {
  postcss(b, {
    from: 'styles/index.css',
    to: DIST + 'styles/styles.css',
    postcss: require('postcss'),
    plugins: POSTCSS_PLUGINS,
    parser: require('postcss-comment')
  })
  postcss(b, {
    from: 'styles/fonts.css',
    to: DIST + 'styles/fonts.css'
  })
})

b.task('build:vfs', () => {
  vfs(b, {
    src: ['./data/**/*'],
    dest: DIST + 'vfs.js',
    format: 'umd',
    moduleName: 'vfs',
    rootDir: path.join(__dirname, 'data')
  })
})

b.task('build:web:assets', ['build:vfs'], () => {
  b.copy('./web-page/images', DIST + 'images')
  b.copy('./web-page/index.html', DIST)
  b.copy('./data', DIST + 'data')
  b.copy('./desktop/placeholder.svg', DIST)
})

b.task('build:desktop:dars', () => {
  _packDar('data/blank', APPDIST + 'templates/blank.dar')
  _packDar('data/kitchen-sink', APPDIST + 'examples/kitchen-sink.dar')
})

b.task('build:desktop:assets', () => {
  b.copy('desktop/index.html', APPDIST)
  b.copy('desktop/build-resources', APPDIST)
  b.copy(DIST + 'fonts', APPDIST)
  b.copy(DIST + 'styles', APPDIST)
  b.copy('desktop/preload.js', APPDIST)
  b.copy('desktop/_fileFilters.js', APPDIST)
  b.copy('desktop/placeholder.svg', APPDIST)
})

b.task('build:desktop', ['clean', 'build:fonts', 'build:css', 'build:desktop:assets', 'build:desktop:dars'], () => {
  b.custom('Generate dist/package.json', {
    src: [APP_PACKAGE_JSON_TEMPLATE, PACKAGE_JSON],
    dest: APPDIST + 'package.json',
    execute () {
      delete require.cache[PACKAGE_JSON]
      delete require.cache[APP_PACKAGE_JSON_TEMPLATE]
      const pkg = require(PACKAGE_JSON)
      const appPkg = require(APP_PACKAGE_JSON_TEMPLATE)
      Object.keys(appPkg.dependencies).forEach(moduleName => {
        if (appPkg.dependencies[moduleName] === '*') {
          const version = pkg.devDependencies[moduleName]
          if (!version) throw new Error(`Server dependency '${moduleName}' has to be defined in 'package.json'`)
          appPkg.dependencies[moduleName] = version
        }
      })
      appPkg.version = pkg.version
      appPkg.build.electronVersion = pkg.devDependencies.electron
      b.writeFileSync(APPDIST + 'package.json', JSON.stringify(appPkg, 0, 2))
    }
  })
  rollup(b, {
    input: 'desktop/main.js',
    output: {
      file: APPDIST + 'main.js',
      format: 'cjs',
      sourcemap: true
    },
    external: ['electron', 'path', 'url', 'fs-extra', 'yazl', 'yauzl'],
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      })
    ]
  })
  rollup(b, {
    input: 'desktop/app.js',
    output: {
      file: APPDIST + 'app.js',
      format: 'umd',
      name: 'SmartFigureEditorApp',
      sourcemap: true
    },
    plugins: [
      nodeResolve({
        mainFields: ['esnext', 'module', 'main']
      }),
      commonjs()
    ]
  })
  // execute 'install-app-deps'
  fork(b, require.resolve('electron-builder/out/cli/cli.js'), ['install-app-deps'], { verbose: true, cwd: APPDIST, await: true })
})

b.task('run:app', ['build:desktop'], () => {
  // Note: `await=false` is important, as otherwise bundler would await this to finish
  fork(b, require.resolve('electron/cli.js'), ['.'], { verbose: true, cwd: APPDIST, await: false })
}).describe('runs the application in electron.')

function _packDar (dataFolder, darPath) {
  b.custom(`Creating ${darPath}...`, {
    src: dataFolder + '/**/*',
    dest: darPath,
    execute (files) {
      return new Promise((resolve, reject) => {
        const zipfile = new yazl.ZipFile()
        for (const f of files) {
          const relPath = path.relative(dataFolder, f)
          zipfile.addFile(f, relPath)
        }
        zipfile.outputStream.pipe(fs.createWriteStream(darPath))
          .on('close', (err) => {
            if (err) {
              console.error(err)
              reject(err)
            } else {
              resolve()
            }
          })
        zipfile.end()
      })
    }
  })
}
