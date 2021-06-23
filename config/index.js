"use strict";

const path = require("path");
const ip = require("ip");

const serverConfig = {
	https: false,
	host: ip.address(), // can be overwritten by process.env.HOST
	port: 5000 // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
};

module.exports = {
	dev: {
		// Paths
		assetsSubDirectory: "static",
		assetsPublicPath: "/",
		// Various Dev Server settings 开发服务器配置
		serverConfig,
		autoOpenBrowser: true,
		errorOverlay: true,
		poll: true // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
	},
	build: {
		// Paths
		assetsRoot: path.resolve(__dirname, "../dist"),
		assetsSubDirectory: "static",
		assetsPublicPath: "/",
		// build config
		productionGzip: false // gzip
	}
};
