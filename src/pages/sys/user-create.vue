<template>
  <a-modal :title="title" :width="800" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="myForm" :model="form" :rules="rules" :labelCol="{ span: 7 }" :wrapperCol="{ span: 17 }">
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="机构" prop="userDept">
            <a-tree-select v-model="form.userDept" style="width: 100%" :tree-data="$store.state.dict.deptTree" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择所属机构" tree-node-filter-prop="title" showSearch />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="姓名" prop="userName">
            <a-input v-model="form.userName" placeholder="请输入姓名" :maxLength="30" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="账户" prop="userAccount">
            <a-input v-model="form.userAccount" placeholder="请输入账户" :maxLength="20" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="手机" prop="userPhone">
            <a-input v-model="form.userPhone" :maxLength="11" placeholder="请输入11位手机号" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="角色" prop="userRolesArr">
            <a-select mode="multiple" v-model="form.userRolesArr" style="width: 100%" placeholder="请选择用户角色">
              <a-select-option v-for="r in roles" :key="r.roleCode">{{ r.roleName }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="账户有效期" prop="accountExpired">
            <a-date-picker show-time v-model="form.accountExpired" style="width: 100%" valueFormat="YYYY-MM-DD HH:mm:ss" :allowClear="false" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="是否锁定" prop="accountLocked">
            <a-select v-model="form.accountLocked" style="width: 100%" placeholder="是否锁定">
              <a-select-option :key="false">否</a-select-option>
              <a-select-option :key="true">是</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="备注">
            <a-input v-model="form.remarks" placeholder="备注" :maxLength="50" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'userDept', 'userName', 'userPhone', 'userAccount', 'userRolesArr', 'sortNo', 'remarks', 'accountLocked', 'accountExpired']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => ({})
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      treeData: [],
      rules: {
        userDept: [{ required: true, message: '必填' }],
        userName: [{ required: true, message: '必填' }, { min: 2, max: 30, message: '长度 2 至 30' }],
        userPhone: [{ required: true, message: '必填' }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号' }],
        userAccount: [{ required: true, message: '必填' }, { min: 6, max: 20, message: '长度 6 至 20' }],
        userRolesArr: [{ required: true, message: '必填' }],
        sortNo: [{ required: true, message: '必填' }],
        accountLocked: [{ required: true, message: '必填' }],
        accountExpired: [{ required: true, message: '必填' }]
      },
      form: {
        id: null,
        userDept: null,
        userName: null,
        userPhone: null,
        userAccount: null,
        userRolesArr: null,
        sortNo: null,
        remarks: null,
        accountLocked: null,
        accountExpired: null
      }
    }
  },
  computed: {
    title () {
      return this.model.id ? '修改' : '新增'
    }
  },
  created () {
    this.$watch('visible', async visible => {
      if (!visible) return
      this.form = pick(this.model, fields)
    })
  },
  methods: {
    handleOk () {
      this.$refs.myForm.validate(valid => valid && this.$emit('ok', this.form))
    },
    handleCancel () {
      this.$refs.myForm.resetFields()
      this.$emit('cancel')
    }
  }
}
</script>
