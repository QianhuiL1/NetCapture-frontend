import request from '@/utils/request'

// 查询在线用户列表
export function list(query) {
  return request({
    url: '/',
    method: 'get',
    params: query
  })
}
