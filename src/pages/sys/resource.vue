<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
    </div>
    <a-table :columns="columns" :data-source="list" :pagination="false" rowKey="id" bordered>
      <a-icon slot="icon" slot-scope="text" :component="icons[text]" />
      <span slot="type" slot-scope="text">{{ text | dict('RESOURCE_TYPE') }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-popconfirm title="确认删除?" @confirm="handleDelete(record)">
            <a href="#">删除</a>
          </a-popconfirm>
        </template>
      </span>
    </a-table>
    <create-form :tree="list" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel" @ok="handleOk" />
  </a-card>
</template>

<script>
import { list, add, update, del, refreshResources } from '@/api/resource'
import CreateForm from './resource-create'
// import icons from '@/core/icons'
const icons = []
// TODO

const columns = [
  {
    title: '名称',
    dataIndex: 'resourceName'
  },
  {
    title: '图标',
    dataIndex: 'resourceIcon',
    width: 80,
    align: 'center',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '类型',
    dataIndex: 'resourceType',
    width: 90,
    align: 'center',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: '链接',
    width: '30%',
    dataIndex: 'resourceUrl'
  },
  {
    title: '排序',
    dataIndex: 'sortNo',
    width: 70,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 150,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysResource',
  components: { CreateForm },
  data () {
    return {
      icons,
      columns,
      list: [],
      visible: false,
      confirmLoading: false,
      mdl: {}
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    async fetchData () {
      this.list = []
      const { data } = await list()
      data.sort((a, b) => {
        if (a.resourceType !== b.resourceType) {
          return a.resourceType - b.resourceType
        } else {
          return a.sortNo - b.sortNo
        }
      })
      const map = {}
      const res = []
      data.forEach(m => {
        m.key = m.id
        m.value = m.id
        m.title = m.resourceName
        map[m.id] = m
      })
      data.forEach(m => {
        if (!map[m.pid]) {
          res.push(m)
          return
        }
        (map[m.pid].children || (map[m.pid].children = [])).push(m)
      })
      res.sort((a, b) => a.sortNo - b.sortNo)
      this.list = res
    },
    async handleExpand (expanded, record) {
      if (!expanded) return
      const req = Object.assign({}, this.queryParam)
      req.pid = record.id
      const { data } = await list(req)
      data.forEach(m => {
        m.children = [0, 1].indexOf(m.resourceType) !== -1 ? [] : undefined
        m.key = m.id
        m.value = m.id
        m.title = m.resourceName
      })
      data.sort((a, b) => a.sortNo - b.sortNo)
      record.children = data
    },
    handleAdd () {
      this.mdl = {}
      this.visible = true
    },
    handleEdit (record) {
      this.mdl = record
      this.visible = true
    },
    async handleDelete (r) {
      const flag = r.children && r.children.length > 0
      if (flag) {
        this.$message.warning('删除失败：存在下级资源！')
        return
      }
      const res = await del(r.id)
      if (res.code !== 0) return this.$message.error(res.msg)
      this.fetchData()
      this.$message.success('删除成功')
      refreshResources()
    },
    async handleOk (values) {
      this.confirmLoading = true
      values.resourceStatus = 0
      const res = values.id ? await update(values) : await add(values)
      values.id && refreshResources()
      this.confirmLoading = false
      if (res.code !== 0) return this.$message.error(res.msg)
      this.visible = false
      this.$message.success(values.id ? '修改成功' : '新增成功')
      this.fetchData()
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
