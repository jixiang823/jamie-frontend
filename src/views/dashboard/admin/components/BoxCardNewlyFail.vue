<template>
  <el-card class="box-card-component">
    <div slot="header" class="box-card-header">
      <div class="box-card-panel">
        <div class="card-panel-icon-wrapper icon-newly-fail">
          <i class="el-icon-light-rain card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            新增失败
          </div>
          <count-to :start-val="0" :end-val="newlyFail[0].newlyFailNum" :duration="2600" class="card-panel-num-newly-fail" />
        </div>
      </div>
    </div>
    <div style="position:relative;" class="progress-item">
      <div id="newlyFail" :class="className" :style="{height:height,width:width}" />
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import CountTo from 'vue-count-to'

export default {
  components: { CountTo },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  mixins: [resize],
  props: {
    newlyFail: {
      type: Array,
      default: function() {
        return []
      }
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '150px'
    }
  },
  data() {
    return {
      chartDom: '',
      myChart: '',
      option: '',
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  // 监听来自父组件的值
  watch: {
    newlyFail: {
      handler(newlyFail) {
        this.$nextTick(() => {
          this.initChart(newlyFail)
        })
      }
    }
  },
  methods: {
    initChart(newlyFail) {
      this.chartDom = document.getElementById('newlyFail')
      this.myChart = echarts.init(this.chartDom)
      this.option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          show: true,
          type: 'category',
          data: ['#' + newlyFail[6].id, '#' + newlyFail[5].id, '#' + newlyFail[4].id, '#' + newlyFail[3].id, '#' + newlyFail[2].id, '#' + newlyFail[1].id, '#' + newlyFail[0].id]
        },
        yAxis: {
          show: true,
          type: 'value'
        },
        grid: {
          width: '100%', // 宽度
          height: '60%', // 高度
          top: '5%',
          left: '0%', // 控制左边距
          right: '0%', // 控制右边距
          bottom: '5%', // 控制底距
          containLabel: true
        },
        series: [
          {
            data: [newlyFail[6].newlyFailNum, newlyFail[5].newlyFailNum, newlyFail[4].newlyFailNum, newlyFail[3].newlyFailNum, newlyFail[2].newlyFailNum, newlyFail[1].newlyFailNum, newlyFail[0].newlyFailNum],
            showSymbol: true, // 是否默认展示圆点
            // symbol: 'circle', // 设置标记的图形为circle
            symbolSize: 5, // 设定实心点的大小
            type: 'line',
            lineStyle: {
              color: '#fc8452' // 折线线条颜色
            },
            itemStyle: {
              color: '#fc8452' // 设置线条上点的颜色
            },
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#fc8452'
                },
                {
                  offset: 1,
                  color: '#FFFFFF'
                }
              ])
            }
          }
        ]
      }
      this.option && this.myChart.setOption(this.option)
    }
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 108px;
  }
  .box-card-panel {
    height: 108px; // 第一排的高度 原108
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fc8452; // 修改背景色
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
    }

    .icon-newly-fail {
      color: #fff;
    }

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
      margin: 26px 26px 26px 0;

      .card-panel-text {
        line-height: 18px;
        color: #FFFFFF;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
      .card-panel-num-newly-fail {
        font-size: 20px;
        color: #FFFFFF;
      }
    }

  }
  .progress-item {
    margin-bottom: -50px; // 底部距离
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
