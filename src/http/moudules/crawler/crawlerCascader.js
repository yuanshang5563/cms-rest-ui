import axios from '../../axios'

/* 
 * cascader级联
 */

// 获取联赛的级联数据
export const findLeagueMatchCascaderItem = () => {
    return axios({
        url: '/crawler/footballLeagueMatchController/findLeagueMatchCascaderItem',
        method: 'get'
    })
}

// 获取该联赛的赛季级联数据
export const findSeasonCascaderItemByLeagueMatchId = (params) => {
    return axios({
        url: '/crawler/footballSeasonController/findSeasonCascaderItemByLeagueMatchId',
        method: 'get',
        params
    })
}
// 获取该赛季的赛季类别级联数据
export const findSeasonCascaderItemBySeasonId = (params) => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/findSeasonCascaderItemBySeasonId',
        method: 'get',
        params
    })
  }