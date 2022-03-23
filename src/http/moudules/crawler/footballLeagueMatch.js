import axios from '../../axios'

/* 
 * 联赛管理模块
 */
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/crawler/footballLeagueMatchController/findPage',
        method: 'post',
        data
    })
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/crawler/footballLeagueMatchController/find',
        method: 'get',
        params
    })
}

