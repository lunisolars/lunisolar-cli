import { defineConfig } from 'rollup'
import del from 'rollup-plugin-delete'
import ts from 'rollup-plugin-typescript2'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }))

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      format: 'es',
      file: pkg.main,
      banner: '#!/usr/bin/env node',
    }
  ],
  plugins: [
    del({ targets: ['bin/*'] }),
    ts(),
  ]

})