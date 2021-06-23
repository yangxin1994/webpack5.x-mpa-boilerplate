"use strict";

const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require("../config");

function getEntry(globPath) {
	let files = glob.sync(globPath);
	let entries = {};
	files.forEach(entry => {
		const entryName = path.dirname(entry).split("/").pop();
		entries[entryName] = [
			// "core-js/es/map",
			// "core-js/es/set",
			// "core-js/es/promise",
			entry
		]; //core-js@3废弃了babel-polyfill，实现了完全无污染的API转译，非常有潜力，但是其暂时会增加打包体积，这个还得看未来普及度上来之后的权衡
	});
	return entries;
}

function getHtmlWebpackPlugin(globPath) {
	let files = glob.sync(globPath);
	let htmlArr = [];

	files.forEach(entry => {
		const entryName = path.dirname(entry).split("/").pop();
		htmlArr.push(
			new HtmlWebpackPlugin({
				favicon: path.resolve(__dirname, "../public/favicon.ico"),
				template: entry,
				filename: entryName + "/index.html", //是否是index,是index就放在根目录,其它则在其它文件夹下
				chunks: [entryName, "vendor", "common"], // common（公共）和vendor（node_models）是splitChunks抽取的公共文件 manifest(已去掉)是运行时代码
				minify:
					process.env.NODE_ENV === "development"
						? false
						: {
								removeComments: true, // 移除HTML中的注释
								collapseWhitespace: true, // 折叠空白区域 也就是压缩代码
								removeAttributeQuotes: false // 去除属性引用
						  }, //是否压缩html
				environment:
					process.env.NODE_ENV === "development" ? config.dev.assetsPublicPath : config.build.assetsPublicPath
			})
		);
	});
	return htmlArr;
}

function getAssetsPath(_path) {
	const assetsSubDirectory =
		process.env.NODE_ENV === "production" ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory;
	return path.posix.join(assetsSubDirectory, _path);
}

module.exports = {
	getEntry,
	getHtmlWebpackPlugin,
	getAssetsPath
};
