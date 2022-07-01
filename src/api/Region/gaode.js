const prefix = 'https://restapi.amap.com/v3/config/district?key=07d2cea2e82dad81662144b424901eaf&'

// 获取区域列表
export function regionSearch(region) {
    return request({
        url: prefix + 'keywords=' + region,
        method: 'get',
    })
}