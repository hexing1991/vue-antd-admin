<template>
  <a-modal :title="title" :width="500" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="myForm" :model="form" :rules="rules" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
        <a-form-model-item label="角色名称" prop="roleName">
          <a-input v-model="form.roleName" :maxLength="20"/>
        </a-form-model-item>
        <a-form-model-item label="角色编码" prop="roleCode">
          <a-input v-model="form.roleCode" :maxLength="20"/>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-textarea v-model="form.remarks" :maxLength="50"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

const fields = ['id', 'roleName', 'roleCode', 'remarks']

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
      default: () => null
    }
  },
  data () {
    return {
      treeData: [],
      rules: {
        roleName: [{ required: true, message: '必填' }, { min: 2, max: 20, message: '长度 2 至 20' }],
        roleCode: [{ required: true, message: '必填' }, { min: 4, max: 20, message: '长度 4 至 20' }]
      },
      form: {
        id: null,
        roleName: null,
        roleCode: null,
        remarks: null
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
