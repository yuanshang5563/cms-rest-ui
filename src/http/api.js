/* 
 * 接口统一集成模块
 */
import * as login from './moudules/login';
import * as user from './moudules/user';
import * as dept from './moudules/dept';
import * as role from './moudules/role';
import * as menu from './moudules/menu';
import * as dict from './moudules/dict';
import * as log from './moudules/log';
import * as dictGroup from './moudules/dictGroup';
import * as param from './moudules/param';
import * as footballLeagueMatch from './moudules/crawler/footballLeagueMatch';
import * as footballSeason from './moudules/crawler/footballSeason';
import * as footballTeam from './moudules/crawler/footballTeam';
import * as footballPlayer from './moudules/crawler/footballPlayer';
import * as footballCrawlerManage from './moudules/crawler/footballCrawlerManage';
import * as footballSeasonCategory from './moudules/crawler/footballSeasonCategory';
import * as footballScore from './moudules/crawler/footballScore';
import * as footballScoreDetail from './moudules/crawler/footballScoreDetail';
import * as matchSeasonCategoryCascader from './moudules/common/matchSeasonCategoryCascader';
import * as footballIntegral from './moudules/crawler/footballIntegral';
import * as footballLeagueMatchAnalysis from './moudules/analysis/footballLeagueMatchAnalysis';
import * as footballSeasonCategoryAnalysis from './moudules/analysis/footballSeasonCategoryAnalysis';


// 默认全部导出
export default {
    login,
    user,
    dept,
    role,
    menu,
    dict,
    dictGroup,
    log,
    param,
    footballLeagueMatch,
    footballSeason,
    footballTeam,
    footballPlayer,
    footballCrawlerManage,
    footballSeasonCategory,
    footballScore,
    footballScoreDetail,
    matchSeasonCategoryCascader,
    footballIntegral,
    footballLeagueMatchAnalysis,
    footballSeasonCategoryAnalysis
}