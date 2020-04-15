module.exports = {
    plugins: [
        require('autoprefixer')({ grid: true, browsers: 'last 2 versions' }),
        require('cssnano')({
            preset: [
                'default', {
                    discardComments: {
                        removeAll: true
                    }
                }
            ]
        })
    ]
}