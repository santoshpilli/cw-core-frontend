const path = require("path");
const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackPlugin
} = require("customize-cra");
const AntDesignThemePlugin = require("antd-theme-webpack-plugin");

const options = {
    stylesDir: path.join(__dirname, "./src/styles"),
    antDir: path.join(__dirname, "./node_modules/antd"),
    varFile: path.join(__dirname, "./src/styles/vars.less"),
    themeVariables: ["@primary-color",
    "@table-header-bg",
    "@font-size-base",
    "@table-header-color",
    "@table-body",
    "@text-color",
    "@tabs-card-head-background",
    "@tabs-card-tab-active-border-bottom",
    "@label-color",
    "@btn-primary-bg",
    "@layout-body-background"
],
    indexFileName: "index.html"
};

module.exports = override(
    fixBabelImports("antd", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true
    }),
    addWebpackPlugin(new AntDesignThemePlugin(options)),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true
        }
    })
);