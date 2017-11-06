const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path') ;
const webpack = require('webpack') ; 

var config = {
    entry: {
        // app: './entry.js',
        // vendors: './entryvendors.js'
        'webbase': './entry_webbase.js',
        'webbase_rr': './entry_webbase_rr.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle-[name].js'  //如果不設定[name] multiple的entry只會使用第一個 
    },
    module: {
        rules: [
            //{test: /\.css$/,  loader: 'style-loader!css-loader'},
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                }),
            },
            {test: /\.(eot|svg|ttf|woff|woff2)\w*/,loader: 'url-loader?limit=1000000'}, 
            // {test: /\.(png|svg|jpg|gif)$/,         loader: 'file-loader'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'source/index.html'
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("bundle-[name].css"),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            'window.jQuery': 'jquery',
        })
    ],
    //速度與資訊量取得一個平衡
    devtool: "cheap-module-eval-source-map",
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
    }
} ;

module.exports = [config] ;
//webpack-dev-server --hot --open --content-base dist
//只會監控entry裡面的改變

