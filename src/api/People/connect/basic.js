import request from '@/utils/request'
const prefix = '/system/api/v1/dutyUser'

// 获取次密接人员记录
export function List2(queryParams) {
    return request({
        url: prefix + '/pageGroup',
        method: 'get',
        params: queryParams
    })
}

// 添加密接人员记录
export function connectAdd2(data) {
    return request({
        url: prefix + '/create',
        method: 'post',
        data: data
    })
}

// 修改次密接人员记录
export function connectUpdate2(id, data) {
    return request({
        url: prefix + '/' + id,
        method: 'put',
        data: data
    })
}

// 删除次密接人员记录
export function connectDelete2(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}