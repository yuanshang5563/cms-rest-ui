import axios from '../../axios';

/* 
 * 联赛分析管理模块
 */
export const findLeagueMatch = (params) => {
    return axios({
        url: '/analysis/footballLeagueMatchAnalysisController/find',
        method: 'get',
        params
    });
}

export const findSeasonList = (params) => {
    return axios({
        url: '/analysis/footballSeasonAnalysisController/findSeasonList',
        method: 'get',
        params
    });
}

export const findSeasonCategoryList = (params) => {
    return axios({
        url: '/analysis/footballSeasonCategoryAnalysisController/findSeasonCategoryList',
        method: 'get',
        params
    });
}

export const findScoreList = (data) => {
    return axios({
        url: '/analysis/footballScoreAnalysisController/findScoreList',
        method: 'post',
        data
    });
}