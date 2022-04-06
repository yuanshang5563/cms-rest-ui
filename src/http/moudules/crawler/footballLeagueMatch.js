import axios from '../../axios';

/* 
 * 联赛管理模块
 */
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/crawler/footballLeagueMatchController/findPage',
        method: 'post',
        data
    });
}
// 查找用户
export const find = (params) => {
    return axios({
        url: '/crawler/footballLeagueMatchController/find',
        method: 'get',
        params
    })
}

// 赛季爬虫
export const handleSeasonCrawler = (params) => {
    return axios({
        url: '/crawler/footballSeasonController/startSeasonCrawlerByLeagueMatch',
        method: 'get',
        params
    })
}
//类别爬虫
export const handleSeasonCategoryCrawler = (params) => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/startSeasonCategoryCrawlerByLeagueMatch',
        method: 'get',
        params
    })
}
//轮数爬虫
export const handleSeasonRoundCrawler = (params) => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/startSeasonRoundCrawlerByLeagueMatch',
        method: 'get',
        params
    })
}
//积分爬虫
export const handleIntegralCrawler = (params) => {
    return axios({
        url: '/crawler/footballIntegralController/startIntegralCrawlerByLeagueMatch',
        method: 'get',
        params
    })
}
//比分爬虫
export const handleScoreCrawler = (params) => {
    return axios({
        url: '/crawler/footballScoreController/startScoreCrawlerByLeagueMatch',
        method: 'get',
        params
    })
}
//详情爬虫
export const handleScoreDetailCrawler = (params) => {
    return axios({
        url: '/crawler/footballScoreDetailController/startSeasonDetailCrawlerByLeagueMatch',
        method: 'get',
        params
    })
}
