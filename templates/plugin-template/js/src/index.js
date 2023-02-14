// import zh from './locale/zh'

export const takeSound = async (options, lsClass, lsFactory) => {
  // if your plugin has a language package, please load it here.
  // lsFactory.locale(zh, true)
  const lsProto = lsClass.prototype

  lsProto.yourMethod = function() {
    // your code
    return 'Hello plugin method'
  }

  lsProto.hello = 'Hello lunisolar plugin'
 
  Object.defineProperty(lsProto, 'hello2', {
    get() {
      return 'Hello2 lunisolar plugin'
    }
  })
}
