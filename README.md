# webpack5-multiPage-tel

webpack5.40.0(截止当前最新版) 多页面打包模板

- 支持 autoprefixer 自动加浏览器前缀
- ES6+语法 babel 编译成 ES5 语法
- 提取公共 css 和 js，自动添加版本号
- 打包压缩 js 和 css

## 使用

安装 推荐使用 `yarn`

```bash
yarn or yarn install
```

开发

```bash
yarn dev
```

预览（默认）: http://localhost:5000

打包(生产模式)

```bash
yarn build:prod
```

打包后预览

```bash
yarn server
```

项目目录

```txt


├── build
│   ├── build.js
│   ├── util.js
│   ├── webpack.base.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── config
│   └── index.js
├── public
│   └── favicon.ico
├── src
│   ├── api
│   ├── assets
│   ├── components
│   ├── libs
│   ├── style
│   ├── utils
│   └── views
├── static
├── .babelrc
├── postcss.config.js
├── .gitignore
├── package.json
├── yarn.lock
└── README.md

```

### 说明

---

`views`目录下，每个文件夹为单独的一个页面

每个页面至少有两个文件配置:

`index.js`: 页面的逻辑入口

`index.css`: 页面的 css 样式

`index.html`: 页面的 html 打包模板

---

`assets`目录下，放静态资源，比如图片资源

---

styles | common | utils 下的文件引用超过两次会集中打包

`styles`目录下，放公共全局的 css

`common | utils`目录下，存放公共的 js 文件及工具类

`static`目录下，存放非 npm 包第三方的包库，如浏览器的 jq 第三方 js

---

可以自行添加文件夹，比如全局的`components`公共组件, `utils`全局工具方法
`build`目录为 webpack 打包配置，有详细的注解

代码分割使用的是`splitChunks`配置

```javascript
optimization: {
    splitChunks: {
      cacheGroups: {
        // 打包业务中公共代码
        common: {
          name: "common",
          chunks: "initial",
          minSize: 1,
          priority: 0,
          minChunks: 2, // 同时引用了2次才打包
        },
        // 打包node_modules中的文件
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          priority: 10,
          minChunks: 2, // 同时引用了2次才打包
        }
      }
    }
  }
```

### 其他

- 移动端定制,参考项目分支[feature/mobile](https://github.com/deepred5/webpack4-boilerplate/tree/feature/mobile)
- 使用 dll 加快打包速度,参考项目分支[feature/dll](https://github.com/deepred5/webpack4-boilerplate/tree/feature/dll)
