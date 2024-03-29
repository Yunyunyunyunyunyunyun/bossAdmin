var path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : './',
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('static', resolve('static'))
  },
  configureWebpack: {
    externals: {
      'BMap': 'BMap'
    }
  }
}
