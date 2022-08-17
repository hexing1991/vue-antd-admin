<template>
  <a-modal title="授权" :width="540" :body-style="{ overflowY: 'auto',maxHeight: 'calc( 100vh - 250px )' }" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-tree v-model="checkedKeys" checkable :tree-data="treeData" checkStrictly>
        <template slot="title" slot-scope="row">
          <span>{{ row.resourceName }}</span>
          <span style="color:#ddd;font-size:9px;line-height:16px;margin-left:10px;">{{ row.resourceType | dict('RESOURCE_TYPE') }}</span>
        </template>
      </a-tree>
    </a-spin>
  </a-modal>
</template>

<script>
import { getRoleResource } from '@/api/role'
import { list as listResources } from '@/api/resource'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    roleId: {
      type: String,
      default: () => null
    }
  },
  data () {
    return {
      loading: false,
      treeData: [],
      checkedKeys: []
    }
  },
  created () {
    this.$watch('visible', visible => {
      if (!visible) {
        this.treeData = []
        this.checkedKeys = []
      } else {
        this.initData()
      }
    })
  },
  methods: {
    async initData () {
      this.treeData = []
      this.loading = true
      const [res, res1] = await Promise.all([listResources(), getRoleResource(this.roleId)])
      res.data.sort((a, b) => {
        if (a.resourceType !== b.resourceType) {
          return a.resourceType - b.resourceType
        } else {
          return a.sortNo - b.sortNo
        }
      })
      const tempMap = {}
      const list = []
      for (let i = 0, len = res.data.length; i < len; i++) {
        const m = res.data[i]
        m.title = m.resourceName
        m.key = m.id
        if (m.resourceType === 0) {
          m.children = []
          list.push(m)
          tempMap[m.id] = m
        } else if (m.resourceType === 1) {
          m.children = []
          tempMap[m.id] = m
          if (tempMap[m.pid]) {
            tempMap[m.pid].children.push(m)
          } else {
            list.push(m)
          }
        } else {
          tempMap[m.pid].children.push(m)
        }
      }
      list.sort((a, b) => a.sortNo - b.sortNo)
      this.treeData = list
      this.checkedKeys = res1.data.map(m => m.id)
      this.loading = false
    },
    handleOk () {
      this.$emit('auth-ok', this.checkedKeys.checked)
    },
    handleCancel () {
      this.$emit('auth-cancel')
    }
  }
}
</script>
