import axios from '../../axios'

/* 
 * 总体爬虫管理模块
 */
// 联赛爬虫
export const handleLeagueMatchCrawler = () => {
    return axios({
        url: '/crawler/footballLeagueMatchController/startLeagueMatchCrawler',
        method: 'get'
    })
}
// 赛季爬虫
export const handleSeasonCrawler = () => {
    return axios({
        url: '/crawler/footballSeasonController/startSeasonCrawler',
        method: 'get'
    })
}
//类别爬虫
export const handleSeasonCategoryCrawler = () => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/startSeasonCategoryCrawler',
        method: 'get'
    })
}
//轮数爬虫
export const handleSeasonRoundCrawler = () => {
    return axios({
        url: '/crawler/footballSeasonCategoryController/startSeasonRoundCrawler',
        method: 'get'
    })
}
//积分爬虫
export const handleIntegralCrawler = () => {
    return axios({
        url: '/crawler/footballIntegralController/startIntegralCrawler',
        method: 'get'
    })
}
//比分爬虫
export const handleScoreCrawler = () => {
    return axios({
        url: '/crawler/footballScoreController/startScoreCrawler',
        method: 'get'
    })
}
//详情爬虫
export const handleScoreDetailCrawler = () => {
    return axios({
        url: '/crawler/footballScoreDetailController/startSeasonDetailCrawler',
        method: 'get'
    })
}

