const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const {
    NoEmitOnErrorsPlugin,
    SourceMapDevToolPlugin,
    NamedModulesPlugin
} = require('webpack');
const {
    GlobCopyWebpackPlugin
} = require('@angular/cli/plugins/webpack');
const extractMain = new ExtractTextPlugin('main.[contenthash].css');
const extractAsync = new ExtractTextPlugin('async.[contenthash].css');

module.exports = {
    resolve: {
        alias: {
            jquery: "jquery/src/jquery",
            Blades: path.resolve(__dirname, 'src/views/'),
            Controllers: path.resolve(__dirname, 'src/angular/')
        },
        extensions: ['.js', '.json'],
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        "modules": [
            "./node_modules",
            "./node_modules"
        ],
        "symlinks": true
    },
    entry: {
        main: './src/main.js',
        vendor: ["lodash", "jquery", "angular"]
    },
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new NoEmitOnErrorsPlugin(),
        new GlobCopyWebpackPlugin({
            "patterns": [
                "fonts",
                "images",
                "views",
                "favicon.ico"
            ],
            "globOptions": {
                "cwd": path.join(process.cwd(), "src"),
                "dot": true,
                "ignore": "**/.gitkeep"
            }
        }),
        new ProgressPlugin(),
        new CircularDependencyPlugin({
            "exclude": /(\\|\/)node_modules(\\|\/)/,
            "failOnError": false
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            angular: 'angular'
        }),
        extractMain,
        extractAsync,
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            cache: true,
            showErrors: true,
            chunks: "all",
            excludeChunks: [],
            xhtml: true,
            prefetch: false,
            preload: 'async.css',
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
                        loader: "sass-loader",
                        options: {
                            "sourceMap": false,
                            "precision": 3,
                            "includePaths": []
                        }
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                "test": /\.(eot|svg|cur)$/,
                "loader": "file-loader?name=[name].[contenthash].[ext]"
            },
            {
                "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loaders: [
                    "url-loader?name=[name].[contenthash].[ext]&limit=10000",
                    "image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: '65-80', speed: 4}, mozjpeg: {quality: 65}}"
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.php$/,
                loader: 'raw-loader'
            }
        ]
    }
};
