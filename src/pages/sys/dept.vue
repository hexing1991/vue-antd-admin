<template>
  <a-row :gutter="1">
    <a-col :md="5" :sm="24">
      <a-card title="组织树" :bodyStyle="{ overflowX: 'auto', padding: '10px',height: `calc(100vh - 185px)`,overflowY: 'auto' }" :bordered="false">
        <a-tree v-if="rootDeptId.length > 0" :tree-data="$store.state.dict.deptTree" :default-expanded-keys="rootDeptId" :default-selected-keys="rootDeptId" @select="onChangePid" show-line />
      </a-card>
    </a-col>
    <a-col :md="19" :sm="24">
      <a-card title="组织列表" :bodyStyle="{ overflowX: 'auto', padding: '10px',height: `calc(100vh - 185px)`,overflowY: 'auto' }" :bordered="false">
        <a-form layout="inline" style="margin-bottom:10px;">
          <a-form-item label="组织名称">
            <a-input v-model="queryParam.deptName" :maxLength="20" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            <a-button type="primary" v-authority="'dept:add'" style="margin-left: 8px" @click="handleAdd">新建</a-button>
          </a-form-item>
        </a-form>
        <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" showPagination="true" bordered>
          <template #deptType="text">
            <a-tag color="blue">{{ text | dict('deptType') }}</a-tag>
          </template>
          <span slot="action" slot-scope="text, record">
            <template>
              <a v-authority="'dept:update'" @click="handleEdit(record)">修改</a>
              <a-popconfirm v-authority="'dept:delete'" title="确认删除?" @confirm="handleDelete(record)">
                <a href="#">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
        <create-form :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel" @ok="handleOk" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import STable from '@/components/table'
import { page, add, update, del } from '@/api/dept'
import CreateForm from './dept-create'
import { Tree } from 'ant-design-vue'

const columns = [
  {
    title: '序号',
    dataIndex: '_indexNum',
    width: 70,
    align: 'center'
  },
  {
    title: '名称',
    dataIndex: 'deptName',
    align: 'center'
  },
  {
    title: '编码',
    dataIndex: 'deptCode',
    width: 150,
    align: 'center'
  },
  // {
  //   title: '类型',
  //   dataIndex: 'deptType',
  //   width: 100,
  //   align: 'center',
  //   scopedSlots: { customRender: 'deptType' }
  // },
  {
    title: '联系人',
    dataIndex: 'companyContacts',
    width: 90,
    align: 'center'
  },
  {
    title: '联系电话',
    dataIndex: 'contactsPhone',
    width: 150,
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
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysDept',
  components: { STable, ATree: Tree, CreateForm },
  data () {
    return {
      columns,
      rootDeptId: [],
      visible: false,
      confirmLoading: false,
      mdl: {},
      queryParam: {},
      visibleConfig: false,
      configLoading: false,
      configMdl: {}
    }
  },
  created () {
    const { userDeptId: key } = this.$store.state.user
    this.queryParam.pid = key
    Promise.all([this.$store.dispatch('LoadDepts', key)]).then(() => {
      this.rootDeptId = [key]
      this.$refs.table.refresh(true)
    })
  },
  methods: {
    resetSearchForm () {
      this.queryParam.deptName = ''
    },
    handleAdd () {
      this.mdl = {
        columnOneExt: [],
        sortNo: 0
      }
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      const columnThreeExt = record.columnThree ? record.columnThree.split(',') : []
      this.mdl = { ...record, columnThreeExt }
    },
    async handleDelete (r) {
      const res = await del(r.id)
      if (res.code !== 0) return this.$message.error(res.msg)
      this.$refs.table.refresh(true)
      this.$message.success('删除成功')
    },
    onChangePid (keys) {
      if (keys.length === 0) return
      this.queryParam.pid = keys[0]
      this.$refs.table.refresh(true)
    },
    loadData (parameter) {
      const req = Object.assign({}, parameter, this.queryParam)
      return page(req)
    },
    async handleOk (values) {
      this.confirmLoading = true
      const res = values.id ? await update(values) : await add(values)
      this.confirmLoading = false
      if (res.code !== 0) return this.$message.error(res.msg)
      this.visible = false
      this.$message.success(values.id ? '修改成功' : '新增成功')
      this.$refs.table.refresh()
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
