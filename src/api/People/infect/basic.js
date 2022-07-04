import request from '@/utils/request'
const prefix = '/personInfo'

// 获取感染人员记录
export function infectList(queryParams) {
    return request({
        url: prefix + '/list',
        method: 'get',
        params: queryParams
    })
}

// 获取感染人员具体信息
export function infectInfo(id) {
    return request({
        url: prefix + '/' + id,
        method: 'get',
    })
}

// 添加感染人员记录
export function infectAdd(data) {
    return request({
        url: prefix,
        method: 'post',
        data: data
    })
}

// 修改感染人员记录
export function infectUpdate(data) {
    return request({
        url: prefix,
        method: 'put',
        data: data
    })
}

// 删除感染人员记录
export function infectDelete(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}

//获取某段时间内的感染人员记录
export function TimeList(startTime,endTime) {
    return request({
        url: prefix +'/listByTime/' + startTime + "&&" + endTime,
        method: 'get',
    })
}
