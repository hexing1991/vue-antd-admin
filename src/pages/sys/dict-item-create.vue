<template>
  <a-modal :title="title" :width="500" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="myForm" :model="form" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-form-model-item label="名称" prop="itemName">
          <a-input v-model="form.itemName" :max="20" />
        </a-form-model-item>
        <a-form-model-item label="值" prop="itemValue">
          <a-input v-model="form.itemValue" :max="50" />
        </a-form-model-item>
        <a-form-model-item label="排序号" prop="sortNo">
          <a-input-number v-model="form.sortNo" :min="-10000" :max="10000" style="width: 100%;" />
        </a-form-model-item>
        <a-form-model-item label="扩展一">
          <a-input v-model="form.columnOne" :maxLength="50" />
        </a-form-model-item>
        <a-form-model-item label="扩展二">
          <a-input v-model="form.columnTwo" :maxLength="50" />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="form.columnThree" :maxLength="50" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'dictId', 'itemName', 'itemValue', 'sortNo', 'columnOne', 'columnTwo', 'columnThree']

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
        itemName: [{ required: true, message: '必填' }, { min: 1, max: 20, message: '长度 1 至 20' }],
        itemValue: [{ required: true, message: '必填' }, { min: 1, max: 50, message: '长度 1 至 50' }],
        sortNo: [{ required: true, message: '必填' }]
      },
      form: {
        id: null,
        dictId: null,
        itemName: null,
        itemValue: null,
        sortNo: null,
        columnOne: null,
        columnTwo: null,
        columnThree: null
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
