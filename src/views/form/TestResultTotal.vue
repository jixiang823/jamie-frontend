<template>
  <div class="app-container">
    <!--多条件模糊查询-->
    <div class="filter-container">
      <el-input v-model="listQuery.batchNo" placeholder="批次号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.featureName" placeholder="业务线" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.storyName" placeholder="业务名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.caseName" placeholder="用例名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.caseOwner" placeholder="用例作者" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.caseResult" placeholder="用例状态" clearable style="width: 150px" class="filter-item">
        <el-option label="通过" :value="true" />
        <el-option label="失败" :value="false" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="resetFilter">重置</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <!--表单列表-->
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;" @row-click="getCaseDetail" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70" :class-name="getSortClass('id')">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="批次号" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.batchNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行环境" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.buildEnv }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务线" width="155" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.featureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务名称" width="155" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例名称" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例步骤" width="105" align="center">
        <template slot-scope="scope">
          <el-tag effect="light" size="medium" type="info">{{ scope.row.caseStepNum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用例作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.caseOwner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用例状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag effect="light" size="medium" :type="scope.row.caseResult | statusFilter">{{ scope.row.caseResult ? "通过": "失败" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" width="165" align="center">
        <template slot-scope="scope">
          <span>{{ dateFormat(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求耗时" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.duration / 1000 + 's' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="fetchData()" />
    <!--表单详情页-->
    <el-dialog v-if="dialogFormVisible" title="执行步骤" width="90%" :visible.sync="dialogFormVisible" destroy-on-close>
      <!--时间轴搭配折叠面板-->
      <el-timeline>
        <!--展示API请求的时间-->
        <el-timeline-item v-for="(item, i) in detailList" :key="i" :timestamp="dateFormat(detailList[i].startTime)" :color="detailList[i].apiResult ? '#67C23A':'#F56C6C'" placement="top">
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
                      <span class="text-green-6">{{ item.duration / 1000 }}s</span>
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

  </div>
</template>

<script>
import { totalCaseList, detail } from '@/api/report'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  directives: { waves },
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
      total: 0, // 表单分页
      activeName: '1', // 手风琴面板默认开启的选项
      dialogFormVisible: false, // 控制弹窗展示
      list: null, // 用例列表
      detailList: null, // 用例详情
      listLoading: true, // 加载动画
      downloadLoading: false, // 下载excel
      // 多条件查询
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        batchNo: undefined,
        featureName: undefined,
        storyName: undefined,
        caseName: undefined,
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
    this.fetchData()
  },
  methods: {
    // 打开用例详情页
    getCaseDetail(row, index) {
      this.listLoading = true
      this.dialogFormVisible = true
      detail(row.id).then(response => {
        this.detailList = response.data
        this.listLoading = false
      }).catch(
        setTimeout(() => {
          this.listLoading = false
        }, 3000)
      )
    },
    // 获取用例列表(可排序筛选)
    fetchData() {
      this.listLoading = true
      totalCaseList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(
        setTimeout(() => {
          this.listLoading = false
        }, 3000)
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
      this.fetchData()
    },
    resetListQuery() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        batchNo: undefined,
        featureName: undefined,
        storyName: undefined,
        caseName: undefined,
        caseOwner: undefined,
        caseResult: undefined,
        sort: undefined
      }
    },
    //  重置搜索
    resetFilter() {
      this.resetListQuery()
      this.handleFilter()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'batchNo', 'buildEnv', 'featureName', 'storyName', 'caseName', 'caseStepNum', 'caseOwner', 'caseResult', 'startTime', 'duration']
        const filterVal = ['id', 'batchNo', 'buildEnv', 'featureName', 'storyName', 'caseName', 'caseStepNum', 'caseOwner', 'caseResult', 'startTime', 'duration']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'startTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
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

</style>
