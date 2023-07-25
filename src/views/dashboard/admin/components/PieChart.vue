<template>
  <div id="pieChart" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    pieChartData: {
      type: Object,
      default: function() {
        return {}
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
      default: '220px'
    }
  },
  data() {
    return {
      chartDom: '',
      myChart: '',
      option: '',
      // 是否显示加载动画
      loading: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.pieChartData)
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(pieChartData) {
      this.chartDom = document.getElementById('pieChart')
      this.myChart = echarts.init(this.chartDom)
      this.option = {
        title: {
          show: false,
          // text: pieChartData.batchNo,
          left: 'left',
          textStyle: {
            color: '#666',
            fontStyle: 'normal', // 字体风格,'normal','italic','oblique'
            fontWeight: 'bold', // 字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            fontFamily: 'sans-serif', // 字体系列
            fontSize: 18 // 字体大小
          },
          // subtext: pieChartData.projectStartTime + ' - ' + pieChartData.projectEndTime + ' (' + pieChartData.projectDuration + 's ) ',
          subtextStyle: {}
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false, // 标签展示开关
          orient: 'vertical',
          icon: 'square', // 标签形状
          left: 'left',
          bottom: '50%',
          textStyle: {
            fontFamily: '微软雅黑',
            color: '#666', // 文字的颜色
            fontSize: 14, // 文字的字号
            lineHeight: 12 // 行高
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '50%'], // 第一个参数调节左右,第二个参数调节上下
            color: ['rgb(103, 194, 58)', 'rgb(245, 108, 108)'], // 饼图颜色
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 2,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center',
              color: '#4c4a4a',
              formatter: '{total|' + pieChartData.casePassRate * 100 + '%}',
              rich: {
                total: {
                  fontSize: 32,
                  fontWeight: 'bold',
                  fontFamily: 'sans-serif',
                  color: '#666'
                }
              }
            },
            labelLine: {
              show: false,
              tooltip: {
                show: false
              }
            },
            data: [
              { value: pieChartData.casePassNum, name: '通过' },
              { value: pieChartData.caseFailNum, name: '失败' }
            ]
          }
        ]
      }
      this.myChart.setOption(this.option)
    }
  }
}
</script>
