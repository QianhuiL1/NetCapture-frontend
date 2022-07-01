import request from '@/utils/request'
const prefix = '/scanInfo'

// 获取轨迹记录
export function trackList(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}

// 修改轨迹记录
export function trackUpdate(data) {
    return request({
        url: prefix,
        method: 'put',
        data: data
    })
}

// 删除轨迹记录
export function trackDelete(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}