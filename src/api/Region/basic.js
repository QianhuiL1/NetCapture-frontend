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