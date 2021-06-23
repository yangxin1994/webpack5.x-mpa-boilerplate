"use strict";

const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const config = require("../config");

const {getEntry, getHtmlWebpackPlugin, getAssetsPath} = require("./util");

module.exports = {
	entry: getEntry("./src/views/**/index.js"), // 默认入口
	externals: {
		// 外部引入jq
		jquery: "jQuery"
	},
	resolve: {
		extensions: [".js"], // 默认后缀名
		alias: {
			"@": path.resolve(__dirname, "../src") // 别名
		}
	},
	module: {
		noParse: /static/, // 不解析模块中的依赖关系 提高打包效率
		rules: [
			{
				test: /\.js$/,
				use: [
					{
						loader: "babel-loader"
					},
					{
						loader: "eslint-loader",
						options: {
							// 这里的配置项参数将会被传递到 eslint 的 CLIEngine
							formatter: require("eslint-friendly-formatter") // 指定错误报告的格式规范, eslint-friendly-formatter可以让eslint的错误信息出现在终端上
						}
					}
				],
				enforce: "pre", // 编译前检查
				include: path.resolve(__dirname, "src"), // 精确指定要处理的目录
				exclude: /node_modules/ // 排除不处理的目录
			},
			{
				test: /\.(htm|html)$/i,
				use: {
					loader: "html-loader",
					options: {
						attributes: {
							list: [
								"...",
								{
									tag: "link",
									attribute: "href",
									type: "src"
								}
							]
						},
						minimize: true
					}
				}
			},
			// Webpack5 提供了内置的静态资源构建能力，我们不需要安装额外的 loader
			{
				test: /\.(png|jpe?g|gif|svg|icon)(\?.*)?$/i,
				type: "asset",
				generator: {
					// [ext]前面自带"."
					filename: getAssetsPath("images/[name].[hash:7][ext]")
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
				type: "asset/resource"
			}
		]
	},
	// 会使用 cache-loader缓存一些性能开销较大的 loader https://github.com/webpack-contrib/cache-loader
	cache: {
		type: "filesystem",
		// 可选配置
		buildDependencies: {
			config: [__filename] // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
		}
	},
	// 提取公共代码
	optimization: {
		splitChunks: {
			cacheGroups: {
				// 打包node_modules中的文件 priority更高，先提取
				vendor: {
					name: "vendor",
					test: /[\\/]node_modules[\\/]/,
					chunks: "initial",
					priority: 10, // 优先级
					minChunks: 2
				},
				// 打包业务中公共代码  priority （优先级）低，后提取
				// 只提取common和styles目录下的文件，打包成common.js和common.css
				// 否则会把任意目录下的文件也打包进common里，造成污染
				common: {
					name: "common",
					chunks: "all", // chunks：指定哪些类型的chunk参与拆分 ,有三个值all 代表所有模块，async代表只管异步加载的, initial代表初始化时就能获取的模块。
					test: /[\\/]src[\\/](utils|common|styles)/,
					minSize: 1, // minSize设置的是生成文件的最小大小，单位是字节，默认30000
					priority: 0,
					minChunks: 2 // 模块被引用2次以上的才抽离
				}
			}
		}
		// runtimeChunk: {
		//   name: 'manifest'
		// } // 运行时代码
	},
	// webpack5 将不会自动为 Node.js 模块添加 polyfill，而是更专注的投入到前端模块的兼容中。因此需要开发者手动添加合适的 polyfill。
	plugins: [
		new webpack.IgnorePlugin(/static/), // 用于过滤打包文件，减少打包体积大小。不打包外部静态资源
		// new CopyWebpackPlugin({
		//   // 将图标拷贝到打包后的目录
		//   patterns: [{
		//       from: path.resolve(__dirname, "../public/favicon.ico"),
		//       to: config.build.assetsRoot,
		//     },
		//     {
		//       from: path.resolve(__dirname, "../static"),
		//       to: config.build.assetsSubDirectory,
		//       toType: "dir",
		//     },
		//   ],
		// }),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.join(__dirname, "../public"),
					globOptions: {
						ignore: [".*"]
					}
				}
			]
		}),
		// 直接在webpackProvide挂载一个变量就行，不用再去一一引入。
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			jquery: "jquery",
			"window.jQuery": "jquery"
		}),
		...getHtmlWebpackPlugin("./src/views/**/*.html")
	]
};
