<template>
  <el-row :gutter="30" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <box-card-total-pass :total-pass="totalPass" />
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <box-card-total-fail :total-fail="totalFail" />
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <box-card-newly-fail :newly-fail="newlyFail" />
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <box-card-keep-failing :keep-failing="keepFailing" />
    </el-col>
  </el-row>
</template>

<script>
import BoxCardKeepFailing from './BoxCardKeepFailing.vue'
import BoxCardTotalFail from './BoxCardTotalFail.vue'
import BoxCardTotalPass from './BoxCardTotalPass.vue'
import BoxCardNewlyFail from './BoxCardNewlyFail.vue'
import { panelGroup } from '@/api/report'

export default {
  components: {
    BoxCardNewlyFail,
    BoxCardTotalPass,
    BoxCardTotalFail,
    BoxCardKeepFailing
  },
  data() {
    return {
      totalPass: [{ id: null, casePassNum: null }],
      totalFail: [{ id: null, caseFailNum: null }],
      newlyFail: [{ id: null, newFailNum: null }],
      keepFailing: [{ id: null, keepFailingNum: null }]
    }
  },
  created() {
    this.getPanelGroup()
  },
  methods: {
    getPanelGroup() {
      panelGroup().then(response => {
        this.loading = false
        this.totalPass = response.data.totalPass
        this.totalFail = response.data.totalFail
        this.newlyFail = response.data.newlyFail
        this.keepFailing = response.data.keepFailing
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
.panel-group {
  margin-top: 2px;
  .card-panel-col {
    margin-bottom: 24px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
