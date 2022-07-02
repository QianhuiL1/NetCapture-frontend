import request from '@/utils/request'
const prefix = '/ancestor'

// 根据编号获取行政区域
export function getAreaById(id) {
    return request({
        url: prefix + '/list/listByID/' + id,
        method: 'get',
    })
}