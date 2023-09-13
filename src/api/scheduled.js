import request from '@/utils/request'

// 启动定时任务
export function startTask(data) {
  return request({
    url: '/scheduled/start',
    method: 'post',
    data
  })
}

// 暂停定时任务
export function stopTask() {
  return request({
    url: '/scheduled/stop',
    method: 'post'
  })
}

// 重启定时任务
export function restartTask(data) {
  return request({
    url: '/scheduled/restart',
    method: 'post',
    data
  })
}

// 获取定时任务信息
export function queryTask() {
  return request({
    url: '/scheduled/query',
    method: 'get'
  })
}
