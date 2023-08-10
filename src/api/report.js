import request from '@/utils/request'

// 获取dashboard基本信息(饼图)
export function info() {
  return request({
    url: `/jmeter/report/info`,
    method: 'get'
  })
}

// TODO 未使用 放在dashboard 获取最新用例信息列表(表单)
export function latestCaseList() {
  return request({
    url: '/jmeter/report/list/latest',
    method: 'get'
  })
}

// TODO 放在表单页 分页多条件查询
export function totalCaseList(data) {
  return request({
    url: '/jmeter/report/list/total',
    method: 'post',
    data
  })
}

// 获取用例步骤信息
export function detail(caseId) {
  return request({
    url: `/jmeter/report/detail/${caseId}`,
    method: 'get'
  })
}

// 获取最新用例信息列表(表单)
export function caseResultTrend() {
  return request({
    url: '/jmeter/report/trend/case-result',
    method: 'get'
  })
}

// panel-group total-pass
export function panelGroup() {
  return request({
    url: '/jmeter/report/trend/panel-group',
    method: 'get'
  })
}
