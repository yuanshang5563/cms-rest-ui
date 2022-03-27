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
//比分爬虫
export const handleScoreCrawler = (params) => {
  return axios({
    url: '/crawler/footballScoreController/startScoreCrawlerBySeasonCategory',
    method: 'get',
    params
  })
}
//详情爬虫
export const handleScoreDetailCrawler = (params) => {
  return axios({
    url: '/crawler/footballScoreDetailController/startSeasonDetailCrawlerBySeasonCategory',
    method: 'get',
    params
  })
}
