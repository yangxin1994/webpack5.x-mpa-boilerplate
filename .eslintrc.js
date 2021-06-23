module.exports = {
	root: true,
	parser: "babel-eslint",
	env: {
		commonjs: true,
		es6: true,
		browser: true,
		node: true,
		jquery: true
	},
	extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
	plugins: ["prettier"],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module"
	},
	rules: {
		strict: 0,
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"global-require": 0,
		"import/no-extraneous-dependencies": ["error", {devDependencies: true}],
		"import/no-unresolved": [
			2,
			{
				ignore: ["^@/"] // @ 是设置的路径别名
			}
		]
	}
};
