import axios from '../../axios';

/* 
 * 联赛分析管理模块
 */
// 联赛查询
export const findPage = (data) => {
    return axios({
        url: '/analysis/footballLeagueMatchAnalysisController/findPage',
        method: 'post',
        data
    });
}
