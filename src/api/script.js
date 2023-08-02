import request from '@/utils/request'

// 运行指定jmx脚本
export function run(data) {
  return request({
    url: '/jmeter/script/run',
    method: 'post',
    data
  })
}
