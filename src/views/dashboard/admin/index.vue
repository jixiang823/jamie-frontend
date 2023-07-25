<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <test-summary-group />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="mix-line-bar-chart-wrapper">
          <mix-line-bar-chart />
        </div>
      </el-col>
    </el-row>
    <panel-group />
    <test-result-tab />
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup.vue'
import TestResultTab from './components/TestResultTable.vue'
import TestSummaryGroup from './components/TestSummaryGroup.vue'
import MixLineBarChart from './components/MixLineBarChart.vue'

export default {
  name: 'DashboardAdmin',
  components: {
    MixLineBarChart,
    TestSummaryGroup,
    PanelGroup,
    TestResultTab
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
  .mix-line-bar-chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 2px;
  }
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
