const webpack = require('webpack'),
          merge = require('webpack-merge'),
         baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge (baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        open: true,
        contentBase: baseWebpackConfig.externals.paths.dist,
        watchContentBase: true,
        overlay:  {
            warnings: false,
            errors: true
        }
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({  //map of site code
            filename: '[file].map'
        })
    ]
})

module.exports = new Promise((resolve, reject) => resolve(devWebpackConfig))