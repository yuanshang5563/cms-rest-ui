/**
 * 保存赛季类别管理相关数据
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
        //保存赛季类别列表数据，避免重复查询
        setSeasonCategoryListData(state, res){ 
            state.pageResult = res.data.list;
			state.total= res.data.total;
        },
        //保存列表参数数据
        setSeasonCategoryQueryParams(state, params){ 
            state.queryParams = params;
        },
        setSeasonCategoryShow(state, show){ 
            state.show = show;
        },
        clearAllSeasonCategory(state){ 
            //将所有存储数据恢复到原样
            state.show = true;
            state.total = 0;
            state.pageResult = [];
            state.queryParams = null;
        }         
    },
    actions: {
        //异步更改数据
        setSeasonCategoryListDataAsyn(context, res){ 
            context.commit('setSeasonCategoryListData',res);
        },
        setSeasonCategoryQueryParamsAsyn(context, params){ 
            context.commit('setSeasonCategoryQueryParams',params);
        },
        setSeasonCategoryShowAsyn(context, show){ 
            context.commit('setSeasonCategoryShow',show);
        },
        clearAllSeasonCategoryAsyn(context){ 
            context.commit('clearAllSeasonCategory');
        }          
    }
};