<template>
  <a-row :gutter="1">
    <a-col :md="5" :sm="24">
      <a-card title="组织树" :bodyStyle="{ overflowX: 'auto', padding: '10px',height: `calc(100vh - 185px)`,overflowY: 'auto' }" :bordered="false">
        <a-tree v-if="rootDeptId.length > 0" :tree-data="$store.state.dict.deptTree" :defaultExpandedKeys="rootDeptId" :defaultSelectedKeys="rootDeptId" @select="onChangePid" show-line />
      </a-card>
    </a-col>
    <a-col :md="19" :sm="24">
      <a-card title="人员列表" :bodyStyle="{ overflowX: 'auto', padding: '10px',height: `calc(100vh - 185px)`,overflowY: 'auto' }" :bordered="false">
        <a-form layout="inline" style="margin-bottom:10px;">
          <a-form-item label="姓名">
            <a-input v-model="queryParam.userName" placeholder="用户姓名" :maxLength="10" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            <a-button type="primary" style="margin-left: 8px" @click="handleAdd">新建</a-button>
          </a-form-item>
        </a-form>
        <s-table ref="table" size="default" rowKey="id" :scroll="{ x: 1500 }" :columns="columns" :data="loadData" showPagination="true" bordered>
          <span slot="roles" slot-scope="text">{{ text.split(',').map(m=>ROLE_MAP[m]).join('、') }}</span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">修改</a>
              <a-popconfirm title="确认删除?" @confirm="handleDelete(record)">
                <a href="#">删除</a>
              </a-popconfirm>
              <a @click="handleReset(record)">重置密码</a>
            </template>
          </span>
        </s-table>
        <create-form :roles="ROLES" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel" @ok="handleOk" />
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import STable from '@/components/table'
import { page, add, update, del, resetPwd } from '@/api/user'
import { list } from '@/api/role'
import CreateForm from './user-create'
import { Tree } from 'ant-design-vue'

const columns = [{
  title: '序号',
  dataIndex: '_indexNum',
  width: 70,
  align: 'center'
},
{
  title: '姓名',
  align: 'center',
  dataIndex: 'userName',
  width: 90
},
{
  title: '账户',
  align: 'center',
  dataIndex: 'userAccount',
  width: 130
},
{
  title: '手机号',
  align: 'center',
  width: 130,
  dataIndex: 'userPhone'
},
{
  title: '角色',
  dataIndex: 'userRoles',
  width: 150,
  align: 'center',
  scopedSlots: {
    customRender: 'roles'
  }
},
{
  title: '最近登录时间',
  align: 'center',
  width: 160,
  dataIndex: 'lastLoginTime'
},
{
  title: '账号有效期',
  align: 'center',
  width: 160,
  dataIndex: 'accountExpired'
},
{
  title: '密码有效期',
  align: 'center',
  width: 160,
  dataIndex: 'credentialsExpired'
},
{
  title: '是否锁定',
  align: 'center',
  width: 100,
  dataIndex: 'accountLocked',
  customRender (text) {
    return text ? '是' : '否'
  }
},
{
  title: '备注',
  dataIndex: 'remarks',
  ellipsis: true
},
{
  title: '操作',
  dataIndex: 'action',
  fixed: 'right',
  width: 205,
  align: 'center',
  scopedSlots: {
    customRender: 'action'
  }
}
]

export default {
  name: 'SysUser',
  components: {
    STable,
    CreateForm,
    ATree: Tree
  },
  data () {
    return {
      ROLE_MAP: {},
      ROLES: [],
      columns,
      rootDeptId: [],
      visible: false,
      confirmLoading: false,
      mdl: {},
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    const key = this.$store.state.user.userDeptId
    this.queryParam.userDept = key
    Promise.all([this.loadRoles(), this.$store.dispatch('dict/LoadDepts', key)]).then(() => {
      this.rootDeptId = [key]
      this.$refs.table.refresh(true)
    })
  },
  methods: {
    async loadRoles () {
      const res = await list()
      this.ROLES = res.data
      res.data.forEach(m => (this.ROLE_MAP[m.roleCode] = m.roleName))
    },
    resetSearchForm () {
      this.queryParam.userName = ''
      this.queryParam.pageIndex = 1
    },
    handleAdd () {
      this.mdl = {
        userRolesArr: []
      }
      this.visible = true
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = {
        ...record,
        userRolesArr: record.userRoles.split(',')
      }
    },
    async handleDelete (r) {
      const res = await del(r.id)
      if (res.code !== 0) return this.$message.error(res.msg)
      this.$refs.table.refresh(true)
      this.$message.success('删除成功')
    },
    async handleReset (r) {
      this.$confirm({
        title: '温馨提示',
        content: `确认重置 ${r.userName} 的密码？`,
        okType: 'danger',
        onOk: async () => {
          const res = await resetPwd(r.id)
          if (res.code !== 0) return this.$message.error(res.msg)
          this.$refs.table.refresh(true)
          this.$message.success('重置成功')
        }
      })
    },
    onChangePid (keys) {
      if (keys.length === 0) return
      this.queryParam.userDept = keys[0]
      this.$refs.table.refresh(true)
    },
    loadData (parameter) {
      const req = Object.assign({}, parameter, this.queryParam)
      return page(req)
    },
    async handleOk (values) {
      this.confirmLoading = true
      values.userRoles = values.userRolesArr.join(',')
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
