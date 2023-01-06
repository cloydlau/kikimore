import Vue from 'vue'
import App from './App.vue'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

import {
  KiFormDialog,
  KiPopButton,
  KiPopSwitch,
  KiSelect,
} from '../../src/index'
Vue.use(ElementUI)

;[
  {
    component: KiFormDialog,
    config: {
      'confirmButtonText': '确 认',
      'resetButtonText': '重 置',
      'cancelButtonText': '取 消',
      'denyButtonText': '拒 绝',
      '@closed': function (e) {
        console.log('@closed')
        console.log(e)
        console.log(this)
      },
    },
  },
  {
    component: KiPopButton,
  },
  {
    component: KiPopSwitch,
  },
  {
    component: KiSelect,
  },
].forEach(({ component, config }) => {
  Vue.use(component, config)
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
