/**
 * 保存比分详情管理相关数据
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
        //保存比分详情列表数据，避免重复查询
        setScoreDetailListData(state, res){ 
            state.pageResult = res.data.list;
			state.total= res.data.total;
        },
        //保存列表参数数据
        setScoreDetailQueryParams(state, params){ 
            state.queryParams = params;
        },
        clearAllScoreDetail(state){ 
            //将所有存储数据恢复到原样
            state.show = true;
            state.total = 0;
            state.pageResult = [];
            state.queryParams = null;
        }                   
    },
    actions: {
        //异步更改数据
        setScoreDetailListDataAsyn(context, res){ 
            context.commit('setScoreDetailListData',res);
        },
        setScoreDetailQueryParamsAsyn(context, params){ 
            context.commit('setScoreDetailQueryParams',params);
        },
        clearAllScoreDetailAsyn(context, show){ 
            context.commit('clearAllScoreDetail',show);
        }                  
    }
};