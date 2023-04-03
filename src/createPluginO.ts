import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import prompts from 'prompts'
import { red, reset, green } from 'kolorist'
import { 
  formatTargetDir, 
  isEmpty, 
  isValidPackageName,
  toValidPackageName,
  pkgFromUserAgent,
  readJsonFile,
  copy
} from './utils'

const renameFiles: Record<string, string | undefined>  = {
  _gitignore: '.gitignore',
}

export async function createPluginO(argv: any) {
  let pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  let pkgManager = pkgInfo ? pkgInfo.name : 'npm'


  const pluginName =  formatTargetDir(argv[1])
  if (!pluginName) {
    throw new Error(red('✖') + red(' Please input the plugin name'))
  }

  const targetDir = './packages'

  const targetPath = path.resolve(targetDir, pluginName)

  if ( fs.existsSync(targetPath) && !isEmpty(targetPath) ) {
    throw new Error(red('✖') + red(' The target directory already exists and is not empty'))
  }

  const res = await prompts([
   
  
    {
      type: () => (isValidPackageName(pluginName) ? null : 'text'),
      name: 'packageName',
      message: reset('Package name:'),
      initial: () => toValidPackageName(pluginName),
      validate: (dir) =>
        isValidPackageName(dir) || 'Invalid package.json name',
    }
  ], {
    onCancel: () => {
      throw new Error(red('✖') + red(' Operation cancelled'))
    },
  })

  const opt = {
    targetDir,
    packageName: res?.packageName ?? toValidPackageName(pluginName),
    pkgManager
  }
  const templateDir = path.resolve(
    url.fileURLToPath(import.meta.url),
    '../../templates/plugin-template/o',
  )

  fs.mkdirSync(targetPath, { recursive: true })

  // 对模板文件夹进行拷贝
  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    if (file === 'package.json') {
      const pkg = readJsonFile(path.join(templateDir, file))
      pkg.name = opt.packageName
      fs.writeFileSync(path.join(targetPath, file) , JSON.stringify(pkg, null, 2))
    } else {
      const fileTargetPath = path.join(targetPath, renameFiles[file] ?? file)
      copy(path.join(templateDir, file), fileTargetPath)
    }
  }
  console.log(`\n${green('Done.')}\n`)
  console.log()
}


