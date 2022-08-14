<template>
  <a-card :bordered="false">
    <a-form layout="inline" style="margin-bottom:10px;">
      <a-form-item label="角色名称">
        <a-input v-model="queryParam.roleName" placeholder="角色名称" :maxLength="10" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left: 8px;" @click="() => this.queryParam.roleName = null">重置</a-button>
        <a-button type="primary" style="margin-left: 8px;" @click="handleAdd">新建</a-button>
      </a-form-item>
    </a-form>
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" showPagination="auto" bordered>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-popconfirm title="确认删除?" @confirm="handleDelete(record)">
            <a href="#">删除</a>
          </a-popconfirm>
          <a @click="handleAuth(record)">授权</a>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel" @ok="handleOk" />
    <auth-form :visible="authVisible" :role-id="currentRoleId" @auth-ok="handleAuthOk" @auth-cancel="authVisible = false" />
  </a-card>
</template>

<script>
import STable from '@/components/table'
import { page, add, update, del, authRole } from '@/api/role'
import { refreshResources } from '@/api/resource'
import CreateForm from './role-create'
import AuthForm from './role-auth'
const columns = [
  {
    title: '序号',
    dataIndex: '_indexNum',
    width: 70,
    align: 'center'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center'
  },
  {
    title: '角色编码',
    dataIndex: 'roleCode'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 170,
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'SysRole',
  components: { STable, CreateForm, AuthForm },
  data () {
    return {
      columns,
      visible: false,
      confirmLoading: false,
      mdl: {},
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      authVisible: false,
      currentRoleId: ''
    }
  },
  created () {
    this.$nextTick().then(() => this.$refs.table.refresh(true))
  },
  methods: {
    resetSearchForm () {
      this.queryParam.roleName = ''
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
      const res = await del(r.id)
      if (res.code !== 0) return this.$message.error(res.msg)
      this.$refs.table.refresh(true)
      this.$message.success('删除成功')
      refreshResources()
    },
    handleAuth (r) {
      this.currentRoleId = r.id
      this.authVisible = true
    },
    async handleAuthOk (ids) {
      const res = await authRole(this.currentRoleId, ids.join(','))
      if (res.code !== 0) return this.$message.error(res.msg)
      this.authVisible = false
      this.currentRoleId = null
      this.$message.success('授权成功')
      refreshResources()
    },
    loadData (parameter) {
      const req = Object.assign({}, parameter, this.queryParam)
      return page(req)
    },
    async handleOk (values) {
      this.confirmLoading = true
      const res = values.id ? await update(values) : await add(values)
      this.confirmLoading = false
      values.id && refreshResources()
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
