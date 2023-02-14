
import minimist from 'minimist'
import { createPlugin } from './createPlugin'


const argv = minimist<{
  _: string[]
}>(process.argv.slice(2), { string: ['_'] })

;(async () => {
  try {
    if (argv._.length > 0 && argv._[0] ===  'create-plugin') {
      await createPlugin(argv)
    }
  } catch (error: any) {
    console.log(error.message)
    return
  }
})()

