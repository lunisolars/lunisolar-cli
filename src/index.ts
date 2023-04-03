
// import minimist from 'minimist'
import { createPlugin } from './createPlugin'
import { createPluginO } from './createPluginO'
import { readJsonFile } from './utils'
import { Command } from 'commander'

import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const pkg = readJsonFile(path.resolve(__dirname, '../package.json'))


// const argv = minimist<{
//   _: string[]
// }>(process.argv.slice(2), { string: ['_'] })

;(async () => {
  
  const program = new  Command()

  program
    .version(pkg.version,'-v,--version')
    .option('-o, --official', 'create a plugin in the @lunisolar/plugins repo')
    .option('-h, --help', 'display help for command')
    .usage('<plugin-name>')

  program.parse(process.argv)

  const opts = program.opts()
  if (!program.args[0] || opts.help) {
    program.help()
    // return void
  }
  const args = program.args

  try {
    if (args.length > 0 && args[0] ===  'create-plugin') {
      if (opts.official) {
        await createPluginO(args)
      } else {
        await createPlugin(args)
      }
    } else {
      console.log()
    }
  } catch (error: any) {
    console.log(error.message)
    return
  }
})()

