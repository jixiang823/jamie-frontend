<template>
  <el-row :gutter="32">
    <el-col :xs="24" :sm="24" :lg="12">
      <text-info :text-info-data="textInfoData" />
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12">
      <pie-chart v-if="flag" :pie-chart-data="pieChartData" />
    </el-col>
  </el-row>
</template>

<script>
import TextInfo from './TextInfo.vue'
import PieChart from './PieChart.vue'
import { info } from '@/api/report'
import { parseTime } from '@/utils'

export default {
  components: {
    TextInfo,
    PieChart
  },
  data() {
    return {
      // 当数据获得的之后再进行子组件的渲染
      flag: false,
      // 文本模块数据
      textInfoData: {
        id: undefined,
        batchNo: '',
        featureName: '',
        buildEnv: '',
        caseNum: '',
        newlyFailNum: '',
        keepFailingNum: '',
        startTime: '',
        endTime: '',
        dateTime: '',
        duration: ''
      },
      // 饼图模块数据
      pieChartData: {
        casePassNum: '',
        caseFailNum: '',
        casePassRate: ''
      },
      // 是否显示加载动画
      loading: true
    }
  },
  created() {
    this.getReportInfo()
  },
  methods: {
    getReportInfo() {
      this.loading = true
      info().then(response => {
        this.textInfoData.id = response.data.id
        this.textInfoData.batchNo = response.data.batchNo
        this.textInfoData.featureName = response.data.featureName
        this.textInfoData.buildEnv = response.data.buildEnv
        this.textInfoData.caseNum = response.data.caseNum
        this.pieChartData.casePassNum = response.data.casePassNum
        this.pieChartData.caseFailNum = response.data.caseFailNum
        this.pieChartData.casePassRate = response.data.casePassRate
        this.textInfoData.newlyFailNum = response.data.newlyFailNum
        this.textInfoData.keepFailingNum = response.data.keepFailingNum
        this.textInfoData.dateTime = parseTime(response.data.startTime, '{y}/{m}/{d}')
        this.textInfoData.startTime = parseTime(response.data.startTime, '{h}:{i}:{s}')
        this.textInfoData.endTime = parseTime(response.data.endTime, '{h}:{i}:{s}')
        this.textInfoData.duration = response.data.duration / 1000
        this.loading = false
        this.flag = true
      }).catch(
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
