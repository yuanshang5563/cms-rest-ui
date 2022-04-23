/**
 * 保存赛季类别分析管理相关数据
 */
export default {
    state: {
        footballLeagueMatches: [],
        footballScore: null,
        footballScoreQueryParams: null,
        homeAndAwayTeamScoreList: [],  //列表数据
        homeAndAwayTeamScoreQueryParams: null, //分数查询参数map
        homeTeamScoreList: [],
        homeTeamScoreQueryParams: null, //赛季查询参数map
        awayTeamScoreList: [],
        awayTeamScoreQueryParams: null, //类别查询参数map
    },
    getters: {
   
    },
    mutations: {
        setScoreAnalysisForFootballLeagueMatches(state, dataList){ 
            state.footballLeagueMatches = dataList;
        },
        setScoreAnalysisForFootballScore(state, footballScore){ 
            state.footballScore = footballScore;
        },
        setScoreAnalysisForFootballScoreParams(state, params){ 
            state.footballScoreQueryParams = params;
        },        
        //保存比分分析分数列表数据，避免重复查询
        setScoreAnalysisForHomeAndAwayTeamScore(state, dataList){ 
            state.homeAndAwayTeamScoreList = dataList;
        },
        setScoreAnalysisForHomeAndAwayTeamScoreParams(state, params){ 
            state.homeAndAwayTeamScoreQueryParams = params;
        },
        setScoreAnalysisForHomeTeamScore(state, dataList){ 
            state.homeTeamScoreList = dataList;
        },
        setScoreAnalysisForHomeTeamScoreParams(state, params){ 
            state.homeTeamScoreQueryParams = params;
        },
        setScoreAnalysisForAwayTeamScore(state, dataList){ 
            state.awayTeamScoreList = dataList;
        },
        setScoreAnalysisForAwayTeamScoreParams(state, params){ 
            state.awayTeamScoreQueryParams = params;
        },            
        clearAllScoreAnalysis(state){ 
            //将所有存储数据恢复到原样
            state.homeAndAwayTeamScoreList = [];
            state.homeAndAwayTeamScoreQueryParams = null;
            state.homeTeamScoreList = [];
            state.homeTeamScoreQueryParams = null;
            state.awayTeamScoreList = [];
            state.awayTeamScoreQueryParams = null;
            state.footballScore = null;
            state.footballScoreQueryParams = null;
            state.footballLeagueMatches = [];
        }                   
    },
    actions: {
        //异步更改数据
        setScoreAnalysisForFootballLeagueMatchesAsyn(context, dataList){ 
            context.commit('setScoreAnalysisForFootballLeagueMatches',dataList);
        },
        setScoreAnalysisForFootballScoreAsyn(context, footballScore){ 
            context.commit('setScoreAnalysisForFootballScore',footballScore);
        },
        setScoreAnalysisForFootballScoreParamsAsyn(context, params){ 
            context.commit('setScoreAnalysisForFootballScoreParams',params);
        },        
        setScoreAnalysisForHomeAndAwayTeamScoreAsyn(context, dataList){ 
            context.commit('setScoreAnalysisForHomeAndAwayTeamScore',dataList);
        },
        setScoreAnalysisForHomeAndAwayTeamScoreParamsAsyn(context, params){ 
            context.commit('setScoreAnalysisForHomeAndAwayTeamScoreParams',params);
        },
        setScoreAnalysisForHomeTeamScoreAsyn(context, dataList){ 
            context.commit('setScoreAnalysisForHomeTeamScore',dataList);
        },
        setScoreAnalysisForHomeTeamScoreParamsAsyn(context, params){ 
            context.commit('setScoreAnalysisForHomeTeamScoreParams',params);
        },
        setScoreAnalysisForAwayTeamScoreAsyn(context, dataList){ 
            context.commit('setScoreAnalysisForAwayTeamScore',dataList);
        },
        setScoreAnalysisForAwayTeamScoreParamsAsyn(context, params){ 
            context.commit('setScoreAnalysisForAwayTeamScoreParams',params);
        }             
    }
};