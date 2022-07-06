import request from '@/utils/request'
const prefix = '/riskArea'

// 获取区域列表
export function regionList(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}

// 获取重点地区详细信息
export function getRegionInfo(id) {
    return request({
        url: prefix + '/' + id,
        method: 'get',
    })
}