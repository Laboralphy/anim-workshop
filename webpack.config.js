/**
 * Created by ralphy on 26/05/17.
 */
const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');

module.exports = {
    mode: "development",
    entry: {
        app: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'app'),
        libraryTarget: 'commonjs2',
        filename: '[name].js',
        publicPath: "",
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    target: 'web'
};