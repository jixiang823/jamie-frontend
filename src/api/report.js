import request from '@/utils/request'

// 获取dashboard基本信息(饼图)
export function info() {
  return request({
    url: `/jmeter/report/info`,
    method: 'get'
  })
}

// 获取最新用例信息列表(表单)
export function list() {
  return request({
    url: '/jmeter/report/list/latest',
    method: 'get'
  })
}

export function testcaseList(data) {
  return request({
    url: '/jmeter/report/list',
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
