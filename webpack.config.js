const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');

const extractMain = new ExtractTextPlugin('main.[contenthash].css');
const extractAsync = new ExtractTextPlugin('async.[contenthash].css');

module.exports = {
    entry: {
        print: './src/print.js',
        main: './src/main.js',
        vendor: ["lodash", "jquery", "angular"]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            angular: 'angular'
        }),
        extractMain,
        extractAsync,
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            prefetch: false,
            preload: 'async.[contenthash].css',
            minify: {
                collapseWhitespace: true,
                ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/, /{{[\s\S]*?}}/, /@[\s\S]*?/],
                minifyCSS: true,
                minifyJS: true,
                processConditionalComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            },
            chunksSortMode: 'dependency',
        }),
        new ResourceHintWebpackPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'].reverse(),
            minChunks: Infinity,
            children: true,
            async: true,
            minChunks: 3
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        }),
        new ManifestPlugin({
            fileName: 'rev-manifest.json',
            basePath: '/dist/'
        })
    ],
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery",
            Blades: path.resolve(__dirname, 'src/views/')
        },
        extensions: ['.js', '.json'],
        modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [{
                test: /main\.scss$/,
                use: extractMain.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "postcss-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /async\.scss$/,
                use: extractAsync.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "postcss-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
                ]
            }
        ]
    }
};
