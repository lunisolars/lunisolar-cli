
import minimist from 'minimist'
import { createPlugin } from './createPlugin'
// import { red } from 'kolorist'
import { readJsonFile } from './utils'

import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pkg = readJsonFile(path.resolve(__dirname, '../package.json'))

const argv = minimist<{
  _: string[]
}>(process.argv.slice(2), { string: ['_'] })

;(async () => {
  if (argv._.length === 0) {
    console.log('lunisolar-cli version:', pkg.version)
    process.exit(0)
  }
  try {
    if (argv._.length > 0 && argv._[0] ===  'create-plugin') {
      await createPlugin(argv)
    } else {
      console.log()
    }
  } catch (error: any) {
    console.log(error.message)
    return
  }
})()

