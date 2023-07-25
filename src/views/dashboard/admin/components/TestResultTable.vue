<template>
  <el-row :gutter="40" class="case-list">
    <el-col :xs="24" :sm="24" :lg="24">
      <el-table v-loading="listLoading" :data="list" :row-class-name="tableRowClassName" element-loading-text="Loading" border fit @sort-change="sortChange">
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70" :class-name="getSortClass('id')">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" width="155" align="center">
          <template slot-scope="scope">
            {{ scope.row.projectName }}
          </template>
        </el-table-column>
        <el-table-column label="模块名称" width="155" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.moduleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用例名称" width="300" align="center">
          <template slot-scope="scope">
            <div class="text-wrapper">
              <span class="link-type text" @click="getCaseDetail(scope.row)">{{ scope.row.caseName }} ({{ scope.row.caseStepNum }})</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用例作者" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.caseOwner }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" width="165" align="center">
          <template slot-scope="scope">
            <span>{{ dateFormat(scope.row.caseStartTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求耗时" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.caseDuration / 1000 + 's' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行结果" width="110" align="center" :filters="[{ text: '测试通过', value: 1 }, { text: '新增失败', value: 2 }, { text: '持续失败', value: 3 }]" :filter-method="filterTag" filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag effect="plain" size="medium" :type="scope.row.caseResult | statusFilter" @click="getCaseDetail(scope.row)">{{ scope.row.caseResult ? "测试通过": scope.row.newlyFail ? "新增失败":"持续失败" }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--用例详情页 v-if配合destroy-on-close，当页面关闭再打开，会重新渲染el-dialog-->
      <el-dialog v-if="dialogFormVisible" title="执行步骤" width="90%" :visible.sync="dialogFormVisible" destroy-on-close>
        <!--时间轴搭配折叠面板-->
        <el-timeline>
          <!--展示API请求的时间-->
          <el-timeline-item v-for="(item, i) in detailList" :key="i" :timestamp="dateFormat(detailList[i].apiStartTime)" :color="detailList[i].apiResult ? '#67C23A':'#F56C6C'" placement="top">
            <el-collapse>
              <el-collapse-item>
                <template slot="title" class="collapse-title">
                  <!-- 请求结果 -->
                  <div class="mr-4">
                    <el-tag effect="light" size="medium" :type="item.apiResult | statusFilter">{{ item.apiResult ? "通过":"失败" }}</el-tag>
                  </div>
                  <!-- 请求方式 -->
                  <span class="pui-g-ui-kit-request-method-icon-index-container" :style="activation(item.requestMethod)" style="min-width: 50px;">{{ item.requestMethod }}</span>
                  <!-- 请求路径 -->
                  <div class="flex-1 items-center ml-1 truncate">
                    <span>{{ item.requestPath }}</span>
                  </div>
                  <!-- API名称 -->
                  <div class="flex-1 truncate ml-4" style="flex-grow: 2;">
                    <span>{{ item.apiName }}</span>
                  </div>
                  <!-- 状态码和耗时 -->
                  <div class="flex flex-wrap select-text ml-3 w-80">
                    <div class="wrapper flex w-full">
                      <div class="text-sm">
                        <span>状态码: </span>
                        <span class="text-sm text-green-6">{{ item.responseCode }} </span>
                      </div>
                      <div class="ml-3 text-sm">
                        <span>耗时: </span>
                        <span class="text-green-6">{{ item.apiDuration / 1000 }}s</span>
                      </div>
                    </div>
                  </div>
                </template>
                <!--保持requestBody的格式-->
                <div style="white-space: pre-wrap;">
                  <el-tabs type="border-card">
                    <el-tab-pane label="请求">
                      <el-tabs type="border-card">
                        <el-tab-pane label="Request Body">{{ item.requestBody }}</el-tab-pane>
                        <el-tab-pane label="Request Headers">{{ item.requestHeader }}</el-tab-pane>
                      </el-tabs>
                    </el-tab-pane>
                    <el-tab-pane label="响应数据">
                      <el-tabs type="border-card">
                        <el-tab-pane label="Response Body">{{ JSON.parse(item.responseBody) }}</el-tab-pane>
                        <el-tab-pane label="Response Headers">{{ item.responseHeader }}</el-tab-pane>
                      </el-tabs>
                    </el-tab-pane>
                    <el-tab-pane label="断言结果">{{ item.assertMessage.length===0 ? "符合预期" : item.assertMessage }}</el-tab-pane>
                  </el-tabs>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import { list, detail, testcaseList } from '@/api/report'
import { parseTime } from '@/utils'

export default {
  components: {
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  // 用例详情页的标题
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '1', // 手风琴面板默认开启的选项
      dialogFormVisible: false, // 控制弹窗展示
      list: null, // 用例列表
      detailList: null, // 用例详情
      listLoading: true, // 加载动画
      // 多条件查询
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        batchNo: undefined,
        caseName: undefined,
        moduleName: undefined,
        caseOwner: undefined,
        caseResult: undefined,
        sort: undefined
      }
    }
  },
  computed: {
    activation() {
      // 不同文字显示不同颜色
      return (requestMethod) => {
        if (requestMethod === 'GET') {
          return { 'color': '#409EFF' }
        }
        if (requestMethod === 'POST') {
          return { 'color': '#E6A23C' }
        }
      }
    }
  },
  created() {
    this.getCaseList()
  },
  methods: {
    // 打开用例详情页
    getCaseDetail(row) {
      this.listLoading = true
      this.dialogFormVisible = true
      detail(row.id).then(response => {
        this.detailList = response.data
        this.listLoading = false
      }).catch(
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      )
    },
    // 每行根据状态显示不同的颜色
    tableRowClassName(rowIndex) {
      const caseResult = rowIndex.row.caseResult
      if (caseResult === true) {
        return 'success-row'
      } else {
        return 'danger-row'
      }
    },
    // 用例列表数据 (废弃暂未使用,无排序功能)
    fetchData() {
      this.listLoading = true
      list().then(response => {
        this.list = response.data
        this.listLoading = false
      }).catch(
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      )
    },
    // 获取用例列表(可排序筛选)
    getCaseList() {
      this.listLoading = true
      testcaseList(this.listQuery).then(response => {
        this.list = response.data.list
        this.listLoading = false
      }).catch(
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      )
    },
    // 转换时间格式
    dateFormat(timestamp) {
      return parseTime(timestamp, '{y}-{m}-{d} {h}:{i}:{s}')
    },
    // 排序
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getCaseList()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    // 筛选结果
    filterTag(value, row) {
      let status
      if (row.caseResult === true) {
        status = 1
      }
      if (row.caseResult === false) {
        if (row.newlyFail === true) {
          status = 2
        }
        if (row.keepFailing === true) {
          status = 3
        }
      }
      console.log('status:' + status)
      return status === value
    }
  }
}
</script>

<!--scss改为css,为了支持表格每行根据状态显示不同的颜色-->
<style lang="css" scoped>
.case-list {
  margin-top: 2px;
  border-color: rgba(0, 0, 0, .05);
}

/*detail样式 BEGIN*/
::v-deep .collapse-title {
  flex: 1 0 90%;
  order: 1;
}
.mr-4 {
  margin-right: 1rem;
}
.pui-g-ui-kit-request-method-icon-index-container {
  display: inline-flex !important;
  align-items: center;
  height: 24px;
  margin-right: 4px;
  font-weight: 700;
  font-size: 12px;
  border-radius: 4px;
}

:root .text-green-6 {
  color: #49aa19;
}
:root .text-orange-6 {
  color: #d87a16;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-1 {
  margin-left: .25rem;
}

.flex-1 {
  flex: 1 1;
}

.items-center {
  align-items: center;
}

.element.style {
  flex-grow: 2;
}

.ml-4 {
  margin-left: 1rem;
}

.flex {
  display: flex;
}

.w-80 {
  width: 20rem;
}

.select-text {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.ml-3 {
  margin-left: .75rem;
}

.flex-wrap {
  flex-wrap: wrap;
}

.w-full {
  width: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.text-sm {
  font-size: .875rem;
}

/*detail样式 END*/
.text-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px; /*文本区域宽度*/
}

.text {
  flex: 10;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step {
  min-width: 40px; /*标签宽度*/
  margin-left: 5px;
}

.el-button--mini.is-round {
  border: none;
}

/*表格每行根据用例状态显示不同的颜色*/
.el-table >>> .danger-row {
  background: #fef0f0;
}

.el-table >>> .success-row {
  background: #f0f9eb;
}

</style>
