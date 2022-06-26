import request from '@/utils/request'
const prefix = '/idfs/personInfo'

// 获取感染人员记录
export function infectList(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}

// 获取感染人员具体信息
export function infectInfo(id) {
    return request({
        url: prefix + '/' + id,
        method: 'get',
    })
}

// 添加感染人员记录
export function infectAdd(data) {
    return request({
        url: prefix + '/create',
        method: 'post',
        data: data
    })
}

// 修改感染人员记录
export function infectUpdate(id, data) {
    return request({
        url: prefix + '/' + id,
        method: 'put',
        data: data
    })
}

// 删除感染人员记录
export function infectDelete(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}