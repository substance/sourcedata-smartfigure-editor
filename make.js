const b = require('substance-bundler')
const vfs = require('substance-bundler/extensions/vfs')
const rollup = require('substance-bundler/extensions/rollup')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const postcss = require('substance-bundler/extensions/postcss')
const scssMixins = require('substance-bundler/extensions/postcss/postcss-scss-mixins')
const nestedCss = require('postcss-nested')
const path = require('path')

const DIST = 'dist/'
const TMP = 'dist/'
const POSTCSS_PLUGINS = [
  require('postcss-import'),
  scssMixins,
  nestedCss,
  require('postcss-reporter')
]

b.task('clean', function () {
  b.rm(DIST)
  b.rm(TMP)
}).describe('removes all generated files and folders.')

b.task('build', ['clean', 'build:assets', 'build:fonts', 'build:lib', 'build:css'])
  .describe('builds the library bundle.')

b.task('default', ['clean', 'build'])

b.task('build:lib', () => {
  rollup(b, {
    input: 'index.js',
    output: {
      file: DIST + 'smart-figure.js',
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

b.task('build:assets', ['build:vfs'], () => {
  b.copy('./static/images', DIST + 'images')
  b.copy('./static/data', DIST + 'data')
  b.copy('./static/demo.js', DIST)
  b.copy('./static/index.html', DIST)
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
    src: ['./static/data/**/*'],
    dest: DIST + 'vfs.js',
    format: 'umd',
    moduleName: 'vfs',
    rootDir: path.join(__dirname, 'static', 'data')
  })
})

// Server configuration
const port = process.env.PORT || 4020
b.setServerPort(port)
b.serve({ static: true, route: '/', folder: './dist' })
