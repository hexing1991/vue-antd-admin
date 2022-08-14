<template>
  <a-row :gutter="1">
    <a-col :span="24" :md="10" :lg="6" :xl="4">
      <a-card title="字典大类" :bodyStyle="{ overflowX: 'auto', padding: '10px',height: `calc(100vh - 185px)`,overflowY: 'auto' }" :bordered="false">
        <a-tree ref="dictTree" :tree-data="treeData" :selectedKeys.sync="defaultDictId" @select="onChangeDictId">
          <template #title="{ key, title, code }">
            <a-dropdown :trigger="['contextmenu']">
              <span>{{ title }}<span style="font-size:10px;color:#ccc;margin-left:10px;">{{ code }}</span></span>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="handleEdit({id:key, name:title, code})">修改</a-menu-item>
                  <a-menu-item key="2" @click="handleDelete({id:key, name:title})">删除</a-menu-item>
                  <a-menu-item key="3" @click="handleCopy(code)">复制code</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tree>
        <a slot="extra" href="#" @click="handleAdd">新增</a>
      </a-card>
    </a-col>
    <a-col :span="24" :md="14" :lg="18" :xl="20">
      <a-card :title="dictTitle" :bodyStyle="{ overflowX: 'auto', padding: '10px',height: `calc(100vh - 185px)`,overflowY: 'auto' }" :bordered="false">
        <div class="table-operator">
          <a-button type="primary" icon="plus" @click="handleAddItem">新建</a-button>
        </div>
        <a-table rowKey="id" :columns="columns" :scroll="{ x: 1000 }" :data-source="dicts" :pagination="false" bordered>
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEditItem(record)">修改</a>
              <a-popconfirm title="确认删除?" @confirm="handleDeleteItem(record)">
                <a href="#">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
        <create-item-form :visible="visibleItem" :loading="confirmLoadingItem" :model="mdlItem" @cancel="handleCancelItem" @ok="handleOkItem" />
        <create-form :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel" @ok="handleOk" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { list, add, update, del, listItem, addItem, updateItem, delItem } from '@/api/dict'
import CreateItemForm from './dict-item-create'
import CreateForm from './dict-create'
import { Tree } from 'ant-design-vue'

const columns = [
  {
    title: '序号',
    width: 90,
    align: 'center',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '名称',
    dataIndex: 'itemName',
    align: 'center'
  },
  {
    title: '值',
    dataIndex: 'itemValue',
    align: 'center'
  },
  {
    title: '扩展一',
    dataIndex: 'columnOne',
    align: 'center'
  },
  {
    title: '扩展二',
    dataIndex: 'columnTwo',
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'columnThree',
    align: 'center'
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
  name: 'SysDict',
  inject: ['reload'],
  components: { CreateItemForm, CreateForm, ATree: Tree },
  data () {
    return {
      columns,
      dictTitle: '字典子项',
      defaultDictId: [],
      treeData: [],
      dicts: [],
      currentDict: {},
      visible: false,
      confirmLoading: false,
      mdl: {},
      visibleItem: false,
      confirmLoadingItem: false,
      mdlItem: {},
      queryParam: { dictId: '' }
    }
  },
  created () {
    this.loadDicts().then(() => this.loadData())
  },
  methods: {
    async loadDicts () {
      const res = await list()
      res.data.sort((a, b) => a.code.localeCompare(b.code))
      this.treeData = res.data.map(({ id: key, name: title, code }) => ({
        key,
        title,
        code,
        scopedSlots: { title: 'custom' }
      }))
      this.defaultDictId = [this.treeData[0].key]
      this.dictTitle = this.treeData[0].title
      this.queryParam.dictId = this.treeData[0].key
      this.currentDict = this.treeData[0]
    },
    handleAdd () {
      this.mdl = {}
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    async handleDelete (r) {
      this.$confirm({
        title: '温馨提示',
        content: `确认删除 ${r.name}？`,
        okType: 'danger',
        onOk: async () => {
          const res = await del(r.id)
          if (res.code !== 0) return this.$message.error(res.msg)
          this.$message.success('删除成功')
          this.reload()
        }
      })
    },
    handleAddItem () {
      this.mdlItem = { dictId: this.queryParam.dictId }
      this.visibleItem = true
    },
    async handleCopy (code) {
      await this.$copyText(code)
      this.$message.success(`${code} 复制成功`)
    },
    handleEditItem (record) {
      this.visibleItem = true
      this.mdlItem = { ...record }
    },
    async handleDeleteItem (r) {
      const res = await delItem(r.id)
      if (res.code !== 0) return this.$message.error(res.msg)
      this.$message.success('删除成功')
      this.loadData()
    },
    onChangeDictId (keys, e) {
      if (keys.length === 0) return
      this.queryParam.dictId = keys[0]
      this.currentDict = e.selectedNodes[0].componentOptions.propsData.dataRef
      this.dictTitle = this.currentDict.title
      this.loadData()
    },
    async loadData () {
      const { data } = await listItem(this.queryParam)
      data.sort((a, b) => a.sortNo - b.sortNo)
      this.dicts = data
    },
    async handleOk (values) {
      this.confirmLoading = true
      const res = values.id ? await update(values) : await add(values)
      this.confirmLoading = false
      if (res.code !== 0) return this.$message.error(res.msg)
      this.visible = false
      this.$message.success(values.id ? '修改成功' : '新增成功')
      this.reload()
    },
    async handleOkItem (values) {
      this.confirmLoadingItem = true
      const res = values.id ? await updateItem(values) : await addItem(values)
      this.visibleItem = false
      this.confirmLoadingItem = false
      if (res.code !== 0) return this.$message.error(res.msg)
      this.loadData() // 刷新表格
      this.$message.success(values.id ? '修改成功' : '新增成功')
    },
    handleCancel () {
      this.visible = false
    },
    handleCancelItem () {
      this.visibleItem = false
    }
  }
}
</script>
