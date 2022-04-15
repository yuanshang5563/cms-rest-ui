/**
 * 保存积分管理相关数据
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
        //保存列表数据，避免重复查询
        setIntegralListData(state, res){ 
            state.pageResult = res.data.list;
			state.total= res.data.total;
        },
        //保存列表参数数据
        setIntegralQueryParams(state, params){ 
            state.queryParams = params;
        },
        clearAllIntegral(state){ 
            //将所有存储数据恢复到原样
            state.total = 0;
            state.pageResult = [];
            state.queryParams = null;
        }                   
    },
    actions: {
        //异步更改数据
        setIntegralListDataAsyn(context, res){ 
            context.commit('setIntegralListData',res);
        },
        setIntegralQueryParamsAsyn(context, params){ 
            context.commit('setIntegralQueryParams',params);
        },
        clearAllIntegralAsyn(context){ 
            context.commit('clearAllIntegral');
        }                  
    }
};