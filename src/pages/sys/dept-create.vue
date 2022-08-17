<template>
  <a-modal :title="title" :width="840" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="myForm" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-model-item label="上级组织" prop="pid">
            <a-tree-select v-model="form.pid" style="width: 100%;" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="$store.state.dict.deptTree" placeholder="请选择上级组织" tree-node-filter-prop="title" showSearch />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="组织编码" prop="deptCode">
            <a-input v-model="form.deptCode" :maxLength="20" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="组织名称" prop="deptName">
            <a-input v-model="form.deptName" :maxLength="30" />
          </a-form-model-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-model-item label="类型" prop="deptType">
            <a-select v-model="form.deptType" style="width: 100%;" placeholder="请选择类型">
              <a-select-option v-for="m in $store.state.dict.deptType" :key="m.itemValue" :value="m.itemValue">{{ m.itemName }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col> -->
        <a-col :span="12">
          <a-form-model-item label="联系人">
            <a-input v-model="form.companyContacts" :maxLength="30" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="联系电话">
            <a-input v-model="form.contactsPhone" :maxLength="11" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="排序号" prop="sortNo">
            <a-input-number v-model="form.sortNo" :min="-10000" :max="10000" style="width: 100%;" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'pid', 'deptName', 'deptCode', 'deptType', 'companyContacts', 'contactsPhone', 'sortNo']

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
      default: () => { }
    }
  },
  data () {
    return {
      rules: {
        pid: [{ required: true, message: '必填' }],
        deptName: [{ required: true, message: '必填' }, { min: 2, max: 30, message: '长度 2 至 30' }],
        deptCode: [{ required: true, message: '必填' }, { min: 2, max: 11, message: '长度 2 至 20' }],
        // deptType: [{ required: true, message: '必填' }],
        sortNo: [{ required: true, message: '必填' }]
      },
      form: {
        id: null,
        pid: null,
        deptName: null,
        deptCode: null,
        deptType: null,
        companyContacts: null,
        sortNo: null
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
