import request from '@/utils/request'
const prefix = '/epidemicEvent'

// 查询疫情新闻列表
export function getNews() {
    return request({
        url: prefix + '/list',
        method: 'get',
    })
}