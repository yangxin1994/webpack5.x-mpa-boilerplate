"use strict";

process.env.NODE_ENV = "production";

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const config = require("../config");
const webpackConfig = require("./webpack.prod");

const spinner = ora("小主莫急, 正在努力打包中...");
spinner.start();

rm(path.join(config.build.assetsRoot), (err) => {
  if (err) throw err;
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false,
      }) + "\n\n"
    );

    if (stats.hasErrors()) {
      console.log(chalk.red("  尊敬的程序员大大~  打包失败(┬＿┬).\n"));
      process.exit(1);
    }

    console.log(chalk.green("  尊敬的程序员大大~  打包成功╰(￣▽￣)╮.\n"));
  });
});
