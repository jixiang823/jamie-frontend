<template>
  <div class="card-panel-description">
    <div class="card-panel-text">
      <h5>20230701001</h5>
      <h5>11:11:11~11:11:15 (400ms)</h5>
      测试用例
    </div>
    <count-to :start-val="0" :end-val="100" :duration="2600" class="card-panel-num-total" />
  </div>
</template>

<script>
import resize from './mixins/resize'
import CountTo from 'vue-count-to'
export default {
  components: { CountTo },
  mixins: [resize]
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
    background: #DC143C; // 修改背景色
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
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
      .card-panel-num-total {
        font-size: 20px;
        color: #FFFFFF;
      }
    }

  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
