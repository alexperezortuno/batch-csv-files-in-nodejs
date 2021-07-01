const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const config = {
    entry: './src/index.ts',
    target: 'node',
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js'
        ]
    },
    plugins: [
        new LodashModuleReplacementPlugin
    ]
};

module.exports = config;
