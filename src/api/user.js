import request from '@/utils/request'

// 注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

// 登出
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
