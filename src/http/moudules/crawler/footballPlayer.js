import axios from '../../axios'

/* 
 * 球队管理模块
 */
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/crawler/footballPlayerController/findPage',
        method: 'post',
        data
    })
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/crawler/footballPlayerController/find',
        method: 'get',
        params
    })
}