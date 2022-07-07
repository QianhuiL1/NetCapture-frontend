import request from '@/utils/request'
const prefix = '/scanInfo'

// 提交扫码信息
export function pushScanInfo(queryParams) {
    return request({
        url: prefix + '/pushScanInfoByQRCode',
        method: 'post',
        data: queryParams
    })
}