"use strict";

// const path = require("path");
const webpack = require("webpack");
const {merge} = require("webpack-merge");
const FriendlyErrorsWebpackPlugin = require("@soda/friendly-errors-webpack-plugin");
const config = require("../config");
const webpackConfigBase = require("./webpack.base");

const {serverConfig} = config.dev;

const webpackConfigDev = {
	mode: "development",
	target: "web", // 这是 webpack-dev-server 遗留的一个 BUG，只有你在 Webpack 配置中显式地设置了 target: 'web'，HMR 才能够生效
	stats: "errors-only",
	devtool: "inline-source-map",
	output: {
		path: config.build.assetsRoot,
		// 打包多出口文件
		filename: "static/js/[name].bundle.js",
		publicPath: config.dev.assetsPublicPath
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader", "postcss-loader"]
			}
		]
	},
	devServer: Object.assign(serverConfig, {
		contentBase: config.build.assetsRoot,
		openPage: "index/index.html",
		publicPath: config.dev.assetsPublicPath,
		// compress: true,
		// historyApiFallback: true, //有问题
		hot: true, // 热更新
		open: config.dev.autoOpenBrowser, // 自动打开浏览器
		overlay: config.dev.errorOverlay
			? {
					warnings: true,
					errors: true
			  }
			: false,
		// noInfo: true, // 隐藏输出
		quiet: true, // 清空控制台输出
		inline: true, // 浏览器实时刷新
		watchOptions: {
			// 当文件修改后会重新编译
			poll: config.dev.poll, // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。
			ignored: /node_modules/ // 忽略这里边的包
		}
	}),
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // 热更新
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				notes: ["尊敬的程序员大大~  编译成功!ヾ(o◕∀◕)ﾉヾ"],
				messages: [
					"启动应用:",
					`- Local: ${serverConfig.https ? "https" : "http"}://localhost:${serverConfig.port}`,
					`- Network: ${serverConfig.https ? "https" : "http"}://${serverConfig.host}:${serverConfig.port}`
				]
			}
		})
	]
};

module.exports = merge(webpackConfigBase, webpackConfigDev);
