const   path = require('path'),
            miniCssExtractPlugin = require('mini-css-extract-plugin'),
            copyWebpackPlugin= require('copy-webpack-plugin'),
            htmlWebpackPlugin= require('html-webpack-plugin');

const PATHS = {
    src: path.join(__dirname,'../src'),
    dist: path.join(__dirname,'../dist'),
    assets: 'assets/'
}

module.exports = {
    externals: {
      paths: PATHS
    },
    entry: PATHS.src,
    output: {
        filename: `js/[name].js`,
        path: PATHS.dist,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                // CSS files
                test: /\.css$/,
                use: [
                    miniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true}
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: { path: 'build-config/postcss.config.js' } }
                    }
                ]
            },
            {
                // SCSS files
                test: /\.scss$/,
                use: [
                    miniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {sourceMap: true, config: { path: 'build-config/postcss.config.js' } }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                // Images
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                // Fonts
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]"
                }
            }
        ]
    },
    plugins: [
        new miniCssExtractPlugin( {
            filename: `${PATHS.assets}css/[name].css`
        } ),
        new htmlWebpackPlugin( {
            hash: false,
            template: `${PATHS.src}/index.html`,
            filename: './index.html'
        } ),
        new copyWebpackPlugin( [
            { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
            { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` }
        ] ),
    ]
};