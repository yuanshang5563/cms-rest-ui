import axios from '../../axios'

/* 
 * 比分数据管理模块
 */
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/crawler/footballScoreController/findPage',
        method: 'post',
        data
    })
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/crawler/footballScoreController/find',
        method: 'get',
        params
    })
}