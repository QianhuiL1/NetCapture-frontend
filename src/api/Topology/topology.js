import request from '@/utils/request'
const prefix = '/spreadtree'

// 查询传播链条列表
export function getSpreadList() {
    return request({
        url: prefix + '/Spreadtreelist',
        method: 'get',
    })
}

// 查询传播链条人员表
export function getPersonList() {
    return request({
        url: prefix + '/PersonInfolist',
        method: 'get',
    })
}

// 查询
export function getList() {
    return request({
        url: prefix + '/SpreadtreePersonInfolist',
        method: 'get',
    })
}