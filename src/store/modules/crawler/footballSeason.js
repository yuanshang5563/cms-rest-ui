/**
 * 保存赛季管理相关数据
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
        //保存赛季列表数据，避免重复查询
        setSeasonListData(state, res){ 
            state.pageResult = res.data.list;
			state.total= res.data.total;
        },
        //保存列表参数数据
        setSeasonQueryParams(state, params){ 
            state.queryParams = params;
        },
        setSeasonShow(state, show){ 
            state.show = show;
        },
        clearAllSeason(state){ 
            //将所有存储数据恢复到原样
            state.show = true;
            state.total = 0;
            state.pageResult = [];
            state.queryParams = null;
        }                   
    },
    actions: {
        //异步更改数据
        setSeasonListDataAsyn(context, res){ 
            context.commit('setSeasonListData',res);
        },
        setSeasonQueryParamsAsyn(context, params){ 
            context.commit('setSeasonQueryParams',params);
        },
        setSeasonShowAsyn(context, show){ 
            context.commit('setSeasonShow',show);
        },
        clearAllSeasonAsyn(context){ 
            context.commit('clearAllSeason');
        }                  
    }
};