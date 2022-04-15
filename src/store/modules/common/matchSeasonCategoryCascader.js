/**
 * 保存级联数据
 */
export default {
    state: {
        leagueMatches: null  //列表数据
    },
    getters: {
   
    },
    mutations: {
        //保存联赛数据，避免重复查询
        setLeagueMatchList(state, res){ 
            state.leagueMatches = res.data;
        },
        clearAllCommonMatchCascader(state){ 
            //将所有存储数据恢复到原样
            state.leagueMatches = null;
        }                   
    },
    actions: {
        //异步更改数据
        setLeagueMatchesAsyn(context, res){ 
            context.commit('setLeagueMatchList',res);
        },
        clearAllCommonMatchCascaderAsyn(context, show){ 
            context.commit('clearAllCommonMatchCascader',show);
        }                   
    }
};