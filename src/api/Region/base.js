import request from '@/utils/request'
const prefix = '/ancestor'

// 获取区域列表
export function regionList(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}

// 获取重点地区详细信息
export function getAncestor(id) {
    return request({
        url: '/system/dept/' + id,
        method: 'get',
    })
}