import request from '@/utils/request'

// 运行脚本
export function run(data) {
  return request({
    url: '/script/run',
    method: 'post',
    data
  })
}

// 上传脚本
export function upload(formData) {
  return request({
    url: '/script/upload',
    method: 'post',
    data: formData
  })
}
