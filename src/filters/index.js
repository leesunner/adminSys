import Vue from 'vue'
import * as fillters from './filters';

Object.keys(fillters).forEach(key => {
  Vue.filter(key, fillters[key])
})
