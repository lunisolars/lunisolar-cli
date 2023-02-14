// @ts-check

import { TAKE_SOUND_ELEMENT5 } from './constants'
import type lunisolar from 'lunisolar'

// import zh from './locale/zh'

export const takeSound: lunisolar.PluginFunc = async (options, lsClass, lsFactory) => {
  // if your plugin has a language package, please load it here.
  // lsFactory.locale(zh, true)
  const lsProto = lsClass.prototype

  lsProto.yourMethod = function() {
    // your code
    return 'Hello plugin method'
  }

  lsProto.hello = 'Hello lunisolar plugin'
 
  Object.defineProperty<lunisolar.Lunisolar>(lsProto, 'hello2', {
    get(): string {
      return 'Hello2 lunisolar plugin'
    }
  })
}
