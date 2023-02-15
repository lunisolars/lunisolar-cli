import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import terser from '@rollup/plugin-terser'
import path from 'path'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }))


const upCaseFirst = str => (str[0] ? str[0].toUpperCase() + str.slice(1) : '')
const formatName = n => {
  return n
    .trim()
    .replace(/\.(js|ts)$/, '')
    .split('-')
    .map((v, i) => (i === 0 ? v.trim() : upCaseFirst(v.trim())))
    .join('')
}
const formatGlobalName = name => formatName(name).trim().replace(/^\d|[^a-z\A-Z\d]+/g, '_')


const input = 'src/index.js'
const pluginGlobelName = formatGlobalName(pkg.name)
const rollupConfig = [
  defineConfig({
    input,
    output: [
      {
        format: 'iife',
        name: pluginGlobelName,
        file: 'dist/index.iife.js'
      },
      {
        format: 'cjs',
        file: pkg.main,
        exports: 'named',
        footer: 'module.exports = Object.assign(exports?.default ?? {}, exports);',
        sourcemap: true
      },
      {
        format: 'es',
        file: pkg.module,
        sourcemap: true
      }
    ],
    plugins: [del({ targets: ['dist/*', 'locale/*'] }), terser()]
  })
]

// packing locales
;(() => {
  const dirPath = path.join(path.resolve('./src'), 'locale')
  const outputDir = path.resolve('./locale')
  if (!fs.existsSync(dirPath)) return
  const dirNames = fs.readdirSync(dirPath)
  // if (dirName)
  for (const dirName of dirNames) {
    const input = path.join(dirPath, dirName)
    const fileName = /\.(js|ts)$/.test(dirName) ? dirName.slice(0, -3) : dirName
    const stat = fs.statSync(input)
    if (!stat.isDirectory()) {
      rollupConfig.push(
        defineConfig({
          input,
          output: {
            name: `${pluginGlobelName}_locale_${fileName}`,
            file: path.join(outputDir, `${fileName}.js`),
            format: 'umd'
          },
          plugins: [terser()]
        })
      )
    }
  }
})()

export default rollupConfig
