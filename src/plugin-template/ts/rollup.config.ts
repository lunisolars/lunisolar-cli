import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import ts from 'rollup-plugin-typescript2'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'
import path from 'path'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }))

const input = 'src/index.ts'
const rollupConfig = [
  defineConfig({
    input,
    output: [
      {
        name: 'lunisolarPlugin_takeSound',
        file: 'dist/index.umd.js'
      },
      {
        format: 'cjs',
        file: pkg.main,
        exports: 'named',
        footer: 'module.exports = Object.assign(exports.default, exports);',
        sourcemap: true
      },
      {
        format: 'es',
        file: pkg.module,
        sourcemap: true
      }
    ],
    plugins: [
      del({ targets: ['dist/*', 'locale/*'] }),
      ts({
        clean: true
      }),
      terser()
    ]
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
            name: 'lsrPluginLocale_' + fileName,
            file: path.join(outputDir, `${fileName}.js`),
            format: 'umd'
          },
          plugins: [
            ts({
              clean: true
            }),
            terser()
          ]
        }),
        defineConfig({
          input,
          output: {
            file: path.join(outputDir, `${fileName}.d.ts`),
            format: 'es'
          },
          plugins: [dts()]
        })
      )
    }
  }
})()

export default rollupConfig
