<template>
  <el-row :gutter="32">
    <el-col :xs="24" :sm="24" :lg="24">
      <h1 class="title_h1">
        {{ textInfoData.featureName }}
      </h1>
      <h2 class="title_h2">
        {{ textInfoData.buildEnv }}环境 {{ textInfoData.batchNo }}
      </h2>
      <h2 class="title_h3">
        {{ textInfoData.startTime }} - {{ textInfoData.endTime }} ({{ textInfoData.duration }}s)
      </h2>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="24">
      <div class="summary-widget__stats splash">
        <div class="splash__title">
          {{ textInfoData.caseNum }}
        </div>
        <div class="splash__subtitle">测试用例</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

export default {
  props: {
    textInfoData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

.title_h1 {
  margin-top: 0;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 20px;
  color: #1F2F3D;
}

.title_h2 {
  margin-top: 0;
  margin-bottom: 5px;
  font-weight: normal;
  font-size: 16px;
  color: #1F2F3D;
}

.title_h3 {
  margin-top: 0;
  margin-bottom: 5px;
  font-weight: normal;
  color: #999999;
  font-size: 15px;
}

.summary-widget__stats {
  padding: 2em 0;
}

.splash {
  margin: auto;
  text-align: center;
}

* {
  box-sizing: border-box;
}

div {
  display: block;
}

.splash__title {
  font-size: 3.5em;
  color: #2C3E50;
  line-height: 1;
}

.splash__subtitle {
  color: #999;
}

</style>

