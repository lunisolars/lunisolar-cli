# lunisolar-cli

This is a scaffold for quickly generating plugin project templates for lunisolar.js

这是一个用于给lunisolar.js快速生成插件项目模板的脚手架。

## Usage 用法

**仓建一个名为`my-plugin-project`的lunisolar插件项目**

```sh
# install lunisolar-cli
npm install -g lunisolar-cli 

# Create a plugin project named 'my-plugin-project'
lunisolar create-plugin my-plugin-project
```

或者使用npx命令:

```sh
npx lunisolar-cli create-plugin my-plugin-project
```

**为官方的 [lunisolar-js/plugins](https://github.com/lunisolar-js/plugins) 项目内贡献一个名为`plugin-name`的插件**

- 1 把[lunisolar-js/plugins](https://github.com/lunisolar-js/plugins) fork到自己名下。并clone到本地。
- 2 进入项目根目录，执行:

```sh
npx lunisolar-cli create-plugin plugin-name -o
```

- 3 安装依赖
  
```sh
pnpm install
```

- 4 此时已在项目的`/packages`目录下有一个名为`plugin-name`的文件夹，可在此模板下编写您的插件。并注意格式规范。
