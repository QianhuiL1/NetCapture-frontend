import request from '@/utils/request'
const prefix = '/system/ancestor'

// 根据编号获取行政区域
export function getAreaById(id) {
    return request({
        url: prefix + '/' + id,
        method: 'get',
    })
}