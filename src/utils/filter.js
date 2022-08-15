import Vue from 'vue'
import store from '@/store'

Vue.filter('dict', function (val, dictName, key = 'itemName') {
  const dict = store.state.dict[dictName]
  if (!val && val !== 0 && val !== '0') return ''
  for (let i = 0, len = dict.length; i < len; i++) {
    if (dict[i].itemValue === val) return dict[i][key]
  }
  return ''
})
