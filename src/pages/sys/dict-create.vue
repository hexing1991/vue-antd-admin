<template>
  <a-modal :title="title" :width="500" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="myForm" :model="form" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="form.name" :maxLength="10" />
        </a-form-model-item>
        <a-form-model-item label="编码" prop="code">
          <a-input v-model="form.code" :maxLength="20" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'code']

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
        name: [{ required: true, message: '必填' }, { min: 2, max: 10, message: '长度 2 至 10' }],
        code: [{ required: true, message: '必填' }, { min: 2, max: 20, message: '长度 2 至 20' }]
      },
      form: {
        id: null,
        name: null,
        code: null
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
