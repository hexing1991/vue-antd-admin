import VueI18nPlugin from './i18n-extend'
import TabsPagePlugin from './tabs-page-plugin'
import './authority'

const Plugins = {
  install: function (Vue) {
    Vue.use(VueI18nPlugin)
    Vue.use(TabsPagePlugin)
  }
}
export default Plugins
