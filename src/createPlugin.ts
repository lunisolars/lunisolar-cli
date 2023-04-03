import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import prompts from 'prompts'
import { red, reset, yellow, cyan, green } from 'kolorist'
import { 
  formatTargetDir, 
  isEmpty, 
  isValidPackageName,
  toValidPackageName,
  pkgFromUserAgent,
  readJsonFile,
  emptyDir,
  copy
} from './utils'

const renameFiles: Record<string, string | undefined>  = {
  _gitignore: '.gitignore',
}

export async function createPlugin(argv: any) {
  let pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  let pkgManager = pkgInfo ? pkgInfo.name : 'npm'
  let targetDir =  formatTargetDir(argv[1]) ?? ''
      const defaultTargetDir = 'lunisolar-plugin-project'

  const getProjectName = () => targetDir === '.' ? path.basename(path.resolve()) : targetDir

  const res = await prompts([
    // 设定目标文件夹（项目名称）
    {
      type: () => !targetDir ? 'text' : null,
      name: 'targetDir',
      message: reset('Target directory:'),
      initial: defaultTargetDir,
      onState: (state) => {
        targetDir = formatTargetDir(state.value) || defaultTargetDir
      },
    },
    // 检查目标文件
    {
    type: () => !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
    name: 'overwrite',
    message: () =>
      (targetDir === '.'
        ? 'Current directory'
        : `Target directory "${targetDir}"`) +
      ' is not empty. Remove existing files and continue?',
    },
    {
      type: (_, { overwrite }: { overwrite?: boolean }) => {
        if (overwrite === false) {
          throw new Error(red('✖') + red(' Operation cancelled'))
        }
        return null
      },
      name: 'overwriteChecker',
    },
    {
      type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
      name: 'packageName',
      message: reset('Package name:'),
      initial: () => toValidPackageName(getProjectName()),
      validate: (dir) =>
        isValidPackageName(dir) || 'Invalid package.json name',
    },
    {
      type: 'select',
      name: 'useTypescript',
      message: 'Use Typescript?',
      initial: 0,
      choices: [{
        title: cyan('Typescript'),
        value: 0
      }, {
        title: yellow('Javascript'),
        value: 1
      }],
    }
  ], {
    onCancel: () => {
      throw new Error(red('✖') + yellow(' Operation cancelled'))
    },
  })

  const opt = {
    targetDir,
    packageName: res?.packageName ?? toValidPackageName(getProjectName()),
    overwrite: !!res.overwrite,
    useTypescript: res.useTypescript === 0 ? 'ts' : 'js',
    pkgManager,
  }
  const templateDir = path.resolve(
    url.fileURLToPath(import.meta.url),
    '../../templates/plugin-template',
    opt.useTypescript,
  )

  const rootPath = path.join(process.cwd(), opt.targetDir)
  if (opt.overwrite) {
    emptyDir(rootPath)
  } else if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath, { recursive: true })
  }

  // 对模板文件夹进行拷贝
  const files = fs.readdirSync(templateDir)
  for (const file of files) {
    if (file === 'package.json') {
      const pkg = readJsonFile(path.join(templateDir, file))
      pkg.name = opt.packageName
      fs.writeFileSync(path.join(rootPath, file) , JSON.stringify(pkg, null, 2))
    } else {
      const targetPath = path.join(rootPath, renameFiles[file] ?? file)
      copy(path.join(templateDir, file), targetPath)
    }
  }
  console.log(`\n${green('Done. Now run:')}\n`)

  let cdProjectName = path.relative(process.cwd(), rootPath)
  cdProjectName = cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
  if (rootPath !== process.cwd()) {
    console.log(
      ` cd ${
        cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
      }`,
    )
  }
  switch (opt.pkgManager) {
    case 'yarn':
      console.log(' yarn')
      break
    default:
      console.log(` ${opt.pkgManager} install`)
      break
  }
  console.log()
}


