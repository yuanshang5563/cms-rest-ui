import axios from '../../axios'

/* 
 * 赛季类别管理模块
 */
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/findPage',
        method: 'post',
        data
    })
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/find',
        method: 'get',
        params
    })
}
