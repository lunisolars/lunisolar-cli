import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import { red, reset, yellow, cyan } from 'kolorist'
// console.log(red)
import { 
  formatTargetDir, 
  isEmpty, 
  isValidPackageName,
  toValidPackageName,
  pkgFromUserAgent,
  getPkgManagerName
} from './utils'

export async function createPlugin(argv: any) {
  let pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  let pkgManager = pkgInfo ? pkgInfo.name : ''
  let targetDir =  formatTargetDir(argv._[1]) ?? ''
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
              throw new Error(red('✖') + ' Operation cancelled')
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
        },
        {
          type: () => pkgManager ? null : 'select',
          name: 'pkgManager',
          message: 'Select pkg manager?',
          initial: 0,
          choices: [{
            title: 'pnpm',
            value: 0
          }, {
            title: 'yarn',
            value: 1
          }, {
            title: 'npm',
            value: 2
          }],
        }
      ], {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        },
      })

      const opt = {
        targetDir,
        packageName: res?.packageName ?? toValidPackageName(getProjectName()),
        overwrite: !!res.overwrite,
        useTypescript: res.useTypescript === 0 ? 'ts' : 'js',
        pkgManager: getPkgManagerName(res.pkgManager),
      }

}

