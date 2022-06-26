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
// export function trackList(id) {
//     return request({
//         url: prefix + '/' + id,
//         method: 'get'
//     })
// }
// 添加轨迹记录
export function trackAdd(data) {
    return request({
        url: prefix + '/create',
        method: 'post',
        data: data
    })
}

// 修改轨迹记录
export function trackUpdate(id, data) {
    return request({
        url: prefix + '/' + id,
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