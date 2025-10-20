const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MyAwesomeWebpackPlugin = require('./plugins/awesome-webpack-plugin')
const config = require('../config')

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'mo.mr.list.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            '@utils': path.resolve(__dirname, '../src/utils'),
            '@store': path.resolve(__dirname, '../src/store'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@modules': path.resolve(__dirname, '../src/modules'),
            '@services': path.resolve(__dirname, '../src/services')
        }
    },
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.(m?js|node)$/,
                parser: {amd: false},
                use: {
                    loader: '@marshallofsound/webpack-asset-relocator-loader',
                    options: {
                        outputAssetBase: 'native_modules',
                    },
                },
            },
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCase',
                            // modules: true,
                            modules: {
                                mode: 'local',
                                exportGlobals: true,
                                localIdentName: '[path][local]',
                                context: path.resolve(__dirname, '../src'),
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
        }),
        new MyAwesomeWebpackPlugin({
            comment: `// ==UserScript==
// @name                MR-list
// @namespace           https://codehub-dg-g.huawei.com/huzifan/MR-Tool.git
// @version             ${config.config.version}
// @description         MR-list
// @author              h00829825
// @copyright           Copyright (c) Huawei Technologies Co., Ltd. 2022-2025. All rights reserved.
// @license             MIT
// @match               https://codehub-g.huawei.com/*
// @supportURL          https://codehub-g.huawei.com/huzifan/MR-Tool/issues
// @homepage            https://codehub-g.huawei.com/huzifan/MR-Tool/home
// @grant               none
// @icon                data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==`
        })
    ],
    externals: {},
}