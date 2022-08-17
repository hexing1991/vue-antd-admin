<template>
  <div :class="prefixCls">
    <a-tabs v-model="currentTab" @change="handleTabChange">
      <a-tab-pane v-for="v in icons" :tab="v.title" :key="v.key">
        <ul class="beauty-scroll">
          <li v-for="(icon, key) in v.icons" :key="`${v.key}-${key}`" :class="{ 'active': selectedIcon==icon }" @click="handleSelectedIcon(icon)">
            <a-icon :type="icon" :style="{ fontSize: '18px' }" />
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import icons from './icons'

export default {
  name: 'IconSelect',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-icon-selector'
    },
    value: {
      type: String
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      selectedIcon: this.value || '',
      currentTab: 'brand_logo',
      icons
    }
  },
  watch: {
    value (val) {
      this.selectedIcon = val
      this.autoSwitchTab()
    }
  },
  created () {
    if (this.value) {
      this.autoSwitchTab()
    }
  },
  methods: {
    handleSelectedIcon (icon) {
      if (this.selectedIcon === icon) {
        this.selectedIcon = ''
        this.$emit('change', null)
      } else {
        this.selectedIcon = icon
        this.$emit('change', icon)
      }
    },
    handleTabChange (activeKey) {
      this.currentTab = activeKey
    },
    autoSwitchTab () {
      icons.some(item => item.icons.some(icon => icon === this.value) && (this.currentTab = item.key))
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-icon-selector {
  border: 1px solid #f2f2f2;
  border-radius: 4px;
}
ul {
  list-style: none;
  padding: 0;
  overflow-y: scroll;
  height: 300px;

  li {
    display: inline-block;
    padding: @padding-sm;
    margin: 3px 0;
    border-radius: @border-radius-base;

    &:hover,
    &.active {
      cursor: pointer;
      color: @white;
      background-color: @primary-color;
    }
  }
}
</style>
