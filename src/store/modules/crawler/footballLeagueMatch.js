/**
 * 保存联赛管理相关数据
 */
export default {
    state: {
        pageResult: [],  //列表数据
        total: 0, //列表总数
        queryParams: null, //查询参数map
        show: true //爬虫切换按钮
    },
    getters: {
   
    },
    mutations: {
        //保存联赛列表数据，避免重复查询
        setLeagueMatchListData(state, res){ 
            state.pageResult = res.data.list;
			state.total= res.data.total;
        },
        //保存列表参数数据
        setLeagueMatchQueryParams(state, params){ 
            state.queryParams = params;
        },
        setLeagueMatchShow(state, show){ 
            state.show = show;
        },
        clearAllLeagueMatch(state){ 
            //将所有存储数据恢复到原样
            state.show = true;
            state.total = 0;
            state.pageResult = [];
            state.queryParams = null;
        }                   
    },
    actions: {
        //异步更改数据
        setLeagueMatchListDataAsyn(context, res){ 
            context.commit('setLeagueMatchListData',res);
        },
        setLeagueMatchQueryParamsAsyn(context, params){ 
            context.commit('setLeagueMatchQueryParams',params);
        },
        setLeagueMatchShowAsyn(context, show){ 
            context.commit('setLeagueMatchShow',show);
        },
        clearAllLeagueMatchAsyn(context){ 
            context.commit('clearAllLeagueMatch');
        }                  
    }
};