import request from '@/utils/request'
const prefix = '/personInfo'

// 生成次密接人员记录
export function connectCreate(address) {
    return request({
        url: prefix + '/updateSecondContact/' + address,
        method: 'put'
    })
}
// 添加密接人员记录
export function connectAdd1(data) {
    return request({
        url: prefix + '/create',
        method: 'post',
        data: data
    })
}

// 修改密接人员记录
export function connectUpdate1(id, data) {
    return request({
        url: prefix + '/' + id,
        method: 'put',
        data: data
    })
}

// 删除密接人员记录
export function connectDelete1(id) {
    return request({
        url: prefix + '/' + id,
        method: 'delete'
    })
}