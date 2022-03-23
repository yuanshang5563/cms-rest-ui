import axios from '../../axios'

/* 
 * 赛季管理模块
 */
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/crawler/footballSeasonController/findPage',
        method: 'post',
        data
    })
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/crawler/footballSeasonController/find',
        method: 'get',
        params
    })
}