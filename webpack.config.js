/* eslint-disable */

'use strict';
const fs = require('fs');

const path = require('path');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(item => ['.bin'].indexOf(item) === -1)
    .forEach(mod => nodeModules[mod] = 'commonjs ' + mod);

module.exports = {
    target: 'node',
    entry: './src/extension.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'extension.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externals: {
        ...nodeModules,
        vscode: 'commonjs vscode'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
};