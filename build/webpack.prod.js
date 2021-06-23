"use strict";

// const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const {merge} = require("webpack-merge");
const config = require("../config");
const webpackConfigBase = require("./webpack.base");

const BundleReport = process.env.npm_config_report;
// 删除dist目录

const webpackConfigProd = {
	mode: "production",
	output: {
		path: config.build.assetsRoot,
		filename: "static/js/[name]/[name]-bundle.[contenthash:8].js",
		chunkFilename: "static/js/[name]/[name]-bundle.[contenthash:8].js", // splitChunks提取公共js时的命名规则
		publicPath: config.build.assetsPublicPath
	},
	performance: {
		// 单文件报警的限制大小调到 500kb,入口文件报警限制大小调到 800kb
		hints: "warning",
		maxEntrypointSize: 300 * 1024,
		maxAssetSize: 500 * 1024
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader, // 单独提取css文件
					"css-loader",
					"postcss-loader"
				]
			}
		]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				// 去掉console和调试
				terserOptions: {
					compress: {
						warnings: false,
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ["console.log"]
					}
				}
			})
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		// 单独提取css文件
		new MiniCssExtractPlugin({
			filename: "static/css/[name]/[name]-bundle.[contenthash:8].css",
			chunkFilename: "static/css/[name]/[name]-bundle.[contenthash:8].css" // splitChunks提取公共css时的命名规则
		}),
		// 压缩css
		new CssMinimizerWebpackPlugin({
			parallel: true,
			minimizerOptions: {
				preset: [
					"default",
					{
						discardComments: {
							removeAll: true
						}
					}
				]
			}
		})
	]
};
// 是否开启gzip
if (config.build.productionGzip) {
	const CompressionWebpackPlugin = require("compression-webpack-plugin");
	webpackConfigProd.plugins.push(
		new CompressionWebpackPlugin({
			// gzip
			filename: "[path].gz[query]",
			test: new RegExp(
				"\\.(js|css)$" // 压缩 js 与 css
			),
			algorithm: "gzip",
			// 只处理大于xx字节 的文件，默认：0
			threshold: 10240,
			// 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
			minRatio: 0.8 // 默认: 0.8
			// 是否删除源文件，默认: false
			// deleteOriginalAssets: false,
		})
	);
}

// 包分析
if (BundleReport) {
	const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");
	webpackConfigProd.plugins.push(
		new BundleAnalyzerPlugin({
			analyzerMode: "server",
			analyzerHost: "0.0.0.0",
			analyzerPort: 7777,
			reportFilename: "report.html",
			defaultSizes: "parsed",
			openAnalyzer: true,
			generateStatsFile: false,
			statsFilename: "stats.json",
			statsOptions: null,
			logLevel: "info"
		})
	);
}

module.exports = merge(webpackConfigBase, webpackConfigProd);
