import axios from '../../axios';

/* 
 * 比分分析管理模块
 */
export const findScoreList = (data) => {
    return axios({
        url: '/analysis/footballScoreAnalysisController/findScoreList',
        method: 'post',
        data
    });
}
export const findFootballScore = (params) => {
    return axios({
        url: '/analysis/footballScoreAnalysisController/findFootballScore',
        method: 'get',
        params
    });
}
export const findFootballLeagueMatches = (params) => {
    return axios({
        url: '/analysis/footballScoreAnalysisController/findFootballLeagueMatches',
        method: 'get',
        params
    });
}