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

// 根据区号查询普通人员信息列表
export function searchByArea(data) {
    return request({
        url: prefix + '/listByAncestors/' + data,
        method: 'get'
    })
}