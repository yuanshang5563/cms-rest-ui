/**
 * 保存赛季类别分析管理相关数据
 */
export default {
    state: {
        leagueMatch: null,
        seasonCategory: null,
        scoreList: [],  //列表数据
        scoreQueryParams: null, //分数查询参数map
        seasonList: [],
        seasonQueryParams: null, //赛季查询参数map
        seasonCategoryList: [],
        seasonCategoryQueryParams: null, //类别查询参数map
    },
    getters: {
   
    },
    mutations: {
        setSeasonCategoryAnalysisForLeagueMatch(state, match){ 
            state.leagueMatch = match;
        },
        setSeasonCategoryAnalysisForSeasonCategory(state, category){ 
            state.seasonCategory = category;
        },        
        //保存类别分析分数列表数据，避免重复查询
        setSeasonCategoryAnalysisForSocre(state, res){ 
            state.scoreList = res.data;
        },
        //保存列表参数数据
        setSeasonCategoryAnalysisForSocreParams(state, params){ 
            state.scoreQueryParams = params;
        },
        setSeasonCategoryAnalysisForSeason(state, res){ 
            state.seasonList = res.data;
        },
        setSeasonCategoryAnalysisForSeasonParams(state, params){ 
            state.seasonQueryParams = params;
        },
         setSeasonCategoryAnalysisForCategoryList(state, res){ 
            state.seasonCategoryList = res.data;
        },
        setSeasonCategoryAnalysisForCategoryListParams(state, params){ 
            state.seasonCategoryQueryParams = params;
        },              
        clearAllSeasonCategoryAnalysis(state){ 
            //将所有存储数据恢复到原样
            state.leagueMatch = null;
            state.scoreList = [];
            state.scoreQueryParams = null;
            state.seasonList = [];
            state.seasonQueryParams = null;
            state.seasonCategoryList = [];
            state.seasonCategoryQueryParams = null;
        }                   
    },
    actions: {
        //异步更改数据
        setSeasonCategoryAnalysisForLeagueMatchAsyn(context, match){ 
            context.commit('setSeasonCategoryAnalysisForLeagueMatch',match);
        },
        setSeasonCategoryAnalysisForSeasonCategoryAsyn(context, seasonCategory){ 
            context.commit('setSeasonCategoryAnalysisForSeasonCategory',seasonCategory);
        },        
        setSeasonCategoryAnalysisForSocreAsyn(context, res){ 
            context.commit('setSeasonCategoryAnalysisForSocre',res);
        },
        setSeasonCategoryAnalysisForSocreParamsAsyn(context, params){ 
            context.commit('setSeasonCategoryAnalysisForSocreParams',params);
        },
        setSeasonCategoryAnalysisForSeasonAsyn(context, res){ 
            context.commit('setSeasonCategoryAnalysisForSeason',res);
        },
        setSeasonCategoryAnalysisForSeasonParamsAsyn(context, params){ 
            context.commit('setSeasonCategoryAnalysisForSeasonParams',params);
        },
        setSeasonCategoryAnalysisForCategoryListAsyn(context, res){ 
            context.commit('setSeasonCategoryAnalysisForCategoryList',res);
        },
        setSeasonCategoryAnalysisForCategoryListParamsAsyn(context, params){ 
            context.commit('setSeasonCategoryAnalysisForCategoryListParams',params);
        },               
        clearAllSeasonCategoryAnalysisAsyn(context){ 
            context.commit('clearAllSeasonCategoryAnalysis');
        }                  
    }
};