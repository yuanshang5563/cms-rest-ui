import Vue from 'vue';
import vuex from 'vuex';

Vue.use(vuex);

import app from './modules/app';
import iframe from './modules/iframe';
import user from './modules/user';
import menu from './modules/menu';
import dict from './modules/dict';
import tab from './modules/tab';
import footballLeagueMatch from './modules/crawler/footballLeagueMatch';
import footballSeason from './modules/crawler/footballSeason';
import footballSeasonCategory from './modules/crawler/footballSeasonCategory';
import footballScore from './modules/crawler/footballScore';
import footballScoreDetail from './modules/crawler/footballScoreDetail';
import footballPlayer from './modules/crawler/footballPlayer';
import footballTeam from './modules/crawler/footballTeam';
import matchSeasonCategoryCascader from './modules/common/matchSeasonCategoryCascader';
import footballIntegral from './modules/crawler/footballIntegral';
import footballLeagueMatchAnalysis from './modules/analysis/footballLeagueMatchAnalysis';
import footballSeasonCategoryAnalysis from './modules/analysis/footballSeasonCategoryAnalysis';
import footballScoreAnalysis from './modules/analysis/footballScoreAnalysis';

const store = new vuex.Store({
    modules: {
        app: app,
        tab: tab,
        iframe: iframe,
        user: user,
        menu: menu,
        dict: dict,
        footballLeagueMatch,
        footballSeason,
        footballSeasonCategory,
        footballScore,
        footballScoreDetail,
        footballPlayer,
        footballSeason,
        footballTeam,
        matchSeasonCategoryCascader,
        footballIntegral,
        footballLeagueMatchAnalysis,
        footballSeasonCategoryAnalysis,
        footballScoreAnalysis
    }
})

export default store;