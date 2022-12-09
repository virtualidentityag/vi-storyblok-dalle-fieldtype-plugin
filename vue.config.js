const Dotenv = require('dotenv-webpack');

module.exports = {
  configureWebpack: {
    output: {
      filename: 'export.js'
    },
    optimization: {
      splitChunks: false
    },
    plugins: [
      new Dotenv()
    ]
  },
  filenameHashing: false,
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    extract: false
  }
}
