<template>
  <a-card :bordered="false">
    <a-form layout="inline" style="margin-bottom:10px;">
      <a-form-item label="开始时间">
        <a-date-picker show-time style="width:200px;" v-model="queryParam.strBeginTime" valueFormat="YYYY-MM-DD HH:mm:ss" :allowClear="false" />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker show-time style="width:200px;" v-model="queryParam.strEndTime" valueFormat="YYYY-MM-DD HH:mm:ss" :allowClear="false" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
        <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
      </a-form-item>
    </a-form>
    <s-table ref="table" rowKey="id" :scroll="{ x: 1500 }" :columns="columns" :data="loadData" showPagination="true" bordered>
      <template #date="text">{{ text.substring(0,10) }}</template>
      <template #name="text">{{ stationDict[text] }}</template>
    </s-table>
  </a-card>
</template>

<script>
import STable from '@/components/table'
import { DatePicker } from 'ant-design-vue'
import { page } from '@/api/log'
import moment from 'moment'

const columns = [{
  title: '序号',
  dataIndex: '_indexNum',
  width: 70,
  align: 'center'
},
{
  title: '请求路径',
  dataIndex: 'reqUrl',
  width: 350,
  ellipsis: true
},
{
  title: 'IP',
  dataIndex: 'ipAdr',
  width: 200,
  align: 'center'
},
{
  title: '用户',
  dataIndex: 'userName',
  width: 200,
  align: 'center'
},
{
  title: '请求日期',
  dataIndex: 'gmtCreate',
  width: 200,
  align: 'center'
}]

export default {
  name: 'SysLog',
  components: {
    STable,
    ADatePicker: DatePicker
  },
  data () {
    return {
      columns,
      queryParam: {
        strBeginTime: moment().format('YYYY-MM-DD 00:00:00'),
        strEndTime: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  mounted () {
    this.$refs.table.refresh(true)
  },
  methods: {
    resetSearchForm () {
      this.queryParam.strBeginTime = moment().format('YYYY-MM-DD 00:00:00')
      this.queryParam.strEndTime = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    loadData (parameter) {
      const req = Object.assign({}, parameter, this.queryParam)
      return page(req)
    }
  }
}
</script>
