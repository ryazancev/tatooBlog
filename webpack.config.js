const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const fs = require('fs');

const PATHS = {
    src: path.join(__dirname, 'src')
};

const PAGES_DIR = `${PATHS.src}`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'));


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => `[name].${ext}`;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        },
    };

    if (isProd) {
        config.minimize = true;
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
        ];
    }

    return config;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/main.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'web'),
        publicPath: '',
        assetModuleFilename: 'img/[name][ext][query]'
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'web'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    optimization: optimization(),
    plugins: [
        ...PAGES.map(page => new HTMLWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page}`
        })),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        }),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ['gifsicle', { interlaced: true }],
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 5 }],
                ],
            },
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {from: path.resolve(__dirname, 'src/assets') , to: path.resolve(__dirname, 'app')}
        //     ]
        // }),
    ],
    devtool: isProd ? false : 'source-map',
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev
                        },
                    },
                    'css-loader'

                ],
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(?:|woff2|woff)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: `./fonts/${filename('[ext]')}`
                    }
                }],
            }
        ]
    }
};