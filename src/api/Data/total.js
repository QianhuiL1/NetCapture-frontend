import request from '@/utils/request'
const prefix = '/totalEpidemic'

// 查询整体省份疫情列表
export function getNews(date) {
    return request({
        url: prefix + '/provinceList/' + date,
        method: 'get',
    })
}

// 根据日期查询整体全国疫情列表
export function getCountryList(date) {
    return request({
        url: prefix + '/country/' + date,
        method: 'get'
    })
}