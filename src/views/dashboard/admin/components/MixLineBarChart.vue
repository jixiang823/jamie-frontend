<template>
  <div id="mixLineBarChart" :class="className" :style="{height:height,width:width}" />
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
      this.chartDom = document.getElementById('mixLineBarChart')
      this.myChart = echarts.init(this.chartDom)
      this.option = {
        title: {
          text: '构建趋势'
        },
        grid: {
          left: '0%', // 控制左边距
          right: '0%', // 控制右边距
          bottom: '5%', // 控制底距
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['通过', '失败', '通过率']
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '#' + this.temp[6].id,
              '#' + this.temp[5].id,
              '#' + this.temp[4].id,
              '#' + this.temp[3].id,
              '#' + this.temp[2].id,
              '#' + this.temp[1].id,
              '#' + this.temp[0].id
            ],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            min: 0,
            max: this.temp[6].caseNum,
            interval: 1,
            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            show: false,
            type: 'value',
            min: 0,
            max: 100,
            interval: 20
          }
        ],
        series: [
          {
            name: '通过',
            type: 'bar',
            color: 'rgb(103, 194, 58)',
            tooltip: {
              valueFormatter: function(value) {
                return value
              }
            },
            data: [
              this.temp[6].casePassNum,
              this.temp[5].casePassNum,
              this.temp[4].casePassNum,
              this.temp[3].casePassNum,
              this.temp[2].casePassNum,
              this.temp[1].casePassNum,
              this.temp[0].casePassNum
            ]
          },
          {
            name: '失败',
            type: 'bar',
            color: 'rgb(245, 108, 108)',
            tooltip: {
              valueFormatter: function(value) {
                return value
              }
            },
            data: [
              this.temp[6].caseFailNum,
              this.temp[5].caseFailNum,
              this.temp[4].caseFailNum,
              this.temp[3].caseFailNum,
              this.temp[2].caseFailNum,
              this.temp[1].caseFailNum,
              this.temp[0].caseFailNum
            ]
          },
          {
            name: '通过率',
            type: 'line',
            color: '#fac858',
            smooth: true,
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function(value) {
                return value + ' %'
              }
            },
            data: [
              this.temp[6].casePassRate * 100,
              this.temp[5].casePassRate * 100,
              this.temp[4].casePassRate * 100,
              this.temp[3].casePassRate * 100,
              this.temp[2].casePassRate * 100,
              this.temp[1].casePassRate * 100,
              this.temp[0].casePassRate * 100
            ]
          }
        ]
      }
      this.option && this.myChart.setOption(this.option)
    }
  }
}
</script>
