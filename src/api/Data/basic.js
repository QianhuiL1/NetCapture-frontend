import request from '@/utils/request'
const prefix = '/todayEpidemic'

// 查询整体省份疫情列表
export function page(date) {
    return request({
        url: prefix + '/provinceList/' + date,
        method: 'get',
    })
}
// 查询当天全国疫情信息
export function getAll(date) {
    return request({
        url: prefix + '/country/' + date,
        method: 'get'
    })
}