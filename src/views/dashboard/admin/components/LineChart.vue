<template>
  <div id="lineChart" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'
import { caseResultTrend } from '@/api/report'

export default {
  mixins: [resize],
  props: {
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
      default: '220px'
    }
  },
  data() {
    return {
      loading: true, // 是否显示加载动画
      chartDom: '',
      myChart: '',
      option: '',
      temp: [] // 接口返回的数据
    }
  },
  created() {
    this.getCaseResultTrend()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getCaseResultTrend() {
      caseResultTrend().then(response => {
        this.loading = false
        this.temp = response.data
        this.$nextTick(() => {
          this.initChart()
        })
      }).catch(
        setTimeout(() => {
          this.loading = false
        }, 1.5 * 1000)
      )
    },
    initChart() {
      this.chartDom = document.getElementById('lineChart')
      this.myChart = echarts.init(this.chartDom)
      this.option = {
        color: ['rgb(103, 194, 58)', 'rgb(245, 108, 108)'],
        title: {
          text: '构建趋势'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['#' + this.temp[6].id, '#' + this.temp[5].id, '#' + this.temp[4].id, '#' + this.temp[3].id, '#' + this.temp[2].id, '#' + this.temp[1].id, '#' + this.temp[0].id]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '通过',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false, // 不显示小圆点
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(103, 194, 58)'
                },
                {
                  offset: 1,
                  color: 'rgb(103, 194, 58)'
                  // color: 'rgb(240, 249, 235)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [this.temp[6].casePassNum, this.temp[5].casePassNum, this.temp[4].casePassNum, this.temp[3].casePassNum, this.temp[2].casePassNum, this.temp[1].casePassNum, this.temp[0].casePassNum]
          },
          {
            name: '失败',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(245, 108, 108)'
                },
                {
                  offset: 1,
                  color: 'rgb(245, 108, 108)'
                  // color: 'rgb(254, 240, 240)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [this.temp[6].caseFailNum, this.temp[5].caseFailNum, this.temp[4].caseFailNum, this.temp[3].caseFailNum, this.temp[2].caseFailNum, this.temp[1].caseFailNum, this.temp[0].caseFailNum]
          }
        ]
      }
      this.option && this.myChart.setOption(this.option)
    }
  }
}
</script>
