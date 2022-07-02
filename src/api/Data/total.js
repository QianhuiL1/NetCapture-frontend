import request from '@/utils/request'
const prefix = '/totalEpidemic'

// 查询整体疫情列表
export function getNews() {
    return request({
        url: prefix + '/list',
        method: 'get',
    })
}

// 根据日期查询整体省份疫情列表
export function getProvinceList(date) {
    return request({
        url: prefix + '/provinceList/' + date,
        method: 'get'
    })
}

// 根据日期查询全国疫情列表
export function getCountryList(date) {
    return request({
        url: prefix + '/country/' + date,
        method: 'get'
    })
}