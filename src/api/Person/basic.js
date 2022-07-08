import request from '@/utils/request'
const prefix = '/personInfo'

// 查询普通人员记录
export function page(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}

// 通过personId查询普通人员记录
export function searchById(id) {
    return request({
        url: prefix + '/' + id,
        method: 'get'
    })
}

// 通过姓名查询普通人员记录
export function searchByName(data) {
    return request({
        url: prefix + '/listByName/' + data,
        method: 'get'
    })
}

// 根据区号查询普通人员信息列表
export function searchByArea(data) {
    return request({
        url: prefix + '/listByAncestors/' + data,
        method: 'get'
    })
}

// 修改人员信息
export function updatePersonInfo(data) {
    return request({
        url: prefix + '/',
        method: 'put',
        data: data
    })
}

// 删除一条人员信息
export function deletePersonInfo(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}

// 重置所有人员的健康状态
export function resetStatus() {
    return request({
        url: prefix + '/statusEmpty',
        method: 'put'
    })
}