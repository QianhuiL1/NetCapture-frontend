import request from '@/utils/request'
const prefix = '/sojourn'

// 通过区号查询旅居人员信息
export function page(ancestor) {
    return request({
        url: prefix + '/listByAncestor/' + ancestor,
        method: 'get'
    })
}

// 根据身份证号查询旅居登记列表
export function searchById(id) {
    return request({
        url: prefix + '/listByPeopleId/' + id,
        method: 'get',
    })
}

// 增加一条旅居登记信息
export function add(data) {
    return request({
        url: prefix + '/',
        method: 'post',
        data: data
    })
}

// 修改旅居信息
export function update(data) {
    return request({
        url: prefix + '/',
        methods: 'post',
        data: data
    })
}

//删除旅居信息
export function deleteById(id) {
    return request({
        url: prefix + '/' + id
    })
}