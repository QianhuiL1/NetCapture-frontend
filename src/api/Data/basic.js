import request from '@/utils/request'
const prefix = '/todayEpidemic'

// 查询整体省份疫情列表
export function page() {
    return request({
        url: prefix + '/provinceList',
        method: 'get',
    })
}