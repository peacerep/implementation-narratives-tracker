const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})

module.exports = {
  // build for onrender
  publicPath: '/'
  
  // build for github pages
  // publicPath: process.env.NODE_ENV === 'production' ? '/implementation-narratives-tracker/' : '/'
}
