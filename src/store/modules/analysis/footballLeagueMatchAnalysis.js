/**
 * 保存联赛分析管理相关数据
 */
export default {
    state: {
        pageResult: [],  //列表数据
        total: 0, //列表总数
        queryParams: null //查询参数map
    },
    getters: {
   
    },
    mutations: {
        //保存联赛列表数据，避免重复查询
        setLeagueMatchAnalysisData(state, res){ 
            state.pageResult = res.data.list;
			state.total= res.data.total;
        },
        //保存列表参数数据
        setLeagueMatchAnalysisParams(state, params){ 
            state.queryParams = params;
        },
        clearAllLeagueMatchAnalysis(state){ 
            //将所有存储数据恢复到原样
            state.total = 0;
            state.pageResult = [];
            state.queryParams = null;
        }                   
    },
    actions: {
        //异步更改数据
        setLeagueMatchAnalysisDataAsyn(context, res){ 
            context.commit('setLeagueMatchAnalysisData',res);
        },
        setLeagueMatchAnalysisParamsAsyn(context, params){ 
            context.commit('setLeagueMatchAnalysisParams',params);
        },
        clearAllLeagueMatchAnalysisAsyn(context){ 
            context.commit('clearAllLeagueMatchAnalysis');
        }                  
    }
};