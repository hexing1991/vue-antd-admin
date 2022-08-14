<template>
  <a-modal :title="title" :width="500" :visible="visible" :confirmLoading="loading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <a-form-model ref="myForm" :model="form" :rules="rules" :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-form-model-item label="上级资源" prop="pid">
          <a-tree-select v-model="form.pid" style="width: 100%;" :tree-data="treeData" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="请选择上级资源"/>
        </a-form-model-item>
        <a-form-model-item label="资源类型" prop="resourceType">
          <a-select v-model="form.resourceType" style="width: 100%;" placeholder="请选择资源类型" allowClear>
            <a-select-option v-for="item in $store.state.dict.RESOURCE_TYPE" :key="item.itemValue">{{ item.itemName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="资源名称" prop="resourceName">
          <a-input v-model="form.resourceName" :maxLength="20" placeholder="请输入资源名称" />
        </a-form-model-item>
        <a-form-model-item label="资源URL" prop="resourceUrl">
          <a-select v-if="form.resourceType === 1" v-model="form.resourceUrl" style="width: 100%" placeholder="请选择URL">
            <a-select-option v-for="(v,r) in RouteMap" :key="r">{{ r }}</a-select-option>
          </a-select>
          <a-input v-else v-model="form.resourceUrl" :maxLength="50" placeholder="请输入资源URL" />
        </a-form-model-item>
        <a-form-model-item v-if="form.resourceType === 0 || form.resourceType === 1" label="资源图标" prop="resourceIcon">
          <a-select v-model="form.resourceIcon" style="width: 100%" placeholder="请选择资源图标" showSearch allowClear>
            <a-select-option key="无">无</a-select-option>
            <a-select-option v-for="(v,r) in icons" :key="r">
              <a-icon :component="icons[r]" /><span style="margin-left:10px;">{{ r }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sortNo">
          <a-input-number v-model="form.sortNo" :min="0" :max="1000" style="width: 100%;" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remarks">
          <a-textarea v-model="form.remarks" v-decorator="['remarks', {rules: [{max: 50}]}]" :maxLength="50" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
// import icons from '@/core/icons'
const icons = []
// import { RouteMap } from '@/config/router.config'
const RouteMap = []
// TODO
import { TreeSelect } from 'ant-design-vue'

// 表单字段
const fields = ['id', 'pid', 'resourceName', 'resourceUrl', 'resourceIcon', 'resourceType', 'sortNo', 'remarks']

export default {
  components: { ATreeSelect: TreeSelect },
  props: {
    tree: {
      type: Array,
      required: true,
      default: () => []
    },
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
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      RouteMap,
      icons,
      treeData: [],
      rules: {
        pid: [{ required: true, message: '必填' }],
        resourceName: [{ required: true, message: '必填' }, { min: 2, max: 20, message: '长度 2 至 50' }],
        resourceUrl: [{ required: true, message: '必填' }, { min: 2, max: 50, message: '长度 2 至 50' }],
        resourceType: [{ required: true, message: '必填' }],
        sortNo: [{ required: true, message: '必填' }]
      },
      form: {
        id: null,
        pid: null,
        resourceName: null,
        resourceUrl: null,
        resourceIcon: undefined,
        resourceType: undefined,
        sortNo: null,
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
    this.$watch('form.resourceType', val => {
      if (val !== 0 && val !== 1) {
        this.form = Object.assign({}, this.form, { resourceIcon: undefined })
      }
    })
    this.$watch('tree', data => {
      this.treeData = [{
        key: '00000000000000000000000000000000',
        title: '根节点',
        value: '00000000000000000000000000000000',
        children: [...data]
      }]
    })
  },
  methods: {
    handleOk () {
      this.$refs.myForm.validate(valid => valid && this.$emit('ok', this.form))
    },
    async handleCancel () {
      this.$refs.myForm.resetFields()
      this.$emit('cancel')
    }
  }
}
</script>
