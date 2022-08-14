const engine = require('store/src/store-engine')
const storages = [
  require('store/storages/sessionStorage')
]
const plugins = [
  require('store/plugins/defaults'),
  require('store/plugins/expire')
]
const storage = engine.createStore(storages, plugins)
export default storage
