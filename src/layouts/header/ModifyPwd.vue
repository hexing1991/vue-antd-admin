<template>
  <a-modal title="修改密码" :width="500" :visible="value" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form :form="form" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
        <a-form-item label="原始密码">
          <a-input type="password" v-decorator="['oldPwd', {rules: [{required: true,message:'必填'},{ min:6,message:'最短6位' }]}]" :maxLength="20" />
        </a-form-item>
        <a-form-item label="新密码">
          <a-input type="password" v-decorator="['newPwd', {rules: [{required: true,message:'必填'},{validator:passwordValidator,trigger:'blur'}]}]" :maxLength="20" />
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input type="password" v-decorator="['qrPwd', {rules: [{required: true,message:'必填'},{validator:passwordValidator,trigger:'blur'}]}]" :maxLength="20" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import PasswordValidator from 'password-validator'
import { updatePwd } from '@/api/user'

// 表单字段
const fields = ['oldPwd', 'newPwd', 'qrPwd']

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  },
  methods: {
    passwordValidator (rule, value, callback) {
      const schema = new PasswordValidator()
      schema
        .is().min(6, '最短6位') // Minimum length 6
        .is().max(20, '最长20位') // Maximum length 20
        .has().uppercase(1, '必须包含大写字母') // Must have uppercase letters
        .has().lowercase(1, '必须包含小写字母') // Must have lowercase letters
        .has().digits(1, '必须包含数字') // Must have at least 2 digits
        .has().symbols(1, '必须包含特殊字符')
        .has().not().spaces(1, '不能包含空格') // Should not have spaces
      const res = schema.validate(value, { details: true })
      if (res.length > 0) {
        callback(new Error(res[0].message))
      } else {
        callback()
      }
    },
    async handleOk () {
      this.loading = true
      this.form.validateFields(async (errors, values) => {
        if (errors) {
          this.loading = false
          return
        }
        // 修改
        const res = await updatePwd(values)
        this.loading = false
        if (res.code !== 0) return this.$message.error(res.msg)
        // 重置表单数据
        this.form.resetFields()
        // 刷新表格
        this.$message.info('修改成功')
        this.$emit('input', false)
      })
    },
    handleCancel () {
      this.form.resetFields()
      this.$emit('input', false)
    }
  }
}
</script>
