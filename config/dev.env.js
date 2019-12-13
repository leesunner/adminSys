'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_URL:'http://172.16.8.242:1113',//测试服务器
  BASE_URL:'http://172.16.8.19:8091',//
})
