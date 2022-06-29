import request from '@/utils/request'
const prefix = '/positiveTravel'

// 获取轨迹记录
export function travelList(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}
// 添加轨迹记录
export function travelAdd(data) {
    return request({
        url: prefix,
        method: 'post',
        data: data
    })
}

// 修改轨迹记录
export function travelUpdate(data) {
    return request({
        url: prefix,
        method: 'put',
        data: data
    })
}

// 删除轨迹记录
export function travelDelete(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}