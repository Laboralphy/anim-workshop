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
        publicPath: "./app/",
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    target: 'electron-main'
};